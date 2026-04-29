import { useMemo, useState } from 'react';
import { LOCAL_SHOPS } from '../data';

const SERVICE_FILTERS = ['all','Maintenance','Tuning','Diagnostics','Suspension','Tint','PPF','Detailing','Tires','Alignment','Lift kits','Aero install','EV diagnostics'];
const SPEC_FILTERS = ['all','All vehicles','JDM','Euro','Domestic','Truck','SUV','EV','Toyota','BMW','Tesla','Jeep'];
const COUNTRY_FILTERS = ['all','United States','Japan','Germany','United Kingdom','Australia'];

export default function LocalShops({ store }) {
  const [services, setServices] = useState(['all']);
  const [specializations, setSpecializations] = useState(['all']);
  const [country, setCountry] = useState('all');
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const activeVehicle = store.activeVehicle;

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

  const filtered = useMemo(() => LOCAL_SHOPS.filter(shop => {
    if (!services.includes('all') && !services.some(item => shop.services.includes(item))) return false;
    if (!specializations.includes('all') && !specializations.some(item => shop.specs.includes(item))) return false;
    if (country !== 'all' && shop.country !== country) return false;
    if (query) {
      const q = query.toLowerCase();
      const haystack = [shop.name, shop.type, shop.city, shop.country, shop.note, ...shop.services, ...shop.specs].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }), [country, query, services, specializations]);

  const liveSearch = [
    activeVehicle?.make,
    activeVehicle?.model,
    !services.includes('all') ? services.join(' ') : 'auto shop',
    !specializations.includes('all') ? specializations.join(' ') : '',
    country !== 'all' ? country : '',
    location || 'near me',
  ].filter(Boolean).join(' ');

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">Find local automotive businesses</div>
        <div className="form-grid">
          <input className="input span-2" placeholder="Search shops, services, specializations..." value={query} onChange={e => setQuery(e.target.value)} />
          <input className="input span-2" placeholder="City, region, ZIP, or country" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Country</div>
          <div className="chips-row compact-chips">
            {COUNTRY_FILTERS.map(item => (
              <button key={item} className={`chip ${country===item?'on':''}`} onClick={() => setCountry(item)}>
                {item === 'all' ? 'All countries' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Service</div>
          <div className="chips-row compact-chips">
            {SERVICE_FILTERS.map(item => (
              <button key={item} className={`chip ${services.includes(item)?'on':''}`} onClick={() => toggleMulti(item, services, setServices)}>
                {item === 'all' ? 'All services' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Specialization</div>
          <div className="chips-row compact-chips">
            {SPEC_FILTERS.map(item => (
              <button key={item} className={`chip ${specializations.includes(item)?'on':''}`} onClick={() => toggleMulti(item, specializations, setSpecializations)}>
                {item === 'all' ? 'All specializations' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="estimate-note">
          Prototype listings are sample data. Live search would connect to maps/review APIs and support country-aware phone formatting, local languages, distance units, availability, and vehicle specialization.
        </div>
      </div>

      <div className="rbar">
        <span className="rbar-count">Showing {filtered.length} businesses</span>
        <button className="rm-btn" onClick={() => alert(`Live local search: ${liveSearch}`)}>Search live</button>
      </div>

      <div className="shop-grid">
        {filtered.map(shop => (
          <div key={shop.id} className="shop-card">
            <div className="shop-head">
              <div>
                <div className="shop-name">{shop.name}</div>
                <div className="shop-type">{shop.type} · {shop.city} · {shop.country}</div>
              </div>
              <div className="shop-rating">{shop.rating.toFixed(1)} ★</div>
            </div>
            <div className="shop-note">{shop.note}</div>
            <div className="list-row"><span className="row-name">Phone</span><span className="row-value">{shop.phone}</span></div>
            <div className="list-row"><span className="row-name">Email</span><span className="row-value">{shop.email}</span></div>
            <div className="list-row">
              <span className="row-name">Website</span>
              <span className="row-value">
                <a
                  href={shop.website || `https://www.google.com/search?q=${encodeURIComponent(`${shop.name} ${shop.city}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {shop.website ? 'Open website' : 'Search website'}
                </a>
              </span>
            </div>
            <div className="shop-tags">
              {shop.specs.map(spec => <span key={spec}>{spec}</span>)}
            </div>
            <div className="shop-services">
              {shop.services.map(item => <span key={item}>{item}</span>)}
            </div>
            <div className="shop-actions">
              <button className="pbtn" onClick={() => alert(`Save shop: ${shop.name}`)}>Save</button>
              <button className="pbtn" onClick={() => alert(`Request quote: ${shop.name}`)}>Quote</button>
              <button className="pbtn" onClick={() => alert(`Directions/search hook: ${shop.name}`)}>Directions</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
