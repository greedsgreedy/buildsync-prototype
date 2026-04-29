import { useMemo, useState } from 'react';
import { PRO_RACING_EVENTS } from '../data';

const SERIES = ['all','Formula 1','FIA WEC','IMSA','SRO GT'];
const TAGS = ['all','F1','Endurance','IMSA','GT3','Open wheel','Sprint','Weekend event'];

export default function ProRacing() {
  const [series, setSeries] = useState('all');
  const [tag, setTag] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const oneDayMs = 24 * 60 * 60 * 1000;

    const matches = PRO_RACING_EVENTS.filter(event => {
      if (series !== 'all' && event.series !== series) return false;
      if (tag !== 'all' && !event.tags.includes(tag)) return false;
      if (query) {
        const q = query.toLowerCase();
        const haystack = [event.name, event.series, event.city, event.region, event.note, ...event.tags].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const scoreEvent = (event) => {
      const start = event.startDate ? new Date(`${event.startDate}T00:00:00Z`) : null;
      const end = event.endDate ? new Date(`${event.endDate}T23:59:59Z`) : start;
      if (!start || Number.isNaN(start.valueOf())) return Number.MAX_SAFE_INTEGER;

      if (end && today >= start && today <= end) return 0;
      if (today < start) return Math.floor((start - today) / oneDayMs);
      return 100000 + Math.floor((today - (end || start)) / oneDayMs);
    };

    return matches.sort((a, b) => {
      const delta = scoreEvent(a) - scoreEvent(b);
      if (delta !== 0) return delta;
      return (a.startDate || '').localeCompare(b.startDate || '');
    });
  }, [query, series, tag]);

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">Professional racing calendar</div>
        <div className="form-grid">
          <input className="input span-2" placeholder="Search F1, Le Mans, Daytona, IMSA, GT3..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Series</div>
          <div className="chips-row compact-chips">
            {SERIES.map(item => (
              <button key={item} className={`chip ${series===item?'on':''}`} onClick={() => setSeries(item)}>
                {item === 'all' ? 'All series' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-filter-block">
          <div className="filter-label">Focus</div>
          <div className="chips-row compact-chips">
            {TAGS.map(item => (
              <button key={item} className={`chip ${tag===item?'on':''}`} onClick={() => setTag(item)}>
                {item === 'all' ? 'All focuses' : item}
              </button>
            ))}
          </div>
        </div>
        <div className="estimate-note">
          Pro racing is separated from local events so fan calendars, ticket planning, and series browsing do not crowd out track days, meets, and community drives.
        </div>
      </div>

      <div className="rbar">
        <span className="rbar-count">Showing {filtered.length} pro racing events</span>
      </div>

      <div className="event-grid">
        {filtered.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-head">
              <div>
                <div className="event-name">{event.name}</div>
                <div className="event-type">{event.series} · {event.city} · {event.region}</div>
              </div>
              <div className="fit-badge good">Pro</div>
            </div>
            <div className="shop-note">{event.note}</div>
            <div className="list-row"><span className="row-name">Date</span><span className="row-value">{event.date || 'TBA'}</span></div>
            <div className="list-row"><span className="row-name">Schedule</span><span className="row-value">{event.schedule}</span></div>
            <div className="list-row"><span className="row-name">Cost</span><span className="row-value">{event.cost}</span></div>
            <div className="shop-tags">
              {event.tags.map(item => <span key={item}>{item}</span>)}
            </div>
            <div className="shop-actions">
              <button className="pbtn" onClick={() => alert(`Save event: ${event.name}`)}>Save</button>
              <a className="pbtn link-btn" href={event.website} target="_blank" rel="noreferrer">Website</a>
              <button className="pbtn" onClick={() => alert(`Calendar hook: ${event.name}`)}>Calendar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
