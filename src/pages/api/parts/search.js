import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '../../../lib/rateLimit';

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

  const cacheKey = query ? query.toLowerCase() : '__all__';
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
      vehicle_compatibility,
      part_prices (
        id,
        vendor_name,
        price,
        link,
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

  const parts = (data || []).map((part) => {
    const prices = (part.part_prices || [])
      .map((row) => ({
        id: row.id,
        vendor_name: row.vendor_name,
        price: toNumber(row.price),
        link: row.link || part.product_url || '',
        last_updated: row.last_updated,
      }))
      .sort((a, b) => a.price - b.price);

    return {
      id: part.id,
      name: part.name,
      category: part.category,
      brand: part.brand,
      image_url: part.image_url,
      product_url: part.product_url,
      vehicle_compatibility: part.vehicle_compatibility || [],
      lowest_price: prices.length ? prices[0].price : null,
      vendors: prices,
    };
  });

  const grouped = parts.reduce((acc, part) => {
    const key = part.category || 'uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(part);
    return acc;
  }, {});

  const payload = {
    query,
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
