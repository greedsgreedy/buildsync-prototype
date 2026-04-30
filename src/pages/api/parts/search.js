import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '../../../lib/rateLimit';
import { scorePartFitment } from '../../../lib/fitment';

const RESPONSE_CACHE = globalThis.__partScoutSearchCache || new Map();
globalThis.__partScoutSearchCache = RESPONSE_CACHE;
const CACHE_TTL_MS = Number(process.env.PARTSCOUT_SEARCH_CACHE_TTL_MS || 60_000);

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function firstQueryValue(value) {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function buildVehicleContextFromQuery(query) {
  return {
    year: firstQueryValue(query.year).toString().trim(),
    make: firstQueryValue(query.make).toString().trim(),
    model: firstQueryValue(query.model).toString().trim(),
    trim: firstQueryValue(query.trim).toString().trim(),
    engine: firstQueryValue(query.engine).toString().trim(),
    fitment: {
      vin: firstQueryValue(query.vin).toString().trim(),
      transmission: firstQueryValue(query.transmission).toString().trim(),
      brakePackage: firstQueryValue(query.brakePackage).toString().trim(),
      drivetrain: firstQueryValue(query.drivetrain).toString().trim(),
      emissions: firstQueryValue(query.emissions).toString().trim(),
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rl = checkRateLimit(`parts-search:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) {
    res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
    return;
  }

  const query = (req.query.q || '').toString().trim();
  const skipCache = (req.query.nocache || '').toString() === '1';
  const vehicleContext = buildVehicleContextFromQuery(req.query);
  const hasVehicleContext = Boolean(
    vehicleContext.make ||
    vehicleContext.model ||
    vehicleContext.trim ||
    vehicleContext.engine ||
    vehicleContext.fitment?.vin
  );

  const cacheKey = JSON.stringify({
    q: query ? query.toLowerCase() : '__all__',
    vehicle: hasVehicleContext ? vehicleContext : null,
  });
  const cached = RESPONSE_CACHE.get(cacheKey);
  if (!skipCache && cached && cached.expiresAt > Date.now()) {
    res.setHeader('X-Cache', 'HIT');
    res.status(200).json(cached.payload);
    return;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    res.status(500).json({ error: 'Supabase env vars are not configured' });
    return;
  }

  const baseQuery = supabase
    .from('parts')
    .select(`
      id,
      name,
      category,
      brand,
      image_url,
      product_url,
      updated_at,
      vehicle_compatibility,
      part_prices (
        id,
        vendor_name,
        price,
        link,
        source_type,
        quality_score,
        last_updated
      )
    `)
    .order('name', { ascending: true })
    .limit(100);

  const pattern = `%${query.replace(/[%_]/g, '')}%`;
  const queryBuilder = query
    ? baseQuery.or(`name.ilike.${pattern},brand.ilike.${pattern},category.ilike.${pattern}`)
    : baseQuery;
  const { data, error } = await queryBuilder;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const partIds = (data || []).map(part => part.id).filter(Boolean);
  let historyByPart = {};
  if (partIds.length) {
    const { data: historyRows, error: historyError } = await supabase
      .from('price_history')
      .select('id,part_id,vendor_name,price,source_type,quality_score,captured_at')
      .in('part_id', partIds)
      .order('captured_at', { ascending: false })
      .limit(Math.max(20, partIds.length * 8));

    if (!historyError) {
      historyByPart = (historyRows || []).reduce((acc, row) => {
        if (!acc[row.part_id]) acc[row.part_id] = [];
        if (acc[row.part_id].length < 8) {
          acc[row.part_id].push({
            id: row.id,
            vendor_name: row.vendor_name,
            price: toNumber(row.price),
            source_type: row.source_type || 'manual',
            quality_score: toNumber(row.quality_score),
            captured_at: row.captured_at,
          });
        }
        return acc;
      }, {});
    }
  }

  const parts = (data || []).map((part) => {
    const prices = (part.part_prices || [])
      .map((row) => ({
        id: row.id,
        vendor_name: row.vendor_name,
        price: toNumber(row.price),
        link: row.link || part.product_url || '',
        source_type: row.source_type || 'manual',
        quality_score: toNumber(row.quality_score),
        last_updated: row.last_updated,
      }))
      .sort((a, b) => a.price - b.price);

    const fitment = scorePartFitment(part, vehicleContext);
    const latestUpdate = prices
      .map((row) => row.last_updated)
      .filter(Boolean)
      .sort()
      .slice(-1)[0] || part.updated_at || null;
    const topQuality = prices.reduce((best, row) => Math.max(best, toNumber(row.quality_score)), 0);
    const sourceTypes = [...new Set(prices.map((row) => row.source_type).filter(Boolean))];

    return {
      id: part.id,
      name: part.name,
      category: part.category,
      brand: part.brand,
      image_url: part.image_url,
      product_url: part.product_url,
      updated_at: part.updated_at,
      vehicle_compatibility: part.vehicle_compatibility || [],
      lowest_price: prices.length ? prices[0].price : null,
      vendors: prices,
      history: (historyByPart[part.id] || []).slice().reverse(),
      fitment,
      last_updated: latestUpdate,
      source_types: sourceTypes,
      top_quality_score: topQuality,
    };
  })
  .filter((part) => part.fitment.visible);

  parts.sort((a, b) => {
    if ((b.fitment?.score || 0) !== (a.fitment?.score || 0)) {
      return (b.fitment?.score || 0) - (a.fitment?.score || 0);
    }
    return (a.lowest_price ?? Number.MAX_SAFE_INTEGER) - (b.lowest_price ?? Number.MAX_SAFE_INTEGER);
  });

  const grouped = parts.reduce((acc, part) => {
    const key = part.category || 'uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(part);
    return acc;
  }, {});

  const payload = {
    query,
    vehicle_context: hasVehicleContext ? vehicleContext : null,
    total_results: parts.length,
    groups: Object.keys(grouped).sort().map((category) => ({
      category,
      count: grouped[category].length,
      items: grouped[category],
    })),
    results: parts,
  };

  RESPONSE_CACHE.set(cacheKey, {
    payload,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  res.setHeader('X-Cache', 'MISS');
  res.status(200).json(payload);
}
