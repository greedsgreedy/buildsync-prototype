// src/components/BudgetPlanner.jsx
import { useState, useMemo } from 'react';
import { PARTS, CAT_META, BP_PHASES, minPrice } from '../data';

const PRI_META = {
  must: { label:'Must have', cls:'pri-must' },
  want: { label:'Want',      cls:'pri-want' },
  nice: { label:'Nice to have', cls:'pri-nice' },
};

const BUILD_GOALS = {
  daily: {
    label: 'Daily driver',
    note: 'Reliable power, comfort, tires/brakes, and maintenance before spicy stuff.',
    parts: ['BMS Cold Air Intake','MHD WiFi OBD2 Dongle','MHD Bootmod3 Stage 2 Tune','StopTech Street Brake Pads','Continental ExtremeContact Sport 02 275/35ZR19','Motul 8100 X-cess 5W-40 (5L)','NGK Iridium Spark Plugs (set)','Eibach Pro-Kit Springs'],
  },
  touge: {
    label: 'Touge / canyon',
    note: 'Cooling, brake feel, suspension balance, and predictable response for twisty roads.',
    parts: ['Mishimoto Intercooler Kit','KW V3 Coilovers','Cusco Front Strut Brace','Whiteline Front Sway Bar','Cusco Rear Sway Bar','EBC Yellowstuff Pads','Falken Azenis RT660 275/35R18','Volk TE37 Saga 18x10 +34'],
  },
  track: {
    label: 'Track day',
    note: 'Heat management, stopping power, data, and chassis control before chasing big power.',
    parts: ['Mishimoto Intercooler Kit','Brembo GT 6-Piston BBK','KW V3 Coilovers','AIM MXS Strada Dash Logger','Yokohama Advan A052 275/35R18','Bridgestone Potenza RE-71RS 275/35R18','Defi Boost + Oil Temp Gauges','Motul 8100 X-cess 5W-40 (5L)','Sparco Pro 2000 Bucket Seat'],
  },
  drag: {
    label: 'Drag / roll racing',
    note: 'Power adders and supporting fuel/cooling. Budget extra for tuning and drivetrain health.',
    parts: ['Pure Stage 2 Turbo','High-Flow Fuel Injectors (x6)','Walbro 450 Fuel Pump','Mishimoto Intercooler Kit','DP Race 3" Catless Downpipe','Nitto NT555RII Drag Radial 305/35R18','MHD Bootmod3 Stage 2 Tune','Defi Boost + Oil Temp Gauges'],
  },
  show: {
    label: 'Show / street presence',
    note: 'Visual impact, stance, wheels, lighting, and interior details.',
    parts: ['Seibon Carbon Fibre Hood','Carbon Fibre Front Splitter','Morimoto XB LED Headlights','Volk CE28N 18x9.5','Bride Zeta IV Bucket Seat','GR Supra OEM Floor Mats','Rocket Bunny Widebody Kit'],
  },
  starter: {
    label: 'Budget starter',
    note: 'Low-cost foundation parts that make the car feel better without blowing the build fund.',
    parts: ['BMS Cold Air Intake','MHD WiFi OBD2 Dongle','StopTech Street Brake Pads','Falken Azenis RT660 275/35R18','Motul 8100 X-cess 5W-40 (5L)','GR Supra OEM Floor Mats','Cusco Front Strut Brace'],
  },
};

export default function BudgetPlanner() {
  const [budget, setBudget]       = useState(10000);
  const [catFilter, setCatFilter] = useState('all');
  const [priFilter, setPriFilter] = useState('all');
  const [phase, setPhase]         = useState(1);
  const [goal, setGoal]           = useState('daily');
  const [checked, setChecked]     = useState(new Set());
  const [customs, setCustoms]     = useState([]);
  const [customForm, setCustomForm] = useState({ name:'', price:'', cat:'performance', pri:'must' });

  // All parts = catalog + customs
  const allParts = useMemo(() => [
    ...PARTS,
    ...customs,
  ], [customs]);

  // Selected parts with correct prices
  const selectedParts = useMemo(
    () => allParts.filter(p => checked.has(p.id)),
    [allParts, checked]
  );

  // Total using minPrice — FIXED: was using p.price which doesn't exist on catalog parts
  const selectedTotal = useMemo(
    () => selectedParts.reduce((sum, p) => sum + minPrice(p.vendors), 0),
    [selectedParts]
  );

  const remaining   = budget - selectedTotal;
  const rawPct      = budget > 0 ? Math.round(selectedTotal / budget * 100) : 0;
  const pct         = Math.min(100, rawPct);
  const barColor    = rawPct > 100 ? '#E24B4A' : rawPct > 85 ? '#EF9F27' : '#639922';

  const togglePart = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addCustom = () => {
    const price = parseFloat(customForm.price);
    if (!customForm.name.trim() || !price || price <= 0) return;
    const id = Date.now();
    setCustoms(prev => [...prev, {
      id,
      name: customForm.name,
      cat: customForm.cat,
      pri: customForm.pri,
      vendors: [{ n:'Custom', p: price, s:0, t:'us' }],
    }]);
    setChecked(prev => new Set([...prev, id]));
    setCustomForm({ name:'', price:'', cat:'performance', pri:'must' });
  };

  // Category breakdown
  const breakdown = useMemo(() => {
    const byCat = {};
    selectedParts.forEach(p => {
      const price = minPrice(p.vendors);
      byCat[p.cat] = (byCat[p.cat] || 0) + price;
    });
    return Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  }, [selectedParts]);

  // Filtered checklist
  const filteredParts = useMemo(() => allParts.filter(p => {
    if (catFilter !== 'all' && p.cat !== catFilter) return false;
    if (priFilter !== 'all' && p.pri !== priFilter) return false;
    return true;
  }), [allParts, catFilter, priFilter]);

  // Phase list
  const phaseData = BP_PHASES[phase];
  const phaseParts = PARTS.filter(p => phaseData.parts.includes(p.name));

  // Over budget items
  const overBudget = selectedTotal > budget;
  const deferSuggestions = [...selectedParts]
    .sort((a, b) => minPrice(b.vendors) - minPrice(a.vendors))
    .slice(0, 4);

  const CAT_OPTS = ['all','performance','suspension','exterior','wheels','tires','brakes','electronics','lights','oil','fueling','accessories'];
  const PRI_OPTS = ['all','must','want','nice'];
  const activeGoal = BUILD_GOALS[goal];
  const recommendedParts = PARTS.filter(p => activeGoal.parts.includes(p.name));
  const recommendedTotal = recommendedParts.reduce((sum, p) => sum + minPrice(p.vendors), 0);
  const recommendedSelected = recommendedParts.filter(p => checked.has(p.id)).length;
  const applyGoal = () => {
    setChecked(prev => new Set([...prev, ...recommendedParts.map(p => p.id)]));
  };

  return (
    <div className="tab-content">
      {/* Stats */}
      <div className="stat-grid four">
        <div className="stat"><div className="stat-val">${budget.toLocaleString()}</div><div className="stat-label">Budget</div></div>
        <div className="stat"><div className="stat-val">${selectedTotal.toLocaleString()}</div><div className="stat-label">Selected</div></div>
        <div className="stat"><div className="stat-val" style={{color: remaining < 0 ? '#E24B4A' : 'inherit'}}>{remaining >= 0 ? `$${remaining.toLocaleString()}` : `-$${Math.abs(remaining).toLocaleString()}`}</div><div className="stat-label">Remaining</div></div>
        <div className="stat"><div className="stat-val">{selectedParts.length}</div><div className="stat-label">Parts</div></div>
      </div>

      {/* Budget slider */}
      <div className="card">
        <div className="card-title">Set your budget</div>
        <div className="slider-row">
          <input
            type="range" min={500} max={50000} step={500} value={budget}
            onChange={e => setBudget(parseInt(e.target.value))}
            className="budget-slider"
          />
          <span className="slider-val">${budget.toLocaleString()}</span>
        </div>
        <div className="bar-labels">
          <span>{selectedParts.length > 0 ? `$${selectedTotal.toLocaleString()} of $${budget.toLocaleString()}` : 'Select parts below'}</span>
          <span>{selectedParts.length > 0 ? `${rawPct}%` : ''}</span>
        </div>
        <div className="budget-bar">
          <div className="budget-fill" style={{ width:`${pct}%`, background: barColor }} />
        </div>
      </div>

      {/* Build goal recommendations */}
      <div className="card">
        <div className="card-title">Recommended parts by build goal</div>
        <div className="goal-grid">
          {Object.entries(BUILD_GOALS).map(([key, item]) => (
            <button key={key} className={`goal-card ${goal===key?'active':''}`} onClick={() => setGoal(key)}>
              <span>{item.label}</span>
              <strong>{item.parts.length} suggested parts</strong>
            </button>
          ))}
        </div>
        <div className="goal-summary">
          <div>
            <div className="goal-title">{activeGoal.label}</div>
            <div className="goal-note">{activeGoal.note}</div>
          </div>
          <div className="goal-cost">
            <span>${recommendedTotal.toLocaleString()}</span>
            <small>{recommendedSelected}/{recommendedParts.length} selected</small>
          </div>
        </div>
        <div className="recommend-list">
          {recommendedParts.map(p => {
            const price = minPrice(p.vendors);
            const cm = CAT_META[p.cat] || { color:'#1e1e22', text:'#888', label:p.cat };
            const selected = checked.has(p.id);
            return (
              <div key={p.id} className="recommend-row">
                <span className={`rec-check ${selected?'on':''}`}>{selected ? '✓' : '+'}</span>
                <span className="cat-badge" style={{background:cm.color,color:cm.text,fontSize:10,padding:'2px 6px',borderRadius:6}}>{cm.label}</span>
                <span className="rec-name">{p.name}</span>
                <span className="rec-price">${price.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
        <button className="btn btn-yellow btn-full" onClick={applyGoal}>Add recommended parts to budget</button>
      </div>

      {/* Parts checklist */}
      <div className="card">
        <div className="card-title">Select parts</div>
        {/* Cat filter */}
        <div className="chips-row" style={{marginBottom:6}}>
          {CAT_OPTS.map(c => (
            <button key={c} className={`chip ${catFilter===c?'on':''}`} onClick={()=>setCatFilter(c)}>
              {c==='all'?'All':CAT_META[c]?.label||c}
            </button>
          ))}
        </div>
        {/* Pri filter */}
        <div className="chips-row" style={{marginBottom:10}}>
          {PRI_OPTS.map(p => (
            <button key={p} className={`chip ${priFilter===p?'on':''}`} onClick={()=>setPriFilter(p)}>
              {p==='all'?'All priorities':PRI_META[p]?.label||p}
            </button>
          ))}
        </div>
        <div className="hr" />
        {filteredParts.length === 0 ? (
          <div className="empty-state">No parts match</div>
        ) : filteredParts.map(p => {
          const isChecked = checked.has(p.id);
          const price = minPrice(p.vendors);
          const wouldOver = !isChecked && (selectedTotal + price > budget);
          const cm = CAT_META[p.cat] || { color:'#1e1e22', text:'#888', label:p.cat };
          const pm = PRI_META[p.pri] || { label:p.pri, cls:'pri-nice' };
          const priceColor = isChecked
            ? (selectedTotal <= budget ? '#97C459' : '#E24B4A')
            : wouldOver ? '#EF9F27' : 'inherit';
          return (
            <div key={p.id} className="pcheck-row">
              <div className={`chk ${isChecked?'on':''}`} onClick={() => togglePart(p.id)}>
                {isChecked ? '✓' : ''}
              </div>
              <div className="chk-info">
                <div className="chk-name">{p.name}</div>
                <div className="chk-sub">
                  {cm.label}{wouldOver ? ' · exceeds remaining budget' : ''}
                </div>
              </div>
              <span className="cat-badge" style={{background:cm.color,color:cm.text,fontSize:10,padding:'2px 6px',borderRadius:6}}>{cm.label}</span>
              <span className={`pri-badge ${pm.cls}`}>{pm.label}</span>
              <div className="chk-price" style={{color:priceColor}}>${price.toLocaleString()}</div>
            </div>
          );
        })}
        <div className="hr" />
        {/* Add custom */}
        <div className="card-title">Add custom part</div>
        <div className="form-grid">
          <input className="input span-2" placeholder="Part name" value={customForm.name} onChange={e=>setCustomForm(p=>({...p,name:e.target.value}))} />
          <input className="input" type="number" placeholder="Price $" value={customForm.price} onChange={e=>setCustomForm(p=>({...p,price:e.target.value}))} />
          <select className="input" value={customForm.cat} onChange={e=>setCustomForm(p=>({...p,cat:e.target.value}))}>
            {CAT_OPTS.filter(c=>c!=='all').map(c=><option key={c} value={c}>{CAT_META[c]?.label||c}</option>)}
          </select>
          <select className="input" value={customForm.pri} onChange={e=>setCustomForm(p=>({...p,pri:e.target.value}))}>
            {['must','want','nice'].map(v=><option key={v} value={v}>{PRI_META[v].label}</option>)}
          </select>
          <button className="btn btn-yellow span-2" onClick={addCustom}>+ Add part</button>
        </div>
      </div>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div className="card">
          <div className="card-title">Cost breakdown by category</div>
          <div className="bk-grid">
            {breakdown.map(([cat, amt]) => {
              const cm = CAT_META[cat] || { text:'#888', label:cat };
              const p = selectedTotal > 0 ? Math.round(amt / selectedTotal * 100) : 0;
              return (
                <div key={cat} className="bk-card">
                  <div className="bk-label">{cm.label}</div>
                  <div className="bk-val">${amt.toLocaleString()}</div>
                  <div className="bk-pct">{p}% of build</div>
                  <div className="bk-bar"><div style={{width:`${p}%`,height:'100%',background:cm.text,borderRadius:2,transition:'width .3s'}} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase order */}
      <div className="card">
        <div className="card-title">Suggested buy order</div>
        <div className="phase-tabs">
          {[1,2,3].map(n => (
            <button key={n} className={`phase-tab ${phase===n?'on':''}`} onClick={() => setPhase(n)}>
              {BP_PHASES[n].label}
            </button>
          ))}
        </div>
        <div className="phase-note">{phaseData.note}</div>
        {(() => {
          let running = 0;
          return phaseParts.map((p, i) => {
            const price = minPrice(p.vendors);
            running += price;
            const fits = running <= budget;
            const cm = CAT_META[p.cat] || { color:'#1e1e22', text:'#888', label:p.cat };
            return (
              <div key={p.id} className="phase-item">
                <div className="phase-num">{i+1}</div>
                <div className="phase-item-info">
                  <div className="phase-item-name">{p.name}</div>
                  <div className="phase-item-sub">
                    <span className="cat-badge" style={{background:cm.color,color:cm.text,fontSize:10,padding:'1px 5px',borderRadius:5}}>{cm.label}</span>
                    {' '}· Running total: ${running.toLocaleString()}
                  </div>
                </div>
                <div className="phase-item-price" style={{color: fits ? '#97C459' : '#E24B4A'}}>
                  ${price.toLocaleString()}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Over budget */}
      {overBudget && (
        <div className="over-budget-card">
          <div className="over-title">⚠ ${(selectedTotal - budget).toLocaleString()} over budget — consider deferring:</div>
          {deferSuggestions.map(p => {
            const price = minPrice(p.vendors);
            const pm = PRI_META[p.pri] || { label:p.pri, cls:'pri-nice' };
            return (
              <div key={p.id} className="pcheck-row">
                <div className="chk-info">
                  <div className="chk-name">{p.name}</div>
                  <div className="chk-sub">Defer to save ${price.toLocaleString()}</div>
                </div>
                <span className={`pri-badge ${pm.cls}`}>{pm.label}</span>
                <div className="chk-price" style={{color:'#E24B4A'}}>${price.toLocaleString()}</div>
                <button className="rm-btn" onClick={() => togglePart(p.id)}>Defer</button>
              </div>
            );
          })}
        </div>
      )}

      <button className="btn btn-yellow btn-full" onClick={() => alert('AI phased build plan — connect to backend for full AI response')}>
        Generate phased build plan →
      </button>
    </div>
  );
}
