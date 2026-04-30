import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '../../../lib/rateLimit';

const SOURCE_QUALITY = {
  official_api: 95,
  affiliate_feed: 80,
  csv_feed: 65,
  manual: 40,
};

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const nxt = line[i + 1];
    if (ch === '"' && inQuotes && nxt === '"') {
      cur += '"';
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase());
  return lines.slice(1).map(line => {
    const cols = parseCsvLine(line);
    const row = {};
    headers.forEach((h, idx) => { row[h] = cols[idx] || ''; });
    return row;
  });
}

function normalizeRow(row) {
  const part = row.part || row.part_name || row.name || '';
  const brand = row.brand || '';
  const vendor = row.vendor || row.vendor_name || row.seller || '';
  const price = Number(row.price || row.sale_price || 0);
  const shipping = Number(row.shipping || row.shipping_cost || 0);
  const url = row.url || row.link || row.product_url || '';
  const fitment = row.fitment || row.vehicle_compatibility || '';
  const category = (row.category || row.part_type || 'performance').toLowerCase();
  const image_url = row.image_url || row.image || '';

  return {
    part: part.trim(),
    brand: brand.trim() || 'Unknown',
    vendor: vendor.trim(),
    price: Number.isFinite(price) ? price : 0,
    shipping: Number.isFinite(shipping) ? shipping : 0,
    url: url.trim(),
    fitment: fitment.trim(),
    category: category.trim() || 'performance',
    image_url: image_url.trim() || null,
  };
}

async function createSyncRun(supabase, payload) {
  const { data, error } = await supabase
    .from('vendor_sync_runs')
    .insert([payload])
    .select('id')
    .single();
  if (error) return null;
  return data?.id || null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const csv = req.body?.csv;
  const vendorName = (req.body?.vendor_name || 'Unknown Vendor').toString().trim();
  const sourceType = (req.body?.source_type || 'csv_feed').toString().trim();
  const qualityScore = SOURCE_QUALITY[sourceType] || SOURCE_QUALITY.csv_feed;

  if (!csv || typeof csv !== 'string') {
    res.status(400).json({ error: 'csv text required' });
    return;
  }

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rl = checkRateLimit(`vendor-import:${ip}`, { limit: 15, windowMs: 60_000 });
  if (!rl.ok) {
    res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
    return;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    res.status(500).json({ error: 'Supabase env vars are not configured' });
    return;
  }

  const startedAt = Date.now();
  const runId = await createSyncRun(supabase, {
    vendor_name: vendorName,
    source_type: sourceType,
    status: 'running',
    rows_seen: 0,
    rows_upserted: 0,
    error_count: 0,
    started_at: new Date().toISOString(),
  });

  const parsedRows = parseCsv(csv).map(normalizeRow);
  const validRows = parsedRows.filter(r => r.part && r.vendor && Number.isFinite(r.price));

  let upserted = 0;
  let errors = 0;
  let firstError = '';

  for (const row of validRows) {
    try {
      const fitments = row.fitment
        ? row.fitment.split(/[|,]/).map(v => v.trim()).filter(Boolean)
        : ['Toyota Supra A90/A91', 'BMW B58'];

      const { data: partData, error: partErr } = await supabase
        .from('parts')
        .upsert([{
          name: row.part,
          category: row.category,
          brand: row.brand,
          image_url: row.image_url,
          product_url: row.url || null,
          vehicle_compatibility: fitments,
          updated_at: new Date().toISOString(),
        }], { onConflict: 'name,brand' })
        .select('id')
        .single();

      if (partErr || !partData?.id) {
        errors += 1;
        if (!firstError) firstError = partErr?.message || 'Part upsert failed';
        continue;
      }

      const partId = partData.id;
      const finalPrice = Math.max(0, Number(row.price) + Math.max(0, Number(row.shipping || 0)));

      const { error: offerErr } = await supabase
        .from('part_prices')
        .upsert([{
          part_id: partId,
          vendor_name: row.vendor,
          price: finalPrice,
          link: row.url || null,
          source_type: sourceType,
          quality_score: qualityScore,
          last_updated: new Date().toISOString(),
        }], { onConflict: 'part_id,vendor_name' });

      if (offerErr) {
        errors += 1;
        if (!firstError) firstError = offerErr.message;
        continue;
      }

      const { error: historyErr } = await supabase
        .from('price_history')
        .insert([{
          part_id: partId,
          vendor_name: row.vendor,
          price: finalPrice,
          source_type: sourceType,
          quality_score: qualityScore,
          captured_at: new Date().toISOString(),
        }]);

      if (historyErr) {
        errors += 1;
        if (!firstError) firstError = historyErr.message;
        continue;
      }

      upserted += 1;
    } catch (err) {
      errors += 1;
      if (!firstError) firstError = err.message || 'Unexpected import error';
    }
  }

  if (runId) {
    const status = errors === 0 ? 'success' : (upserted > 0 ? 'partial' : 'failed');
    await supabase
      .from('vendor_sync_runs')
      .update({
        status,
        rows_seen: validRows.length,
        rows_upserted: upserted,
        error_count: errors,
        error_summary: firstError || null,
        duration_ms: Date.now() - startedAt,
        finished_at: new Date().toISOString(),
      })
      .eq('id', runId);
  }

  res.status(200).json({
    ok: true,
    run_id: runId,
    vendor_name: vendorName,
    source_type: sourceType,
    rows_seen: validRows.length,
    rows_upserted: upserted,
    error_count: errors,
    error_summary: firstError || null,
  });
}
