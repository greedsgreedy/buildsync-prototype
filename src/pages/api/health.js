export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    service: 'buildsync-prototype',
    ts: new Date().toISOString(),
  });
}

