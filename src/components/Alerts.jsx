// src/components/Alerts.jsx
import { useState } from 'react';
import { PARTS, getPriceAnalytics, minPrice } from '../data';

const TYPE_META = {
  watch:   { label:'Price watch', dot:'#378ADD' },
  drop:    { label:'Drop alert',  dot:'#EF9F27' },
  restock: { label:'Restock',     dot:'#639922' },
};

export default function Alerts({ store }) {
  const { alerts, addAlert, removeAlert } = store;
  const [form, setForm] = useState({ part:'', type:'watch' });

  const handleAdd = () => {
    if (!form.part.trim()) return;
    addAlert({ ...form });
    setForm({ part:'', type:'watch' });
  };

  return (
    <div className="tab-content">
      <div className="legend-row">
        {Object.entries(TYPE_META).map(([k,v]) => (
          <span key={k} className="legend-item">
            <span className="legend-dot" style={{background:v.dot}} />
            {v.label}
          </span>
        ))}
      </div>

      <div className="card">
        {alerts.length === 0 ? (
          <div className="empty-state">No alerts set yet</div>
        ) : alerts.map(a => {
          const tm = TYPE_META[a.type] || TYPE_META.watch;
          const part = PARTS.find(p => p.name.toLowerCase().includes(a.part.toLowerCase()) || a.part.toLowerCase().includes(p.name.toLowerCase()));
          const stats = part ? getPriceAnalytics(part) : { history: [], lowest30: 0, lowest90: 0 };
          const current = part ? minPrice(part.vendors) : 0;
          const quality = part
            ? current <= stats.lowest30
              ? 'Great buy zone'
              : current <= stats.lowest90 * 1.05
                ? 'Fair price'
                : 'Wait for drop'
            : 'No pricing data';
          return (
            <div key={a.id} className="alert-row">
              <span className="alert-dot" style={{background:tm.dot}} />
              <div className="alert-main">
                <span className="alert-name">{a.part}</span>
                <div className="alert-subline">
                  <span className="alert-type-badge">{tm.label}</span>
                  <span className={`alert-quality ${quality === 'Great buy zone' ? 'good' : quality === 'Fair price' ? 'ok' : 'wait'}`}>{quality}</span>
                  {part && (
                    <span className="alert-price-meta">
                      Now ${current.toLocaleString()} · 30d low ${stats.lowest30.toLocaleString()} · 90d low ${stats.lowest90.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <button className="rm-btn" onClick={() => removeAlert(a.id)}>Remove</button>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-title">Add alert</div>
        <div className="form-grid">
          <input className="input span-2" placeholder="Part or brand name..." value={form.part} onChange={e=>setForm(p=>({...p,part:e.target.value}))} />
          <select className="input span-2" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
            <option value="watch">Price watch</option>
            <option value="drop">Drop alert</option>
            <option value="restock">Restock alert</option>
          </select>
          <button className="btn btn-yellow span-2" onClick={handleAdd}>+ Add alert</button>
        </div>
      </div>

      <button className="btn btn-full" onClick={() => alert('Live deal search — connect to scraper backend')}>
        Search live deals now →
      </button>
    </div>
  );
}
