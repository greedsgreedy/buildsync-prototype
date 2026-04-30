import { useCallback, useEffect, useState } from 'react';

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
      importCatalogFeedRows(previewData.rows);
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
            <span className="row-name">{row.part} · {row.vendor}</span>
            <span className="row-value">${Number(row.price || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
