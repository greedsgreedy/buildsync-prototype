import { useMemo, useState } from 'react';
import { LOCAL_DRIVE_EVENTS } from '../data';

const KINDS = ['all','Track','Autocross','Drift','Canyon / touge-style drive','Car meet','Meet / trail'];
const TAGS = ['all','HPDE','Track day','Autocross','Drift','Scenic road','Canyon','Cars & coffee','JDM','Euro','EV','Truck','SUV','Overland'];

export default function DriveEvents({ store }) {
  const activeVehicle = store.activeVehicle;
  const [subtab, setSubtab] = useState('browse');
  const [location, setLocation] = useState('');
  const [kind, setKind] = useState('all');
  const [tag, setTag] = useState('all');
  const [query, setQuery] = useState('');
  const [plannedEvents, setPlannedEvents] = useState([]);
  const [customFocusTags, setCustomFocusTags] = useState([]);
  const [eventForm, setEventForm] = useState({
    title:'',
    type:'Car meet',
    customType:'',
    focuses:['Cars & coffee'],
    customFocus:'',
    location:'',
    date:'',
    time:'',
    privacy:'Public',
    capacity:'',
    notes:'',
  });

  const focusTags = useMemo(() => {
    const tags = [...TAGS, ...customFocusTags];
    return tags.filter((item, index) => tags.indexOf(item) === index);
  }, [customFocusTags]);

  const filtered = useMemo(() => LOCAL_DRIVE_EVENTS.filter(item => {
    if (kind !== 'all' && item.kind !== kind) return false;
    if (tag !== 'all' && !item.tags.includes(tag)) return false;
    if (query) {
      const q = query.toLowerCase();
      const haystack = [item.name, item.kind, item.city, item.note, ...item.tags, ...item.vehicleTypes].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }), [kind, query, tag]);

  const liveSearch = [
    kind !== 'all' ? kind : 'car events tracks car meets',
    tag !== 'all' ? tag : '',
    activeVehicle?.make,
    activeVehicle?.model,
    location || 'near me',
  ].filter(Boolean).join(' ');

  const createEvent = () => {
    if (!eventForm.title.trim() || !eventForm.location.trim()) return;
    const type = eventForm.type === 'Custom'
      ? eventForm.customType.trim() || 'Custom event'
      : eventForm.type;
    const focuses = eventForm.focuses.length ? eventForm.focuses : [type];
    setPlannedEvents(prev => [...prev, { ...eventForm, type, focuses, id: Date.now() }]);
    setEventForm({ title:'', type:'Car meet', customType:'', focuses:['Cars & coffee'], customFocus:'', location:'', date:'', time:'', privacy:'Public', capacity:'', notes:'' });
  };

  const removeEvent = (id) => {
    setPlannedEvents(prev => prev.filter(event => event.id !== id));
  };

  const toggleEventFocus = (focus) => {
    setEventForm(prev => ({
      ...prev,
      focuses: prev.focuses.includes(focus)
        ? prev.focuses.filter(item => item !== focus)
        : [...prev.focuses, focus],
    }));
  };

  const addCustomFocus = (value) => {
    const focus = value.trim();
    if (!focus) return;
    setCustomFocusTags(prev => prev.includes(focus) ? prev : [...prev, focus]);
    setEventForm(prev => ({
      ...prev,
      customFocus:'',
      focuses: prev.focuses.includes(focus) ? prev.focuses : [...prev.focuses, focus],
    }));
  };

  return (
    <div className="tab-content">
      <div className="subtabs card">
        <button className={`subtab ${subtab === 'browse' ? 'on' : ''}`} onClick={() => setSubtab('browse')}>Browse events</button>
        <button className={`subtab ${subtab === 'create' ? 'on' : ''}`} onClick={() => setSubtab('create')}>Create event</button>
        <button className={`subtab ${subtab === 'drafts' ? 'on' : ''}`} onClick={() => setSubtab('drafts')}>
          My drafts {plannedEvents.length > 0 ? `(${plannedEvents.length})` : ''}
        </button>
      </div>

      {subtab === 'create' && (
        <div className="card">
          <div className="card-title">Set up your track day or car meet</div>
          <div className="form-grid">
            <input className="input span-2" placeholder="Event title" value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title:e.target.value }))} />
            <select className="input" value={eventForm.type} onChange={e => setEventForm(p => ({ ...p, type:e.target.value }))}>
              <option>Car meet</option>
              <option>Track day</option>
              <option>Autocross</option>
              <option>Drift practice</option>
              <option>Private cruise</option>
              <option>Truck / overland meet</option>
              <option>EV cruise</option>
              <option>Custom</option>
            </select>
            <select className="input" value={eventForm.privacy} onChange={e => setEventForm(p => ({ ...p, privacy:e.target.value }))}>
              <option>Public</option>
              <option>Invite-only</option>
              <option>Private draft</option>
            </select>
            {eventForm.type === 'Custom' && (
              <div className="custom-event-row span-2">
                <input
                  className="input"
                  placeholder="Custom event type, like dyno day, detailing clinic, vendor night..."
                  value={eventForm.customType}
                  onChange={e => {
                    const value = e.target.value;
                    setEventForm(p => ({ ...p, customType:value }));
                  }}
                  onBlur={e => addCustomFocus(e.target.value)}
                />
                <button className="pbtn" onClick={() => addCustomFocus(eventForm.customType)}>Add to focus</button>
              </div>
            )}
            <div className="span-2 create-focus-block">
              <div className="filter-label">Focus tags</div>
              <div className="chips-row compact-chips">
                {focusTags.filter(item => item !== 'all').map(item => (
                  <button key={item} className={`chip ${eventForm.focuses.includes(item)?'on':''}`} onClick={() => toggleEventFocus(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="custom-event-row">
                <input
                  className="input"
                  placeholder="Add custom focus tag"
                  value={eventForm.customFocus}
                  onChange={e => setEventForm(p => ({ ...p, customFocus:e.target.value }))}
                />
                <button className="pbtn" onClick={() => addCustomFocus(eventForm.customFocus)}>Add tag</button>
              </div>
            </div>
            <input className="input span-2" placeholder="Venue, track, lot, or meet location" value={eventForm.location} onChange={e => setEventForm(p => ({ ...p, location:e.target.value }))} />
            <input className="input" type="date" value={eventForm.date} onChange={e => setEventForm(p => ({ ...p, date:e.target.value }))} />
            <input className="input" type="time" value={eventForm.time} onChange={e => setEventForm(p => ({ ...p, time:e.target.value }))} />
            <input className="input span-2" type="number" placeholder="Capacity / expected cars" value={eventForm.capacity} onChange={e => setEventForm(p => ({ ...p, capacity:e.target.value }))} />
            <textarea className="input profile-textarea span-2" placeholder="Rules, requirements, roll-in time, tech inspection, no reckless driving, etc." value={eventForm.notes} onChange={e => setEventForm(p => ({ ...p, notes:e.target.value }))} />
            <button className="btn btn-yellow span-2" onClick={createEvent}>+ Create event draft</button>
          </div>
          <div className="estimate-note">
            Event drafts stay local in this prototype. Production would add RSVPs, moderation, venue approval, payments, waivers, route safety, and calendar invites.
          </div>
        </div>
      )}

      {subtab === 'drafts' && (
        <div className="card">
          <div className="card-title">Your event drafts</div>
          {plannedEvents.length === 0 ? (
            <div className="empty-state">No event drafts yet</div>
          ) : (
            <div className="event-draft-grid">
              {plannedEvents.map(event => (
                <div key={event.id} className="event-draft">
                  <div className="event-name">{event.title}</div>
                  <div className="event-type">{event.type} · {event.privacy}</div>
                  <div className="shop-note">{event.location}</div>
                  {event.focuses?.length > 0 && (
                    <div className="shop-tags">
                      {event.focuses.map(focus => <span key={focus}>{focus}</span>)}
                    </div>
                  )}
                  <div className="list-row"><span className="row-name">When</span><span className="row-value">{event.date || 'Date TBD'} {event.time || ''}</span></div>
                  <div className="list-row"><span className="row-name">Capacity</span><span className="row-value">{event.capacity || 'Not set'}</span></div>
                  {event.notes && <div className="shop-note">{event.notes}</div>}
                  <div className="shop-actions">
                    <button className="pbtn" onClick={() => alert(`Invite flow: ${event.title}`)}>Invite</button>
                    <button className="pbtn" onClick={() => alert(`Calendar draft: ${event.title}`)}>Calendar</button>
                    <button className="pbtn" onClick={() => removeEvent(event.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subtab === 'browse' && (
        <>
          <div className="card">
            <div className="card-title">Tracks, cruises, and meets near you</div>
            <div className="form-grid">
              <input className="input span-2" placeholder="Search tracks, roads, meets, event types..." value={query} onChange={e => setQuery(e.target.value)} />
              <input className="input span-2" placeholder="City or ZIP" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="shop-filter-block">
              <div className="filter-label">Type</div>
              <div className="chips-row compact-chips">
                {KINDS.map(item => (
                  <button key={item} className={`chip ${kind===item?'on':''}`} onClick={() => setKind(item)}>
                    {item === 'all' ? 'All types' : item}
                  </button>
                ))}
              </div>
            </div>
            <div className="shop-filter-block">
              <div className="filter-label">Focus</div>
              <div className="chips-row compact-chips">
                {focusTags.map(item => (
                  <button key={item} className={`chip ${tag===item?'on':''}`} onClick={() => setTag(item)}>
                    {item === 'all' ? 'All focuses' : item}
                  </button>
                ))}
              </div>
            </div>
            <div className="estimate-note">
              Canyon/touge-style results are for legal scenic driving only. Live mode should use verified public roads, event calendars, venue rules, weather, closures, and safety notices.
            </div>
          </div>

          <div className="rbar">
            <span className="rbar-count">Showing {filtered.length} places/events</span>
            <button className="rm-btn" onClick={() => alert(`Live location search: ${liveSearch}`)}>Search live</button>
          </div>

          <div className="event-grid">
            {filtered.map(item => {
              const goodForVehicle = item.vehicleTypes.includes('All vehicles') || item.vehicleTypes.includes(activeVehicle?.type);
              return (
                <div key={item.id} className="event-card">
                  <div className="event-head">
                    <div>
                      <div className="event-name">{item.name}</div>
                      <div className="event-type">{item.kind} · {item.city} · {item.distance}</div>
                    </div>
                    <div className={`fit-badge ${goodForVehicle ? 'good' : ''}`}>
                      {goodForVehicle ? 'Good fit' : 'Check fit'}
                    </div>
                  </div>
                  <div className="shop-note">{item.note}</div>
                  <div className="list-row"><span className="row-name">Date</span><span className="row-value">{item.date || 'TBA'}</span></div>
                  <div className="list-row"><span className="row-name">Schedule</span><span className="row-value">{item.schedule}</span></div>
                  <div className="list-row"><span className="row-name">Cost</span><span className="row-value">{item.cost}</span></div>
                  <div className="shop-tags">
                    {item.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="shop-services">
                    {item.vehicleTypes.map(type => <span key={type}>{type}</span>)}
                  </div>
                  <div className="shop-actions">
                    <button className="pbtn" onClick={() => alert(`Save: ${item.name}`)}>Save</button>
                    {item.website && (
                      <a className="pbtn link-btn" href={item.website} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    )}
                    <button className="pbtn" onClick={() => alert(`Calendar hook: ${item.name}`)}>Calendar</button>
                    <button className="pbtn" onClick={() => alert(`Map/search hook: ${item.name}`)}>Map</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
