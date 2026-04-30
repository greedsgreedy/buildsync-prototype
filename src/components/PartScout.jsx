import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PartScout({ store }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function loadRows() {
      setLoading(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('parts')
        .select(`
          id,
          name,
          category,
          brand,
          image_url,
          product_url,
          vehicle_compatibility,
          part_prices (
            id,
            vendor_name,
            price,
            link,
            last_updated
          )
        `)
        .order('name', { ascending: true })
        .limit(200);
      if (cancelled) return;
      if (fetchError) {
        setError(fetchError.message);
        setRows([]);
      } else {
        setRows(data || []);
      }
      setLoading(false);
    }
    loadRows();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((part) => (
      `${part.name} ${part.brand} ${part.category}`.toLowerCase().includes(q)
    ));
  }, [query, rows]);

  return (
    <div className="tab-content">
      <div className="card partscout-hero">
        <div>
          <div className="card-title">PartScout Engine</div>
          <h3>Find the right parts. Compare everywhere.</h3>
          <p>Search and compare parts across vendors with fitment-first context for your selected vehicle.</p>
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
      </div>
      <div className="card">
        <div className="card-title">PartScout Results</div>
        {loading && <div className="estimate-note">Loading rows from Supabase...</div>}
        {!loading && error && <div className="estimate-note">Supabase error: {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="estimate-note">No rows found. Seed `parts` and `part_prices` to start comparison.</div>
        )}
        {!loading && !error && filtered.map((part) => {
          const prices = (part.part_prices || []).slice().sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
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
