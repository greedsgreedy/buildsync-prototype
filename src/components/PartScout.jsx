import { useEffect, useMemo, useState } from 'react';

const BRAND_SCOPE = ['all', 'US Domestic brands', 'JDM', 'Euro', 'Alibaba', 'Temu'];
const JDM_BRANDS = ['HKS', 'GReddy', 'Tomei', 'Enkei', 'SSR', 'Work', 'Volk', 'Yokohama', 'Nitto', 'Bridgestone', 'Toyota', 'Invidia'];
const EURO_BRANDS = ['Akrapovic', 'KW', 'Eibach', 'H&R', 'BMW', 'AWE', 'Milltek', 'Brembo', 'Continental', 'Michelin', 'Liqui'];

const titleCase = (value) => (value || '')
  .split(/[\s_-]+/)
  .filter(Boolean)
  .map(v => v.charAt(0).toUpperCase() + v.slice(1))
  .join(' ');

function inferBrandScope(part) {
  const brand = (part.brand || '').toLowerCase();
  const vendorNames = (part.vendors || []).map(v => (v.vendor_name || '').toLowerCase());
  if (vendorNames.some(v => v.includes('alibaba'))) return 'Alibaba';
  if (vendorNames.some(v => v.includes('temu'))) return 'Temu';
  if (JDM_BRANDS.some(v => brand.includes(v.toLowerCase()))) return 'JDM';
  if (EURO_BRANDS.some(v => brand.includes(v.toLowerCase()))) return 'Euro';
  return 'US Domestic brands';
}

export default function PartScout({ store }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [brandScope, setBrandScope] = useState(['all']);
  const [brand, setBrand] = useState(['all']);
  const [partType, setPartType] = useState(['all']);
  const [openFilters, setOpenFilters] = useState({ brands: true, parts: true, scope: false });
  const activeVin = store?.activeVehicle?.fitment?.vin || '';

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

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const qs = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
        const response = await fetch(`/api/parts/search${qs}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error || 'Failed to load PartScout data');
          setRows([]);
        } else {
          setRows(Array.isArray(payload.results) ? payload.results : []);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load PartScout data');
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const brandOptions = useMemo(() => ['all', ...new Set(rows.map(item => item.brand).filter(Boolean))], [rows]);
  const partTypes = useMemo(() => ['all', ...new Set(rows.map(item => item.category).filter(Boolean))], [rows]);

  const filtered = useMemo(() => rows.filter((part) => {
    const scope = inferBrandScope(part);
    if (!brandScope.includes('all') && !brandScope.includes(scope)) return false;
    if (!brand.includes('all') && !brand.includes(part.brand)) return false;
    if (!partType.includes('all') && !partType.includes(part.category)) return false;
    return true;
  }), [rows, brandScope, brand, partType]);

  const hasActiveFilters = !brand.includes('all') || !partType.includes('all') || !brandScope.includes('all');
  const clearFilters = () => {
    setBrand(['all']);
    setPartType(['all']);
    setBrandScope(['all']);
  };

  return (
    <div className="tab-content">
      <div className="card partscout-hero">
        <div>
          <div className="card-title">PartScout Engine</div>
          <h3>Find the right parts. Compare everywhere.</h3>
          <p>Search and compare parts across vendors with fitment-first context for your selected vehicle {activeVin ? '(VIN profile active)' : '(VIN optional)' }.</p>
        </div>
        <button className="btn btn-yellow">Realtime catalog data</button>
      </div>
      <div className="card">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="input search-input"
            placeholder="Search parts, brands, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-compact-head" style={{ marginTop: 8 }}>
          <div className="card-title">Filters</div>
          {hasActiveFilters && <button className="rm-btn" onClick={clearFilters}>Clear</button>}
        </div>
        <FilterSection title="Brands" value={brand.includes('all') ? 'All brands' : `${brand.length} selected`} open={openFilters.brands} onToggle={() => setOpenFilters(prev => ({ ...prev, brands: !prev.brands }))}>
          <div className="chips-row compact-chips">
            {brandOptions.map(item => (
              <button key={item} className={`chip ${brand.includes(item) ? 'on' : ''}`} onClick={() => toggleMulti(item, brand, setBrand)}>
                {item === 'all' ? 'All brands' : item}
              </button>
            ))}
          </div>
        </FilterSection>
        <FilterSection title="Parts" value={partType.includes('all') ? 'All parts' : `${partType.length} selected`} open={openFilters.parts} onToggle={() => setOpenFilters(prev => ({ ...prev, parts: !prev.parts }))}>
          <div className="chips-row compact-chips">
            {partTypes.map(item => (
              <button key={item} className={`chip ${partType.includes(item) ? 'on' : ''}`} onClick={() => toggleMulti(item, partType, setPartType)}>
                {item === 'all' ? 'All parts' : titleCase(item)}
              </button>
            ))}
          </div>
        </FilterSection>
        <FilterSection title="Brand scope" value={brandScope.includes('all') ? 'All scopes' : `${brandScope.length} selected`} open={openFilters.scope} onToggle={() => setOpenFilters(prev => ({ ...prev, scope: !prev.scope }))}>
          <div className="chips-row compact-chips">
            {BRAND_SCOPE.map(scope => (
              <button key={scope} className={`chip ${brandScope.includes(scope) ? 'on' : ''}`} onClick={() => toggleMulti(scope, brandScope, setBrandScope)}>
                {scope === 'all' ? 'All scopes' : scope}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
      <div className="card">
        <div className="card-title">PartScout Results ({filtered.length})</div>
        {loading && <div className="estimate-note">Loading realtime catalog data...</div>}
        {!loading && error && <div className="estimate-note">Supabase error: {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="estimate-note">No rows found. Seed `parts` and `part_prices` to start comparison.</div>
        )}
        {!loading && !error && filtered.map((part) => {
          const prices = (part.vendors || []).slice().sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
          const lowest = prices.length ? Number(prices[0].price || 0) : null;
          return (
            <div className="partscout-row" key={part.id}>
              <div className="partscout-row-head">
                <div>
                  <div className="quick-result-title">{part.name}</div>
                  <div className="estimate-note">{part.brand} · {part.category}</div>
                </div>
                {lowest !== null && <div className="row-value">from ${lowest.toLocaleString()}</div>}
              </div>
              {prices.length > 0 ? (
                <table className="vendor-table">
                  <tbody>
                    {prices.map((price) => (
                      <tr key={price.id}>
                        <td className="vn">{price.vendor_name}</td>
                        <td className={`vp ${Number(price.price || 0) === lowest ? 'price-low' : ''}`}>${Number(price.price || 0).toLocaleString()}</td>
                        <td>
                          <a className="pbtn link-btn buy-link-btn" href={price.link || part.product_url || '#'} target="_blank" rel="noreferrer">
                            Where to buy
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="estimate-note">No vendor prices yet for this part.</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterSection({ title, value, open, onToggle, children }) {
  return (
    <div className={`filter-section collapse ${open ? 'open' : ''}`}>
      <button className="filter-toggle" onClick={onToggle}>
        <span>{title}</span>
        <strong>{value}</strong>
        <em>{open ? '−' : '+'}</em>
      </button>
      {open && <div className="filter-body">{children}</div>}
    </div>
  );
}
