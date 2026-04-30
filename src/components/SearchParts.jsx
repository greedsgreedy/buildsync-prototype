import { useEffect, useMemo, useState } from 'react';
import { CAT_META } from '../data';

const BRAND_SCOPE = ['all', 'US Domestic brands', 'JDM', 'Euro', 'Alibaba', 'Temu'];
const SPECIFIC_BRANDS = ['all', 'Akrapovic', 'AWE', 'Burger', 'Brembo', 'CSF', 'Eibach', 'Enkei', 'GReddy', 'HKS', 'KW', 'Milltek', 'Mishimoto', 'Pure', 'SSR', 'Tomei', 'VRSF', 'Volk', 'Work', 'BMW', 'Toyota', 'Generic'];
const PART_FILTERS = [
  'all',
  'performance',
  'downpipe',
  'exhaust',
  'intercooler',
  'suspension',
  'brakes',
  'exterior',
  'wheels',
  'tires',
  'electronics',
  'lights',
  'fueling',
  'oil',
  'accessories',
  'safety',
  'cooling',
  'intake',
  'maintenance',
  'drivetrain',
];

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

export default function SearchParts({ store, onOpenPartScout }) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [brandScope, setBrandScope] = useState(['all']);
  const [brand, setBrand] = useState(['all']);
  const [partType, setPartType] = useState(['all']);
  const [openFilters, setOpenFilters] = useState({ brands: true, parts: true, scope: false });
  const { toggleWishlist, isInWishlist } = store;

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
    if (!query.trim()) setSubmittedQuery('');
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const q = (submittedQuery || query).trim();
        const qs = q ? `?q=${encodeURIComponent(q)}` : '';
        const response = await fetch(`/api/parts/search${qs}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) {
          setError(payload.error || 'Search failed');
          setRows([]);
        } else {
          setRows(Array.isArray(payload.results) ? payload.results : []);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Search failed');
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, submittedQuery]);

  const brandOptions = useMemo(() => {
    const rowBrands = [...new Set(rows.map(item => item.brand).filter(Boolean))];
    const merged = [...new Set([...SPECIFIC_BRANDS, ...rowBrands])];
    return merged;
  }, [rows]);

  const partTypes = useMemo(() => {
    const rowTypes = [...new Set(rows.map(item => item.category).filter(Boolean))];
    const merged = [...new Set([...PART_FILTERS, ...rowTypes])];
    return merged;
  }, [rows]);

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
      <div className="card">
        <div className="card-title">Quick Search</div>
        <div className="quick-search-shell">
          <span className="search-icon">⌕</span>
          <input
            className="input quick-search-input"
            placeholder="Search parts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') setSubmittedQuery(query);
            }}
          />
        </div>
        <div className="quick-search-meta">
          <span>⚡ Press Enter for quick results</span>
          <button className="pbtn" onClick={onOpenPartScout}>🧠 Or use PartScout for smarter comparison</button>
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
            {partTypes.map(type => (
              <button key={type} className={`chip ${partType.includes(type) ? 'on' : ''}`} onClick={() => toggleMulti(type, partType, setPartType)}>
                {type === 'all' ? 'All parts' : titleCase(type)}
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
        <div className="card-title">{filtered.length} results</div>
        {loading && <div className="estimate-note">Loading search results...</div>}
        {!loading && error && <div className="estimate-note">Search error: {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="estimate-note">No parts matched. Clear filters or search input to reset to all parts.</div>
        )}
        {filtered.map(part => {
          const lowest = Number.isFinite(part.lowest_price) ? part.lowest_price : null;
          const cat = CAT_META[part.category] || { color: '#1e1e22', text: '#aaa', label: titleCase(part.category) };
          const wishlistPart = {
            id: part.id,
            name: part.name,
            cat: part.category,
            vendors: (part.vendors || []).map(v => ({ n: v.vendor_name, p: Number(v.price || 0), s: 0, t: 'us' })),
          };
          return (
            <div className="quick-result-row" key={part.id}>
              <div className="quick-result-main">
                <div className="quick-result-title">{part.name}</div>
                <div className="quick-result-meta">
                  <span className="cat-badge" style={{ background: cat.color, color: cat.text }}>{cat.label}</span>
                  {lowest !== null && <span className="row-value">from ${lowest.toLocaleString()}</span>}
                </div>
              </div>
              <button className={`pbtn ${isInWishlist(part.id) ? 'saved' : ''}`} onClick={() => toggleWishlist(wishlistPart)}>
                {isInWishlist(part.id) ? 'Saved' : 'Save'}
              </button>
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
