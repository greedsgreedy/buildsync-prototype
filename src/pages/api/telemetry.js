import { checkRateLimit } from '../../lib/rateLimit';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rl = checkRateLimit(`telemetry:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!rl.ok) {
    res.status(429).json({ error: 'Rate limit exceeded' });
    return;
  }
  // Prototype: log to server output only.
  // Replace with Sentry/Datadog/PostHog sink in production.
  const payload = req.body || {};
  // eslint-disable-next-line no-console
  console.log('[telemetry]', JSON.stringify({
    type: payload.type || 'unknown',
    path: payload.path || '',
    message: payload.message || '',
    ts: payload.ts || new Date().toISOString(),
  }));
  res.status(200).json({ ok: true });
}

