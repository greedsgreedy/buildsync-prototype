// src/components/MyMods.jsx
import { useState } from 'react';
import Chips from './Chips';

const CAT_DOT = {
  performance:'#378ADD', exterior:'#639922', suspension:'#7F77DD',
  electronics:'#7F77DD', interior:'#EF9F27', wheels:'#639922',
};

const CAT_OPTIONS = [
  { value:'all',         label:'All' },
  { value:'performance', label:'Performance' },
  { value:'exterior',    label:'Exterior' },
  { value:'suspension',  label:'Suspension' },
  { value:'electronics', label:'Electronics' },
  { value:'interior',    label:'Interior' },
];

export default function MyMods({ store }) {
  const { installedMods, addMod, removeMod } = store;
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name:'', cat:'performance', price:'', date:'', miles:'', brand:'' });
  const [lastRemoved, setLastRemoved] = useState(null);

  const filtered = filter === 'all' ? installedMods : installedMods.filter(m => m.cat === filter);
  const totalSpent = installedMods.reduce((s, m) => s + (m.price || 0), 0);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addMod({ ...form, price: parseFloat(form.price) || 0 });
    setForm({ name:'', cat:'performance', price:'', date:'', miles:'', brand:'' });
  };

  const handleRemove = (mod) => {
    removeMod(mod.id);
    setLastRemoved(mod);
  };

  const handleUndo = () => {
    if (!lastRemoved) return;
    addMod({ ...lastRemoved });
    setLastRemoved(null);
  };

  return (
    <div className="tab-content">
      <div className="card">
        <Chips options={CAT_OPTIONS} active={filter} onChange={setFilter} />
      </div>

      <div className="card">
        <div className="card-title">
          {filtered.length} mods · ${totalSpent.toLocaleString()} total
        </div>
        {lastRemoved && (
          <div className="estimate-note" style={{ marginBottom: 10 }}>
            Removed "{lastRemoved.name}".
            <button className="pbtn" style={{ marginLeft: 8 }} onClick={handleUndo}>Undo</button>
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="empty-state">No mods in this category</div>
        ) : (
          filtered.map(m => (
            <div key={m.id} className="mod-row">
              <div className="mod-dot" style={{ background: CAT_DOT[m.cat] || '#888' }} />
              <div className="mod-info">
                <div className="mod-name">{m.name}</div>
                <div className="mod-meta">{m.brand} · {m.date} · {m.miles} mi</div>
              </div>
              <div className="mod-price">${m.price?.toLocaleString()}</div>
              <button className="rm-btn" onClick={() => handleRemove(m)}>Remove</button>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <div className="card-title">Log new mod</div>
        <div className="form-grid">
          <input className="input span-2" placeholder="Part name" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} />
          <select className="input" value={form.cat} onChange={e => setForm(p=>({...p,cat:e.target.value}))}>
            {CAT_OPTIONS.filter(o=>o.value!=='all').map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input className="input" placeholder="Brand" value={form.brand} onChange={e => setForm(p=>({...p,brand:e.target.value}))} />
          <input className="input" type="number" placeholder="Cost $" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} />
          <input className="input" placeholder="Install date" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} />
          <input className="input span-2" placeholder="Mileage" value={form.miles} onChange={e => setForm(p=>({...p,miles:e.target.value}))} />
          <button className="btn btn-yellow span-2" onClick={handleAdd}>+ Log mod</button>
        </div>
      </div>
    </div>
  );
}
