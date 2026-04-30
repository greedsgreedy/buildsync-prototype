import { useCallback, useEffect, useState } from 'react';

const DEMO_FEEDS = [
  { label: 'Load A90 Shop feed', file: '/demo_vendor_feed.csv', vendor: 'A90 Shop', source: 'affiliate_feed' },
  { label: 'Load Turner feed', file: '/turner_vendor_feed.csv', vendor: 'Turner Motorsport', source: 'affiliate_feed' },
  { label: 'Load FCP Euro feed', file: '/fcpeuro_vendor_feed.csv', vendor: 'FCP Euro', source: 'affiliate_feed' },
];

function timeAgo(value) {
  if (!value) return 'Unknown';
  const then = new Date(value).getTime();
  if (!Number.isFinite(then)) return 'Unknown';
  const diffMs = Date.now() - then;
  const diffHours = Math.max(1, Math.round(diffMs / 3_600_000));
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

export default function AdminData({ store }) {
  const { catalogFeed, importCatalogFeedRows, clearCatalogFeed, logAudit } = store;
  const [csvText, setCsvText] = useState('');
  const [status, setStatus] = useState('');
  const [vendorName, setVendorName] = useState('CSV Feed');
  const [sourceType, setSourceType] = useState('csv_feed');
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthRows, setHealthRows] = useState([]);
  const [healthError, setHealthError] = useState('');

  const importCsv = async () => {
    setStatus('Importing vendor feed...');
    const res = await fetch('/api/vendor-sync/import-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        csv: csvText,
        vendor_name: vendorName,
        source_type: sourceType,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Import failed');
      return;
    }
    const previewRes = await fetch('/api/csv-normalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: csvText }),
    });
    const previewData = await previewRes.json();
    if (previewRes.ok) {
      importCatalogFeedRows((previewData.rows || []).map((row) => ({
        ...row,
        sourceType: sourceType,
        qualityScore: sourceType === 'official_api' ? 95 : sourceType === 'affiliate_feed' ? 80 : sourceType === 'csv_feed' ? 65 : 40,
        updatedAt: new Date().toISOString(),
      })));
    }
    if (typeof logAudit === 'function') {
      await logAudit('catalog_import', {
        vendor_name: vendorName,
        source_type: sourceType,
        rows_upserted: data.rows_upserted || 0,
        error_count: data.error_count || 0,
      });
    }
    setStatus(
      `Run #${data.run_id || '?'}: upserted ${data.rows_upserted || 0}/${data.rows_seen || 0}` +
      `${data.error_count ? `, ${data.error_count} errors` : ''}.`
    );
    fetchHealth();
  };

  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    setHealthError('');
    try {
      const res = await fetch('/api/vendor-sync/health');
      const data = await res.json();
      if (!res.ok) {
        setHealthError(data.error || 'Failed to load ingest health');
        setHealthRows([]);
      } else {
        setHealthRows(data.vendors || []);
      }
    } catch (err) {
      setHealthError(err.message || 'Failed to load ingest health');
      setHealthRows([]);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">CSV feed importer (admin)</div>
        <div className="form-grid">
          <input
            className="input"
            placeholder="Vendor name"
            value={vendorName}
            onChange={e => setVendorName(e.target.value)}
          />
          <select className="input" value={sourceType} onChange={e => setSourceType(e.target.value)}>
            <option value="csv_feed">CSV feed</option>
            <option value="affiliate_feed">Affiliate feed</option>
            <option value="official_api">Official API</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <textarea
          className="input profile-textarea"
          placeholder={'Paste CSV with headers: part,brand,vendor,price,shipping,url,fitment'}
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
        />
        <div className="shop-actions" style={{ marginTop: 10 }}>
          <button className="pbtn" onClick={importCsv}>Import CSV</button>
          {DEMO_FEEDS.map((feed) => (
            <button
              key={feed.file}
              className="pbtn"
              onClick={async () => {
                try {
                  const res = await fetch(feed.file);
                  const text = await res.text();
                  setCsvText(text);
                  setVendorName(feed.vendor);
                  setSourceType(feed.source);
                  setStatus(`Loaded ${feed.vendor} demo feed into the textarea.`);
                } catch (err) {
                  setStatus(err.message || 'Failed to load demo feed');
                }
              }}
            >
              {feed.label}
            </button>
          ))}
          <button className="pbtn" onClick={async () => {
            clearCatalogFeed();
            if (typeof logAudit === 'function') await logAudit('catalog_clear');
          }}>Clear feed</button>
        </div>
        {status && <div className="estimate-note">{status}</div>}
      </div>
      <div className="card">
        <div className="filter-compact-head">
          <div className="card-title">Ingest health</div>
          <button className="pbtn" onClick={fetchHealth}>Refresh</button>
        </div>
        {healthLoading && <div className="estimate-note">Loading ingest health...</div>}
        {!healthLoading && healthError && <div className="estimate-note">{healthError}</div>}
        {!healthLoading && !healthError && healthRows.length === 0 && (
          <div className="estimate-note">No sync runs yet. Import a vendor feed to initialize health rows.</div>
        )}
        {!healthLoading && !healthError && healthRows.map(row => (
          <div key={row.id} className="list-row">
            <span className="row-name">
              {row.vendor_name} · {row.source_type} · {row.status}
              <div className="estimate-note">
                last run {timeAgo(row.finished_at || row.started_at)} · {row.duration_ms || 0} ms
              </div>
            </span>
            <span className="row-value">
              {row.rows_upserted}/{row.rows_seen} · errs {row.error_count}
            </span>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Current feed rows</div>
        <div className="list-row"><span className="row-name">Rows loaded</span><span className="row-value">{catalogFeed.length}</span></div>
        {catalogFeed.slice(0, 8).map(row => (
          <div key={row.id} className="list-row">
            <span className="row-name">
              {row.part} · {row.vendor}
              <div className="estimate-note">
                {row.sourceType || 'csv_feed'} · Q{row.qualityScore || 0} · updated {timeAgo(row.updatedAt)}
              </div>
            </span>
            <span className="row-value">${Number(row.price || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
