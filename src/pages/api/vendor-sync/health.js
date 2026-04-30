import { createClient } from '@supabase/supabase-js';

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    res.status(500).json({ error: 'Supabase env vars are not configured' });
    return;
  }

  const { data, error } = await supabase
    .from('vendor_sync_runs')
    .select('id,vendor_name,source_type,status,rows_seen,rows_upserted,error_count,error_summary,duration_ms,started_at,finished_at')
    .order('started_at', { ascending: false })
    .limit(100);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const latestByVendor = {};
  for (const row of data || []) {
    if (!latestByVendor[row.vendor_name]) latestByVendor[row.vendor_name] = row;
  }

  res.status(200).json({
    total_runs: (data || []).length,
    vendors: Object.values(latestByVendor),
    runs: data || [],
  });
}
