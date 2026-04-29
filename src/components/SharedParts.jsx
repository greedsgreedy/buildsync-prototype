import { useMemo, useState } from 'react';
import { CROSS_PLATFORM_PARTS } from '../data';

const PLATFORMS = ['all','B58','B58 / BMW DME','ZF 8HP','Toyota/Lexus 2GR','Nissan/Infiniti VQ','Honda/Acura K-Series','Subaru/Toyota FA24','VW/Audi EA888','Hyundai/Kia/Genesis Theta','Cross-brand 5x114.3','Universal / bracket-specific','Universal OBD2','Universal consumable'];
const CATEGORIES = ['all','Tuning','Turbo','Fueling','Downpipe','Intake / charge air','Intake / maintenance','Intake / engine','Ignition','Drivetrain','Maintenance','Cooling','Exhaust','Suspension','Wheels','Interior / safety','Electronics','Fluids'];

export default function SharedParts({ store }) {
  const [platforms, setPlatforms] = useState(['B58']);
  const [categories, setCategories] = useState(['all']);
  const [query, setQuery] = useState('');
  const [onlyGarageRelated, setOnlyGarageRelated] = useState(true);
  const activeVehicle = store.activeVehicle;
  const appScope = store.appScope;
  const garageMatchKey = `${activeVehicle.make} ${activeVehicle.model} ${activeVehicle.trim}`.toLowerCase();

  const toggleMulti = (value, selected, setSelected) => {
    if (value === 'all') {
      setSelected(['all']);
      return;
    }
    const withoutAll = selected.filter(item => item !== 'all');
    if (withoutAll.includes(value)) {
      const next = withoutAll.filter(item => item !== value);
      setSelected(next.length ? next : ['all']);
      return;
    }
    setSelected([...withoutAll, value]);
  };

  const listLabel = (selected, allLabel) => {
    if (selected.includes('all')) return allLabel;
    if (selected.length <= 2) return selected.join(', ');
    return `${selected.length} selected`;
  };

  const filtered = useMemo(() => CROSS_PLATFORM_PARTS.filter(part => {
    if (appScope === 'supra_bmw' && !['B58', 'B58 / BMW DME', 'ZF 8HP'].includes(part.platform)) return false;
    if (!platforms.includes('all') && !platforms.includes(part.platform)) return false;
    if (!categories.includes('all') && !categories.includes(part.category)) return false;
    if (onlyGarageRelated) {
      const related = part.sharedWith.some(item => item.toLowerCase().includes(garageMatchKey) || garageMatchKey.includes(item.toLowerCase()));
      if (!related) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      const haystack = [part.name, part.brand, part.category, part.platform, part.note, ...part.sharedWith].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }), [categories, platforms, query, onlyGarageRelated, garageMatchKey, appScope]);

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">Shared platform parts</div>
        <div className="estimate-note">
          Find parts that may cross-shop between the {activeVehicle.make} {activeVehicle.model} and related BMW/B58/ZF8 platforms. Always verify year, chassis, emissions equipment, sensor locations, and tuning support before buying.
        </div>
        <div className="search-wrap shared-search">
          <span className="search-icon">⌕</span>
          <input className="input search-input" placeholder="Search B58, ZF8, BMW, Supra, turbo, fuel pump..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Platform</div>
          <div className="chips-row compact-chips">
            {PLATFORMS.map(item => (
              <button key={item} className={`chip ${platforms.includes(item)?'on':''}`} onClick={() => toggleMulti(item, platforms, setPlatforms)}>
                {item === 'all' ? 'All platforms' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Category</div>
          <div className="chips-row compact-chips">
            {CATEGORIES.map(item => (
              <button key={item} className={`chip ${categories.includes(item)?'on':''}`} onClick={() => toggleMulti(item, categories, setCategories)}>
                {item === 'all' ? 'All categories' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-actions">
          <label className="check-line">
            <input type="checkbox" checked={onlyGarageRelated} onChange={e => setOnlyGarageRelated(e.target.checked)} />
            Only show parts related to selected garage vehicle
          </label>
          {(!platforms.includes('all') || !categories.includes('all')) && (
            <button className="rm-btn" onClick={() => { setPlatforms(['all']); setCategories(['all']); }}>Clear</button>
          )}
        </div>
        <div className="estimate-note">
          Platform: {listLabel(platforms, 'All platforms')} · Category: {listLabel(categories, 'All categories')}
        </div>
      </div>

      <div className="rbar">
        <span className="rbar-count">Showing {filtered.length} shared-platform parts</span>
        <button className="rm-btn" onClick={() => alert(`Live fitment search: ${query || listLabel(platforms, 'all platforms')}`)}>Search live</button>
      </div>

      <div className="shared-grid">
        {filtered.map(part => {
          const lowest = Math.min(...part.vendors.map(v => v.p));
          return (
            <div key={part.id} className="shared-card">
              <SharedPartVisual part={part} />
              <div className="part-head">
                <div>
                  <div className="part-name">{part.name}</div>
                  <div className="shop-type">{part.brand} · {part.platform} · {part.category}</div>
                </div>
                <span className="brand-badge">from ${lowest.toLocaleString()}</span>
              </div>
              <div className="shop-note">{part.note}</div>
              <div className="filter-label">Known related fitments</div>
              <div className="shop-tags">
                {part.sharedWith.map(vehicle => <span key={vehicle}>{vehicle}</span>)}
              </div>
              <table className="vendor-table">
                <tbody>
                  {part.vendors.map(v => (
                    <tr key={v.n}>
                      <td className="vn">{v.n}</td>
                      <td className="vp">${v.p.toLocaleString()}</td>
                      <td className="vs">Verify fitment</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="shop-actions">
                <button className="pbtn" onClick={() => alert(`Save shared part: ${part.name}`)}>Save</button>
                <button className="pbtn" onClick={() => alert(`Compare fitment: ${part.name}`)}>Fitment</button>
                <button className="pbtn" onClick={() => alert(`Live vendor search: ${part.name}`)}>Vendors</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SharedPartVisual({ part }) {
  const shape = ['Wheels'].includes(part.category)
    ? 'wheel'
    : ['Exhaust','Downpipe'].includes(part.category)
      ? 'pipe'
      : ['Tuning','Electronics'].includes(part.category)
        ? 'module'
        : ['Fluids','Fueling','Maintenance'].includes(part.category)
          ? 'bottle'
          : ['Interior / safety','Suspension'].includes(part.category)
            ? 'panel'
            : 'engine';

  return (
    <div className={`part-visual shared-part-visual ${shape}`}>
      <div className="part-shape">
        <span />
      </div>
      <div className="part-visual-text">
        <strong>{part.brand}</strong>
        <small>{part.platform}</small>
      </div>
    </div>
  );
}
