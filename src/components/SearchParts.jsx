import { useMemo, useState } from 'react';
import { PARTS, CAT_META, minPrice } from '../data';

export default function SearchParts({ store, onOpenPartScout }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const { toggleWishlist, isInWishlist } = store;

  const filtered = useMemo(() => {
    const q = (submitted || query).toLowerCase().trim();
    if (!q) return PARTS.slice(0, 8);
    return PARTS.filter(part => (
      `${part.name} ${part.brand} ${CAT_META[part.cat]?.label || ''}`.toLowerCase().includes(q)
    )).slice(0, 20);
  }, [query, submitted]);

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
              if (e.key === 'Enter') setSubmitted(query);
            }}
          />
        </div>
        <div className="quick-search-meta">
          <span>⚡ Press Enter for quick results</span>
          <button className="pbtn" onClick={onOpenPartScout}>🧠 Or use PartScout for smarter comparison</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{filtered.length} results</div>
        {filtered.map(part => {
          const lowest = minPrice(part.vendors);
          const cat = CAT_META[part.cat] || { color: '#1e1e22', text: '#aaa', label: part.cat };
          return (
            <div className="quick-result-row" key={part.id}>
              <div className="quick-result-main">
                <div className="quick-result-title">{part.name}</div>
                <div className="quick-result-meta">
                  <span className="cat-badge" style={{ background: cat.color, color: cat.text }}>{cat.label}</span>
                  <span className="row-value">from ${lowest.toLocaleString()}</span>
                </div>
              </div>
              <button className={`pbtn ${isInWishlist(part.id) ? 'saved' : ''}`} onClick={() => toggleWishlist(part)}>
                {isInWishlist(part.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
