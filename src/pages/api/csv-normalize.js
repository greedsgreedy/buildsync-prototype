import { checkRateLimit } from '../../lib/rateLimit';

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

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const csv = req.body?.csv;
  if (!csv || typeof csv !== 'string') {
    res.status(400).json({ error: 'csv text required' });
    return;
  }
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rl = checkRateLimit(`csv:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
    return;
  }
  const rows = parseCsv(csv).map((row, idx) => ({
    id: `csv-${Date.now()}-${idx}`,
    part: row.part || row.part_name || row.name || '',
    brand: row.brand || '',
    vendor: row.vendor || row.vendor_name || row.seller || '',
    price: Number(row.price || row.sale_price || 0),
    shipping: Number(row.shipping || row.shipping_cost || 0),
    url: row.url || row.link || row.product_url || '',
    fitment: row.fitment || '',
    updatedAt: new Date().toISOString(),
  })).filter(row => row.part && row.vendor && Number.isFinite(row.price));

  res.status(200).json({ count: rows.length, rows });
}
