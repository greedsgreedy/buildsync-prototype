import { useMemo, useState } from 'react';
import { LOCAL_SHOPS } from '../data';

const SERVICE_FILTERS = ['all','Maintenance','Tuning','Diagnostics','Suspension','Tint','PPF','Detailing','Tires','Alignment','Lift kits','Aero install','EV diagnostics'];
const SPEC_FILTERS = ['all','All vehicles','JDM','Euro','Domestic','Truck','SUV','EV','Toyota','BMW','Tesla','Jeep'];
const COUNTRY_FILTERS = ['all','United States','Japan','Germany','United Kingdom','Australia'];

export default function LocalShops({ store }) {
  const [service, setService] = useState('all');
  const [specialization, setSpecialization] = useState('all');
  const [country, setCountry] = useState('all');
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const activeVehicle = store.activeVehicle;

  const filtered = useMemo(() => LOCAL_SHOPS.filter(shop => {
    if (service !== 'all' && !shop.services.includes(service)) return false;
    if (specialization !== 'all' && !shop.specs.includes(specialization)) return false;
    if (country !== 'all' && shop.country !== country) return false;
    if (query) {
      const q = query.toLowerCase();
      const haystack = [shop.name, shop.type, shop.city, shop.country, shop.note, ...shop.services, ...shop.specs].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }), [country, query, service, specialization]);

  const liveSearch = [
    activeVehicle?.make,
    activeVehicle?.model,
    service !== 'all' ? service : 'auto shop',
    specialization !== 'all' ? specialization : '',
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
              <button key={item} className={`chip ${service===item?'on':''}`} onClick={() => setService(item)}>
                {item === 'all' ? 'All services' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Specialization</div>
          <div className="chips-row compact-chips">
            {SPEC_FILTERS.map(item => (
              <button key={item} className={`chip ${specialization===item?'on':''}`} onClick={() => setSpecialization(item)}>
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
