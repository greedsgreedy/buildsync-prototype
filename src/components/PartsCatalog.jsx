import { useMemo, useState } from 'react';
import { PARTS, CAT_META, minPrice, getFitmentMeta, getPriceAnalytics } from '../data';
import { BRAND_SCOPE, SPECIFIC_BRANDS, PART_FILTERS, inferBrandScope, titleCase } from '../lib/partscoutFilters';

const VENDORS = [
  { value: 'all', label: 'All vendors' },
  { value: 'us', label: 'US retailers' },
  { value: 'alibaba', label: 'Alibaba' },
  { value: 'temu', label: 'Temu' },
];

const normalize = (value) => (value || '').toLowerCase().trim();

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

const listLabel = (selected, allLabel, toLabel = (v) => v) => {
  if (selected.includes('all')) return allLabel;
  if (selected.length <= 2) return selected.map(toLabel).join(', ');
  return `${selected.length} selected`;
};

const buildVendorLink = (part, vendor) => {
  if (vendor.url) return vendor.url;
  const q = encodeURIComponent(`${part.name} ${vendor.n}`);
  return `https://www.google.com/search?q=${q}`;
};

const withCatalogFeed = (parts, feedRows) => {
  if (!feedRows?.length) return parts;
  return parts.map(part => {
    const candidates = feedRows.filter(row => {
      const partMatch = normalize(part.name).includes(normalize(row.part)) || normalize(row.part).includes(normalize(part.name));
      const brandMatch = !row.brand || normalize(part.brand) === normalize(row.brand);
      return partMatch && brandMatch;
    });
    if (!candidates.length) return part;

    const nextVendors = [...part.vendors];
    candidates.forEach(row => {
      const idx = nextVendors.findIndex(v => normalize(v.n) === normalize(row.vendor));
      const next = { n: row.vendor, p: row.price, s: row.shipping || 0, t: 'us', url: row.url || '' };
      if (idx >= 0) nextVendors[idx] = { ...nextVendors[idx], ...next };
      else nextVendors.push(next);
    });
    return { ...part, vendors: nextVendors };
  });
};

const isLaunchScopePart = (part) => {
  const text = `${part.name} ${part.brand}`.toLowerCase();
  return text.includes('supra') || text.includes('b58') || text.includes('bmw') || ['oil', 'tires', 'wheels', 'brakes', 'suspension'].includes(part.cat);
};

const partMatchesGarageVehicle = (part, vehicle) => {
  const profile = `${vehicle?.year || ''} ${vehicle?.make || ''} ${vehicle?.model || ''} ${vehicle?.trim || ''} ${vehicle?.engine || ''}`.toLowerCase();
  const fit = vehicle?.fitment || {};
  const isSupraOrBmw = profile.includes('supra') || profile.includes('a90') || profile.includes('a91') || profile.includes('bmw');
  const universal = ['oil', 'accessories', 'safety', 'tires'].includes(part.cat);
  if (!isSupraOrBmw) return universal;
  if (part.cat === 'wheels' && fit.brakePackage === 'BigBrakeKit' && part.name.includes('18x9.5')) return false;
  if (part.cat === 'downpipe' && fit.emissions === 'EU' && part.name.toLowerCase().includes('catless')) return false;
  return true;
};

export default function PartsCatalog({ store, mode = 'catalog', onOpenPartScout }) {
  const { toggleWishlist, isInWishlist, quickAlert, activeVehicle, catalogFeed, appScope } = store;
  const [cats, setCats] = useState(['all']);
  const [brandScope, setBrandScope] = useState(['all']);
  const [brands, setBrands] = useState(['all']);
  const [vendors, setVendors] = useState(['all']);
  const [onlyGarageFit, setOnlyGarageFit] = useState(true);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [openFilters, setOpenFilters] = useState({ category: true, brand: true, scope: false, vendor: false });
  const [compareParts, setCompareParts] = useState([]);

  const catalog = useMemo(() => withCatalogFeed(PARTS, catalogFeed), [catalogFeed]);
  const launchScopeOnly = appScope === 'supra_bmw';
  const brandOptions = useMemo(() => {
    const rowBrands = [...new Set(catalog.map(item => item.brand).filter(Boolean))];
    return [...new Set([...SPECIFIC_BRANDS, ...rowBrands])];
  }, [catalog]);
  const partTypes = useMemo(() => {
    const rowTypes = [...new Set(catalog.map(item => item.cat).filter(Boolean))];
    return [...new Set([...PART_FILTERS, ...rowTypes])];
  }, [catalog]);

  const filtered = useMemo(() => {
    let parts = catalog.filter(p => {
      const scope = inferBrandScope({
        brand: p.brand,
        vendors: p.vendors?.map(v => ({ vendor_name: v.n })) || [],
      });
      if (!cats.includes('all') && !cats.includes(p.cat)) return false;
      if (!brandScope.includes('all') && !brandScope.includes(scope)) return false;
      if (!brands.includes('all') && !brands.includes(p.brand)) return false;
      if (!vendors.includes('all')) {
        const hasAny = vendors.some(vendor => vendor === 'us' ? p.vendors.some(item => item.t === 'us') : p.vendors.some(item => item.t === vendor));
        if (!hasAny) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (![p.name, p.brand, CAT_META[p.cat]?.label || ''].join(' ').toLowerCase().includes(q)) return false;
      }
      if (onlyGarageFit && !partMatchesGarageVehicle(p, activeVehicle)) return false;
      if (launchScopeOnly && !isLaunchScopePart(p)) return false;
      return true;
    });
    if (sort === 'asc') parts = [...parts].sort((a, b) => minPrice(a.vendors) - minPrice(b.vendors));
    if (sort === 'desc') parts = [...parts].sort((a, b) => minPrice(b.vendors) - minPrice(a.vendors));
    if (sort === 'alpha') parts = [...parts].sort((a, b) => a.name.localeCompare(b.name));
    return parts;
  }, [catalog, cats, brandScope, brands, vendors, query, sort, onlyGarageFit, activeVehicle, launchScopeOnly]);

  const activeCategoryLabel = cats.includes('all') ? '' : listLabel(cats, '', v => titleCase(v));
  const activeScopeLabel = brandScope.includes('all') ? '' : listLabel(brandScope, '');
  const activeBrandLabel = brands.includes('all') ? '' : listLabel(brands, '');
  const activeVendorLabel = vendors.includes('all') ? '' : listLabel(vendors, '', v => VENDORS.find(o => o.value === v)?.label || v);
  const hasSearch = Boolean(query.trim());
  const hasFilters = !cats.includes('all') || !brandScope.includes('all') || !brands.includes('all') || !vendors.includes('all');
  const clearSearch = () => setQuery('');
  const clearAll = () => {
    setQuery('');
    setCats(['all']);
    setBrandScope(['all']);
    setBrands(['all']);
    setVendors(['all']);
  };

  return (
    <div className="tab-content">
      <div className="card">
        <div className="filter-compact-head">
          <div className="card-title">Parts Catalog</div>
          {(hasSearch || hasFilters) && <button className="rm-btn" onClick={clearAll}>Clear all</button>}
        </div>
        <div className="quick-search-shell">
          <span className="search-icon">⌕</span>
          <input
            className="input quick-search-input"
            placeholder="Search parts, brands, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {hasSearch && (
            <button className="search-clear-btn" onClick={clearSearch} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        <div className="quick-search-meta">
          <span className="quick-search-hint">Browse, filter, and save parts across the full catalog</span>
          {onOpenPartScout ? (
            <button className="pbtn quick-search-cta" onClick={onOpenPartScout}>
              <span className="quick-search-cta-icon">🧠</span>
              <span>Use PartScout when you want smarter comparison</span>
            </button>
          ) : (
            <span className="estimate-note">Use PartScout when you want deeper vendor and fitment comparison.</span>
          )}
        </div>
      </div>

      <div className="card filter-card">
        <div className="filter-compact-head">
          <div>
            <div className="card-title">Filters</div>
            <div className="active-filters">
              {activeCategoryLabel && <span>{activeCategoryLabel}</span>}
              {activeScopeLabel && <span>{activeScopeLabel}</span>}
              {activeBrandLabel && <span>{activeBrandLabel}</span>}
              {activeVendorLabel && <span>{activeVendorLabel}</span>}
            </div>
          </div>
          <div className="shop-actions">
            <label className="check-line"><input type="checkbox" checked={onlyGarageFit} onChange={e => setOnlyGarageFit(e.target.checked)} />Fit selected vehicle</label>
            {hasFilters && (
              <button className="rm-btn" onClick={() => { setCats(['all']); setBrandScope(['all']); setBrands(['all']); setVendors(['all']); }}>Clear</button>
            )}
          </div>
        </div>
        <div className="estimate-note">
          {onlyGarageFit ? `Showing browseable catalog parts that fit your selected garage vehicle (${activeVehicle?.year || ''} ${activeVehicle?.make || ''} ${activeVehicle?.model || ''} ${activeVehicle?.trim || ''}).` : 'Showing the full browseable catalog regardless of selected vehicle.'}
          {launchScopeOnly ? ' Launch mode: Supra + BMW ecosystem focus.' : ''}
        </div>

        <FilterSection title="Category" value={activeCategoryLabel} open={openFilters.category} onToggle={() => setOpenFilters(prev => ({ ...prev, category: !prev.category }))}>
          <div className="chips-row compact-chips">{partTypes.map(item => <button key={item} className={`chip ${cats.includes(item) ? 'on' : ''}`} onClick={() => toggleMulti(item, cats, setCats)}>{item === 'all' ? 'All parts' : titleCase(item)}</button>)}</div>
        </FilterSection>
        <FilterSection title="Brand scope" value={activeScopeLabel || 'All scopes'} open={openFilters.scope} onToggle={() => setOpenFilters(prev => ({ ...prev, scope: !prev.scope }))}>
          <div className="chips-row compact-chips">{BRAND_SCOPE.map(scope => <button key={scope} className={`chip ${brandScope.includes(scope) ? 'on' : ''}`} onClick={() => toggleMulti(scope, brandScope, setBrandScope)}>{scope === 'all' ? 'All scopes' : scope}</button>)}</div>
        </FilterSection>
        <FilterSection title="Manufacturer" value={activeBrandLabel || 'All brands'} open={openFilters.brand} onToggle={() => setOpenFilters(prev => ({ ...prev, brand: !prev.brand }))}>
          <div className="chips-row compact-chips">{brandOptions.map(item => <button key={item} className={`chip ${brands.includes(item) ? 'on' : ''}`} onClick={() => toggleMulti(item, brands, setBrands)}>{item === 'all' ? 'All brands' : item}</button>)}</div>
        </FilterSection>
        <FilterSection title="Vendor" value={activeVendorLabel} open={openFilters.vendor} onToggle={() => setOpenFilters(prev => ({ ...prev, vendor: !prev.vendor }))}>
          <div className="chips-row compact-chips">{VENDORS.map(o => <button key={o.value} className={`chip ${vendors.includes(o.value) ? 'on' : ''}`} onClick={() => toggleMulti(o.value, vendors, setVendors)}>{o.label}</button>)}</div>
        </FilterSection>
      </div>

      <div className="rbar">
        <span className="rbar-count">Showing {filtered.length} parts</span>
        <select className="input sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Default</option>
          <option value="asc">Price ↑</option>
          <option value="desc">Price ↓</option>
          <option value="alpha">A–Z</option>
        </select>
      </div>

      {compareParts.length > 0 && <CompareTray parts={compareParts} onRemove={id => setCompareParts(prev => prev.filter(part => part.id !== id))} onClear={() => setCompareParts([])} />}

      {filtered.length === 0 ? <div className="empty-state card">No parts match — try clearing some filters</div> : (
        <div className="parts-grid">
          {filtered.map(part => (
            <PartCard
              key={part.id}
              part={part}
              vendorFilter={vendors}
              saved={isInWishlist(part.id)}
              onSave={() => toggleWishlist(part)}
              onAlert={() => quickAlert(part.name)}
              compareSelected={compareParts.some(item => item.id === part.id)}
              onCompare={() => setCompareParts(prev => prev.some(item => item.id === part.id) ? prev.filter(item => item.id !== part.id) : [...prev, part].slice(-4))}
            />
          ))}
        </div>
      )}
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

function PartCard({ part, vendorFilter, saved, onSave, onAlert, compareSelected, onCompare }) {
  const cm = CAT_META[part.cat] || { color: '#1e1e22', text: '#888', label: part.cat };
  const fitment = getFitmentMeta(part);
  const stats = getPriceAnalytics(part);
  const shownVendors = vendorFilter.includes('all') ? part.vendors : part.vendors.filter(v => vendorFilter.some(item => item === 'us' ? v.t === 'us' : v.t === item));
  if (!shownVendors.length) return null;
  const lowestPrice = Math.min(...shownVendors.map(v => v.p));

  return (
    <div className="part-card">
      <div className="part-head"><div className="part-name">{part.name}</div><span className="brand-badge">{part.brand}</span></div>
      <span className="cat-badge" style={{ background: cm.color, color: cm.text }}>{cm.label}</span>
      <div className={`fitment-chip fit-${fitment.level}`}>{fitment.label}</div>
      <div className="fitment-note">{fitment.note}</div>
      {stats.history.length > 0 && <div className="price-analytics"><div className="price-analytics-head"><span>Price trend (90d)</span><strong>${stats.history[stats.history.length - 1].toLocaleString()}</strong></div></div>}
      <table className="vendor-table"><tbody>{shownVendors.map((v, i) => (
        <tr key={i}>
          <td className="vn">{v.n}</td>
          <td className={`vp ${v.p === lowestPrice ? 'price-low' : ''}`}>${v.p.toLocaleString()}</td>
          <td className="vs">{v.s > 0 ? `+$${v.s} ship` : 'Free ship'}</td>
          <td><a className="pbtn link-btn buy-link-btn" href={buildVendorLink(part, v)} target="_blank" rel="noreferrer">Where to buy</a></td>
        </tr>
      ))}</tbody></table>
      <div className="part-btns">
        <button className={`pbtn ${saved ? 'saved' : ''}`} onClick={onSave}>{saved ? '✓ Saved' : 'Save'}</button>
        <button className="pbtn" onClick={onAlert}>Alert</button>
        <button className={`pbtn ${compareSelected ? 'saved' : ''}`} onClick={onCompare}>{compareSelected ? 'Comparing' : 'Compare'}</button>
      </div>
    </div>
  );
}

function CompareTray({ parts, onRemove, onClear }) {
  return (
    <div className="card tire-compare-card">
      <div className="filter-compact-head">
        <div><div className="card-title">Parts comparison</div><div className="active-filters"><span>{parts.length} selected</span></div></div>
        <button className="rm-btn" onClick={onClear}>Clear</button>
      </div>
      <div className="tire-compare-grid">
        {parts.map(item => {
          const lowest = Math.min(...item.vendors.map(v => v.p + (v.s || 0)));
          return (
            <div className="tire-compare-item" key={item.id}>
              <div className="part-head"><div><div className="part-name">{item.name}</div><div className="shop-type">{item.brand}</div></div><button className="icon-btn small" onClick={() => onRemove(item.id)}>×</button></div>
              <table className="vendor-table"><tbody>{item.vendors.map(v => {
                const total = v.p + (v.s || 0);
                return <tr key={v.n}><td className="vn">{v.n}</td><td className={`vp ${total === lowest ? 'price-low' : ''}`}>${total.toLocaleString()}</td><td className="vs">{v.s > 0 ? `incl. $${v.s} ship` : 'free ship'}</td><td><a className="pbtn link-btn buy-link-btn" href={buildVendorLink(item, v)} target="_blank" rel="noreferrer">Buy</a></td></tr>;
              })}</tbody></table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
