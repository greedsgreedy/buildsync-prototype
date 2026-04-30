import { useEffect, useMemo, useState } from 'react';
import { BRAND_SCOPE, SPECIFIC_BRANDS, PART_FILTERS, inferBrandScope, titleCase } from '../lib/partscoutFilters';

const PRESET_COMPARISON_NAMES = [
  'Downpipe options',
  'Wheel setups',
  'Street suspension shortlist',
];

function vehicleQueryParams(vehicle) {
  const fitment = vehicle?.fitment || {};
  const params = new URLSearchParams();
  const entries = {
    year: vehicle?.year,
    make: vehicle?.make,
    model: vehicle?.model,
    trim: vehicle?.trim,
    engine: vehicle?.engine,
    vin: fitment.vin,
    transmission: fitment.transmission,
    brakePackage: fitment.brakePackage,
    drivetrain: fitment.drivetrain,
    emissions: fitment.emissions,
  };
  Object.entries(entries).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params;
}

function timeAgo(value) {
  if (!value) return 'Unknown';
  const then = new Date(value).getTime();
  if (!Number.isFinite(then)) return 'Unknown';
  const diffMs = Date.now() - then;
  const diffHours = Math.max(1, Math.round(diffMs / 3_600_000));
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function PartScout({ store }) {
  const {
    activeVehicle,
    comparisonSets,
    saveComparisonSet,
    removeComparisonSet,
  } = store;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [brandScope, setBrandScope] = useState(['all']);
  const [brand, setBrand] = useState(['all']);
  const [partType, setPartType] = useState(['all']);
  const [openFilters, setOpenFilters] = useState({ brands: true, parts: true, scope: false });
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonName, setComparisonName] = useState('');

  const activeVin = activeVehicle?.fitment?.vin || '';

  const toggleMulti = (value, selected, setSelected) => {
    if (value === 'all') {
      setSelected(['all']);
      return;
    }
    const withoutAll = selected.filter((item) => item !== 'all');
    if (withoutAll.includes(value)) {
      const next = withoutAll.filter((item) => item !== value);
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
        const params = vehicleQueryParams(activeVehicle);
        if (query.trim()) params.set('q', query.trim());
        const response = await fetch(`/api/parts/search?${params.toString()}`, { signal: controller.signal });
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
  }, [query, activeVehicle]);

  const brandOptions = useMemo(() => {
    const rowBrands = [...new Set(rows.map((item) => item.brand).filter(Boolean))];
    return [...new Set([...SPECIFIC_BRANDS, ...rowBrands])];
  }, [rows]);

  const partTypes = useMemo(() => {
    const rowTypes = [...new Set(rows.map((item) => item.category).filter(Boolean))];
    return [...new Set([...PART_FILTERS, ...rowTypes])];
  }, [rows]);

  const filtered = useMemo(() => rows.filter((part) => {
    const scope = inferBrandScope(part);
    if (!brandScope.includes('all') && !brandScope.includes(scope)) return false;
    if (!brand.includes('all') && !brand.includes(part.brand)) return false;
    if (!partType.includes('all') && !partType.includes(part.category)) return false;
    return true;
  }), [rows, brandScope, brand, partType]);

  const selectedRows = useMemo(
    () => filtered.filter((part) => selectedIds.includes(part.id)),
    [filtered, selectedIds]
  );

  const hasActiveFilters = !brand.includes('all') || !partType.includes('all') || !brandScope.includes('all');
  const hasSearch = Boolean(query.trim());
  const clearFilters = () => {
    setBrand(['all']);
    setPartType(['all']);
    setBrandScope(['all']);
  };
  const clearSearch = () => {
    setQuery('');
    setError('');
  };
  const clearAll = () => {
    clearSearch();
    clearFilters();
    setSelectedIds([]);
  };

  const toggleSelect = (partId) => {
    setSelectedIds((prev) => prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId].slice(-6));
  };

  const persistComparisonSet = (name) => {
    const setName = (name || comparisonName).trim();
    if (!setName || !selectedRows.length) return;
    saveComparisonSet({
      name: setName,
      query,
      filters: { brandScope, brand, partType },
      items: selectedRows.map((part) => ({
        id: part.id,
        name: part.name,
        brand: part.brand,
        category: part.category,
        lowest_price: part.lowest_price,
        fitment: part.fitment,
      })),
    });
    setComparisonName('');
  };

  const loadComparisonSet = (set) => {
    setQuery(set.query || '');
    setBrandScope(set.filters?.brandScope?.length ? set.filters.brandScope : ['all']);
    setBrand(set.filters?.brand?.length ? set.filters.brand : ['all']);
    setPartType(set.filters?.partType?.length ? set.filters.partType : ['all']);
    setSelectedIds((set.items || []).map((item) => item.id));
  };

  return (
    <div className="tab-content">
      <div className="card partscout-hero">
        <div>
          <div className="card-title">PartScout Engine</div>
          <h3>Find the right parts. Compare everywhere.</h3>
          <p>
            Search and compare parts across vendors with fitment-first context for your selected vehicle
            {activeVin ? ' (VIN profile active).' : ' (VIN optional).'}
          </p>
        </div>
        <button className="btn btn-yellow">VIN-aware comparison</button>
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
          {hasSearch && (
            <button className="search-clear-btn" onClick={clearSearch} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        <div className="filter-compact-head" style={{ marginTop: 8 }}>
          <div>
            <div className="card-title">Filters</div>
            <div className="estimate-note">
              Boosting {activeVehicle?.year} {activeVehicle?.make} {activeVehicle?.model} {activeVehicle?.trim} · {activeVehicle?.engine}
            </div>
          </div>
          {(hasSearch || hasActiveFilters || selectedIds.length > 0) && (
            <button className="rm-btn" onClick={clearAll}>Clear all</button>
          )}
        </div>

        <FilterSection
          title="Brands"
          value={brand.includes('all') ? 'All brands' : `${brand.length} selected`}
          open={openFilters.brands}
          onToggle={() => setOpenFilters((prev) => ({ ...prev, brands: !prev.brands }))}
        >
          <div className="chips-row compact-chips">
            {brandOptions.map((item) => (
              <button key={item} className={`chip ${brand.includes(item) ? 'on' : ''}`} onClick={() => toggleMulti(item, brand, setBrand)}>
                {item === 'all' ? 'All brands' : item}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Parts"
          value={partType.includes('all') ? 'All parts' : `${partType.length} selected`}
          open={openFilters.parts}
          onToggle={() => setOpenFilters((prev) => ({ ...prev, parts: !prev.parts }))}
        >
          <div className="chips-row compact-chips">
            {partTypes.map((item) => (
              <button key={item} className={`chip ${partType.includes(item) ? 'on' : ''}`} onClick={() => toggleMulti(item, partType, setPartType)}>
                {item === 'all' ? 'All parts' : titleCase(item)}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Brand scope"
          value={brandScope.includes('all') ? 'All scopes' : `${brandScope.length} selected`}
          open={openFilters.scope}
          onToggle={() => setOpenFilters((prev) => ({ ...prev, scope: !prev.scope }))}
        >
          <div className="chips-row compact-chips">
            {BRAND_SCOPE.map((scope) => (
              <button key={scope} className={`chip ${brandScope.includes(scope) ? 'on' : ''}`} onClick={() => toggleMulti(scope, brandScope, setBrandScope)}>
                {scope === 'all' ? 'All scopes' : scope}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="card">
        <div className="filter-compact-head">
          <div className="card-title">Saved comparison sets</div>
          <div className="estimate-note">{comparisonSets.length} saved</div>
        </div>
        <div className="compare-save-row">
          <input
            className="input"
            placeholder="Name this shortlist"
            value={comparisonName}
            onChange={(e) => setComparisonName(e.target.value)}
          />
          <button className="pbtn" onClick={() => persistComparisonSet()}>
            Save selected ({selectedRows.length})
          </button>
        </div>
        <div className="chips-row compact-chips">
          {PRESET_COMPARISON_NAMES.map((name) => (
            <button key={name} className="chip" onClick={() => persistComparisonSet(name)}>
              {name}
            </button>
          ))}
        </div>
        {comparisonSets.length === 0 ? (
          <div className="estimate-note">Save shortlists like downpipe options, wheel setups, or a street suspension stack.</div>
        ) : (
          <div className="saved-set-list">
            {comparisonSets.map((set) => (
              <div className="saved-set-row" key={set.id}>
                <div>
                  <div className="saved-set-title">{set.name}</div>
                  <div className="estimate-note">{(set.items || []).length} parts · {timeAgo(set.createdAt)}</div>
                </div>
                <div className="saved-set-actions">
                  <button className="pbtn" onClick={() => loadComparisonSet(set)}>Load</button>
                  <button className="rm-btn" onClick={() => removeComparisonSet(set.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="filter-compact-head">
          <div className="card-title">PartScout Results ({filtered.length})</div>
          <div className="estimate-note">Showing direct and likely matches first. Low-confidence mismatches are hidden.</div>
        </div>
        {loading && <div className="estimate-note">Loading VIN-aware catalog data...</div>}
        {!loading && error && <div className="estimate-note">Supabase error: {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="estimate-note">No parts matched. Try a broader search, or clear search and filters to reset the comparison view.</div>
        )}
        {!loading && !error && filtered.map((part) => {
          const prices = (part.vendors || []).slice().sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
          const lowest = prices.length ? Number(prices[0].price || 0) : null;
          const history = Array.isArray(part.history) ? part.history : [];
          const fitment = part.fitment || { label: 'Needs verification', score: 0, reason: 'Review fitment' };
          const selected = selectedIds.includes(part.id);
          return (
            <div className="partscout-row" key={part.id}>
              <div className="partscout-row-head">
                <div>
                  <div className="quick-result-title">{part.name}</div>
                  <div className="partscout-meta-row">
                    <span className={`fitment-badge fitment-${fitment.label.toLowerCase().replace(/\s+/g, '-')}`}>{fitment.label}</span>
                    <span className="estimate-note">{fitment.score} confidence · {fitment.reason}</span>
                  </div>
                  {Array.isArray(fitment.badges) && fitment.badges.length > 0 && (
                    <div className="fitment-sub-badges">
                      {fitment.badges.map((badge, index) => (
                        <span
                          key={`${part.id}-${badge.label}-${index}`}
                          className={`fitment-sub-badge fitment-sub-badge-${badge.tone || 'neutral'}`}
                        >
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="estimate-note">{part.brand} · {titleCase(part.category)} · updated {timeAgo(part.last_updated)}</div>
                </div>
                <div className="partscout-row-side">
                  {lowest !== null && <div className="row-value">from ${lowest.toLocaleString()}</div>}
                  <button className={`pbtn ${selected ? 'saved' : ''}`} onClick={() => toggleSelect(part.id)}>
                    {selected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>

              {history.length > 1 && (
                <div className="price-history-card">
                  <div className="price-history-head">
                    <span className="price-history-label">Recent price trend</span>
                    <span className="estimate-note">
                      low ${Math.min(...history.map((point) => Number(point.price || 0))).toLocaleString()}
                      {' '}· high ${Math.max(...history.map((point) => Number(point.price || 0))).toLocaleString()}
                    </span>
                  </div>
                  <div className="price-history-bars" aria-label="Recent price trend bars">
                    {history.map((point) => {
                      const values = history.map((item) => Number(item.price || 0));
                      const low = Math.min(...values);
                      const high = Math.max(...values);
                      const ratio = high === low ? 0.65 : ((Number(point.price || 0) - low) / (high - low)) * 0.72 + 0.28;
                      return (
                        <div
                          key={point.id}
                          className="price-history-bar"
                          style={{ height: `${Math.round(ratio * 100)}%` }}
                          title={`${point.vendor_name}: $${Number(point.price || 0).toLocaleString()}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {prices.length > 0 ? (
                <table className="vendor-table">
                  <tbody>
                    {prices.map((price) => (
                      <tr key={price.id}>
                        <td className="vn">
                          <div>{price.vendor_name}</div>
                          <div className="vendor-trust-line">
                            <span>{titleCase((price.source_type || 'manual').replace(/_/g, ' '))}</span>
                            <span>Q{price.quality_score || 0}</span>
                          </div>
                        </td>
                        <td className={`vp ${Number(price.price || 0) === lowest ? 'price-low' : ''}`}>${Number(price.price || 0).toLocaleString()}</td>
                        <td className="vendor-meta-cell">
                          <div className="estimate-note">updated {timeAgo(price.last_updated)}</div>
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
