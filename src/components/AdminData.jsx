import { useState } from 'react';

export default function AdminData({ store }) {
  const { catalogFeed, importCatalogFeedRows, clearCatalogFeed } = store;
  const [csvText, setCsvText] = useState('');
  const [status, setStatus] = useState('');

  const importCsv = async () => {
    setStatus('Parsing CSV...');
    const res = await fetch('/api/csv-normalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: csvText }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || 'Import failed');
      return;
    }
    importCatalogFeedRows(data.rows);
    setStatus(`Imported ${data.count} rows. Parts catalog pricing updated.`);
  };

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">CSV feed importer (admin)</div>
        <textarea
          className="input profile-textarea"
          placeholder={'Paste CSV with headers: part,brand,vendor,price,shipping,url,fitment'}
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
        />
        <div className="shop-actions" style={{ marginTop: 10 }}>
          <button className="pbtn" onClick={importCsv}>Import CSV</button>
          <button className="pbtn" onClick={clearCatalogFeed}>Clear feed</button>
        </div>
        {status && <div className="estimate-note">{status}</div>}
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

