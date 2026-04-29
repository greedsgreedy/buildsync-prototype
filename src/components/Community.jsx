// src/components/Community.jsx
import { useState } from 'react';
import { COMMUNITY_BUILDS } from '../data';
const normalizeText = (value) => (value || '').toLowerCase();

const FILTERS = ['all','Street','Track','Show','Drift','500+','SUV','Truck','EV'];
const MARKETPLACE_SEED = [
  { id:1, type:'Car', title:'2021 Supra 3.0 Premium', price:52000, location:'Los Angeles, CA', fitment:'A90/A91 Supra', seller:'Tyler S.', note:'Nitro Yellow, tasteful Stage 2 parts, clean title, stock parts included.' },
  { id:2, type:'Part', title:'Volk TE37 Saga 18x10 +34', price:2350, location:'San Diego, CA', fitment:'A90 Supra / BMW G chassis fitment check', seller:'Sam K.', note:'Bronze set, minor wear, no bends. Tires not included.' },
  { id:3, type:'Part', title:'KW V3 Coilovers', price:1550, location:'Orange County, CA', fitment:'Toyota Supra A90/A91', seller:'Alex R.', note:'Used 9k miles, includes adjustment tools and original box.' },
  { id:4, type:'Car', title:'2020 Supra Track Build Shell', price:38500, location:'Phoenix, AZ', fitment:'A90 Supra', seller:'Kevin T.', note:'Track-prepped build base with cage and brake upgrades. Needs buyer inspection.' },
];
const FORUM_CATEGORIES = ['all','Build help','Parts talk','Fitment','Track days','Tuning','Meets','Marketplace','Buying advice','Troubleshooting','DIY installs','Data logs','Track setup','Wheel & tire fitment','Vendor reviews','Regional meets'];
const SHIPMENT_SEED = [
  { id:1, carrier:'UPS', tracking:'1Z-99A0-SUPRA-1234', eta:'May 3', status:'In transit', weight:'18.4 lb', route:'LA → Anaheim', pod:'Signature pending', anomaly:'none' },
  { id:2, carrier:'FedEx', tracking:'FDX-TE37-7782', eta:'May 1', status:'Out for delivery', weight:'92.0 lb', route:'Phoenix → LA', pod:'Photo on delivery', anomaly:'route' },
  { id:3, carrier:'DHL', tracking:'DHL-B58-4491', eta:'May 6', status:'Label created', weight:'12.2 lb', route:'Tokyo → LAX', pod:'None yet', anomaly:'stall' },
];
const COMMUNITY_BOARDS = {
  Toyota: ['All Toyota','Supra MK5 / A90-A91','Supra MK4 / A80','Supra MK3 / A70','GR86 / 86','MR2','Celica'],
  BMW: ['All BMW','M series','3 series','4 series','5 series','Z4','B58 / S58'],
  Porsche: ['All Porsche','911','718 Cayman / Boxster','GT cars','Panamera'],
  Nissan: ['All Nissan','Z / 370Z / 350Z','GT-R','Silvia / 240SX','Infiniti G/Q coupe'],
  Honda: ['All Honda','Civic Type R','S2000','Civic Si','Prelude'],
  Acura: ['All Acura','Integra / RSX','NSX','TLX Type S'],
  Subaru: ['All Subaru','WRX / STI','BRZ','Legacy GT'],
  Mazda: ['All Mazda','MX-5 Miata','RX-7 / RX-8','Mazda3 Turbo'],
  Chevrolet: ['All Chevrolet','Corvette','Camaro'],
  Ford: ['All Ford','Mustang','Focus RS / ST','Fiesta ST'],
  Lexus: ['All Lexus','IS','RC','LC','GS F'],
  Audi: ['All Audi','S3 / RS3','S4 / RS4','RS5','TT / TTS / TT RS','R8'],
  'Mercedes-Benz': ['All Mercedes-Benz','C-Class AMG','E-Class AMG','AMG GT'],
  Hyundai: ['All Hyundai','Elantra N','Veloster N','Genesis Coupe'],
  Kia: ['All Kia','Stinger','K5 GT'],
};
const FORUM_SEED = [
  { id:1, community:'Toyota', modelBoard:'Supra MK5 / A90-A91', category:'Build help', title:'Best first mods for a daily A90 Supra?', author:'Tyler S.', platform:'A90 Supra', replies:28, views:940, last:'12 min ago', pinned:true, tags:['Daily','B58','Stage 1'], body:'Looking for a clean order of intake, tune, downpipe, tires, and maintenance without ruining daily comfort.' },
  { id:2, community:'Toyota', modelBoard:'Supra MK5 / A90-A91', category:'Fitment', title:'275/35R18 square setup: rubbing with mild drop?', author:'Alex R.', platform:'A90/A91 Supra', replies:16, views:522, last:'34 min ago', pinned:false, tags:['Tires','Suspension'], body:'Comparing RT660, A052, and RE-71RS with BC coilovers and street alignment.' },
  { id:3, community:'Toyota', modelBoard:'Supra MK5 / A90-A91', category:'Track days', title:'Buttonwillow first HPDE checklist', author:'Kevin T.', platform:'Track prep', replies:42, views:1400, last:'1 hr ago', pinned:true, tags:['HPDE','Brakes','Fluids'], body:'Helmet, brake fluid, torque wrench, tire pressures, tow hook, and how to read the event schedule.' },
  { id:4, community:'Porsche', modelBoard:'911', category:'Track days', title:'991.2 vs 992 consumables for regular track use', author:'Maya V.', platform:'Porsche 911', replies:19, views:688, last:'2 hr ago', pinned:false, tags:['Porsche','Brakes','Tires'], body:'Trying to budget tire and pad wear realistically before committing to monthly HPDE events.' },
  { id:5, community:'Mazda', modelBoard:'MX-5 Miata', category:'Fitment', title:'ND Miata wheel width sweet spot for canyon + autocross', author:'Priya R.', platform:'Mazda MX-5', replies:23, views:812, last:'3 hr ago', pinned:false, tags:['Miata','Wheels','Alignment'], body:'Looking for a balanced setup that still feels playful on the street without killing steering feel.' },
  { id:6, community:'All', modelBoard:'All communities', category:'Meets', title:'SoCal weekend cars and coffee roll-in etiquette', author:'Sam K.', platform:'All cars', replies:31, views:1100, last:'Today', pinned:false, tags:['Meet','Community'], body:'Venue rules, arrival times, parking, and keeping exits respectful so meets do not get shut down.' },
  { id:7, community:'BMW', modelBoard:'M series', category:'Parts talk', title:'F80 M3 vs G80 M3 suspension upgrade path', author:'Derek B.', platform:'BMW M series', replies:14, views:430, last:'Today', pinned:false, tags:['BMW','M series','Suspension'], body:'Comparing daily comfort, track setup, and tire fitment across two M3 generations.' },
  { id:8, community:'Audi', modelBoard:'S3 / RS3', category:'Tuning', title:'RS3 street tune path before going flex fuel', author:'Noah P.', platform:'Audi RS3', replies:21, views:760, last:'Yesterday', pinned:false, tags:['Audi','Turbo','Tuning'], body:'Looking at intercooler, intake, downpipe, and which supporting mods are worth doing early.' },
  { id:9, community:'Acura', modelBoard:'Integra / RSX', category:'Parts talk', title:'Type S suspension upgrades without ruining daily comfort', author:'Chris D.', platform:'Acura Integra Type S', replies:18, views:690, last:'Yesterday', pinned:false, tags:['Acura','Suspension','Street'], body:'Trying to keep the car sharp and planted without turning every drive into a punishment.' },
];

export default function Community({ store }) {
  const { likedBuilds, toggleLike, activeVehicle, installedMods, totalSpent } = store;
  const appScope = store.appScope;
  const [subtab, setSubtab] = useState('forum');
  const [filter, setFilter] = useState('all');
  const [compareId, setCompareId] = useState(COMMUNITY_BUILDS[0]?.id || null);
  const [listingFilter, setListingFilter] = useState('all');
  const [listings, setListings] = useState(MARKETPLACE_SEED);
  const [forumCategory, setForumCategory] = useState('all');
  const [communityMake, setCommunityMake] = useState('Toyota');
  const [communityBoard, setCommunityBoard] = useState('Supra MK5 / A90-A91');
  const [customBoards, setCustomBoards] = useState({});
  const [newBoardName, setNewBoardName] = useState('');
  const [threads, setThreads] = useState(FORUM_SEED);
  const [shipments] = useState(SHIPMENT_SEED);
  const [threadForm, setThreadForm] = useState({
    category:'Build help',
    title:'',
    body:'',
  });
  const [listingForm, setListingForm] = useState({
    type:'Part',
    title:'',
    price:'',
    location:'',
    fitment:'',
    note:'',
  });
  const [checkoutListingId, setCheckoutListingId] = useState(MARKETPLACE_SEED[0]?.id || null);

  const builds = filter === 'all'
    ? COMMUNITY_BUILDS
    : COMMUNITY_BUILDS.filter(b => b.tags.some(t => t === filter || (filter==='500+' && t==='500+')));
  const compareBuild = COMMUNITY_BUILDS.find(b => b.id === compareId) || COMMUNITY_BUILDS[0];
  const myHp = 382 + installedMods.filter(m => ['performance','electronics','downpipe','exhaust','intercooler','fueling'].includes(m.cat)).length * 18;
  const compareHp = parseInt(compareBuild.hp, 10) || 0;
  const compareCost = Number(compareBuild.cost.replace(/[$,]/g, '')) || 0;
  const shownListings = listingFilter === 'all' ? listings : listings.filter(item => item.type === listingFilter);
  const checkoutListing = listings.find(item => item.id === checkoutListingId) || listings[0];
  const baseBoards = COMMUNITY_BOARDS[communityMake] || [];
  const modelBoards = [...baseBoards, ...(customBoards[communityMake] || [])];
  const communityThreads = threads.filter(thread => {
    const communityMatch = communityMake === 'All'
      || thread.community === 'All'
      || thread.community === communityMake;
    const boardMatch = communityBoard.startsWith('All ')
      || thread.modelBoard === communityBoard
      || thread.modelBoard === 'All communities';
    return communityMatch && boardMatch;
  });
  const shownThreads = forumCategory === 'all'
    ? communityThreads
    : communityThreads.filter(thread => thread.category === forumCategory);
  const availableMakes = appScope === 'supra_bmw' ? ['Toyota', 'BMW'] : Object.keys(COMMUNITY_BOARDS);
  const scopedThreads = appScope === 'supra_bmw'
    ? shownThreads.filter(thread => ['Toyota', 'BMW', 'All'].includes(thread.community))
    : shownThreads;
  const scopedListings = appScope === 'supra_bmw'
    ? shownListings.filter(item => normalizeText(item.fitment).includes('supra') || normalizeText(item.fitment).includes('bmw') || normalizeText(item.title).includes('supra') || normalizeText(item.title).includes('bmw'))
    : shownListings;

  const addListing = () => {
    if (!listingForm.title.trim()) return;
    setListings(prev => [{
      id: Date.now(),
      type: listingForm.type,
      title: listingForm.title,
      price: Number(listingForm.price) || 0,
      location: listingForm.location || 'Location not set',
      fitment: listingForm.fitment || `${activeVehicle.make} ${activeVehicle.model}`,
      seller: 'You',
      note: listingForm.note || 'No details yet.',
    }, ...prev]);
    setListingForm({ type:'Part', title:'', price:'', location:'', fitment:'', note:'' });
  };

  const addThread = () => {
    if (!threadForm.title.trim()) return;
    setThreads(prev => [{
      id: Date.now(),
      category: threadForm.category,
      community: communityMake,
      modelBoard: communityBoard,
      title: threadForm.title,
      author: 'You',
      platform: `${communityMake} · ${communityBoard}`,
      replies: 0,
      views: 1,
      last: 'Just now',
      pinned: false,
      tags: [threadForm.category, communityMake, communityBoard],
      body: threadForm.body || 'No details added yet.',
    }, ...prev]);
    setThreadForm({ category:'Build help', title:'', body:'' });
  };

  const addModelBoard = () => {
    const board = newBoardName.trim();
    if (!board) return;
    if (modelBoards.includes(board)) {
      setCommunityBoard(board);
      setNewBoardName('');
      return;
    }
    setCustomBoards(prev => ({
      ...prev,
      [communityMake]: [...(prev[communityMake] || []), board],
    }));
    setCommunityBoard(board);
    setNewBoardName('');
  };

  const normalize = (text) => (text || '').toLowerCase();
  const activeVehicleLabel = `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} ${activeVehicle.trim}`.trim();
  const fitmentText = normalize(checkoutListing?.fitment);
  const vehicleText = normalize(activeVehicleLabel);
  const hasMake = fitmentText.includes(normalize(activeVehicle.make));
  const hasModel = fitmentText.includes(normalize(activeVehicle.model));
  const hasTrim = activeVehicle.trim ? fitmentText.includes(normalize(activeVehicle.trim)) : false;
  const compatibilityScore = (hasMake ? 40 : 0) + (hasModel ? 40 : 0) + (hasTrim ? 20 : 0);
  const compatibilityStatus = compatibilityScore >= 80 ? 'Pass' : compatibilityScore >= 40 ? 'Manual review' : 'Fail';

  return (
    <div className="tab-content">
      <div className="subtabs card">
        <button className={`subtab ${subtab === 'forum' ? 'on' : ''}`} onClick={() => setSubtab('forum')}>Forum</button>
        <button className={`subtab ${subtab === 'builds' ? 'on' : ''}`} onClick={() => setSubtab('builds')}>Builds</button>
        <button className={`subtab ${subtab === 'marketplace' ? 'on' : ''}`} onClick={() => setSubtab('marketplace')}>Marketplace</button>
        <button className={`subtab ${subtab === 'list' ? 'on' : ''}`} onClick={() => setSubtab('list')}>Create listing</button>
      </div>

      {subtab === 'forum' && (
        <>
          <div className="card forum-composer">
            <div className="card-title">Start a discussion</div>
            <div className="form-grid">
              <select className="input" value={threadForm.category} onChange={e => setThreadForm(p => ({ ...p, category:e.target.value }))}>
                {FORUM_CATEGORIES.filter(item => item !== 'all').map(item => <option key={item}>{item}</option>)}
              </select>
              <input className="input" placeholder={`${activeVehicle.make} ${activeVehicle.model} topic title`} value={threadForm.title} onChange={e => setThreadForm(p => ({ ...p, title:e.target.value }))} />
              <textarea className="input profile-textarea span-2" placeholder="Ask a question, post an update, share fitment notes, or start a local thread..." value={threadForm.body} onChange={e => setThreadForm(p => ({ ...p, body:e.target.value }))} />
              <button className="btn btn-yellow span-2" onClick={addThread}>+ Post thread preview</button>
            </div>
          </div>

          <div className="forum-layout">
            <div className="card forum-sidebar">
              <div className="card-title">Car communities</div>
              <div className="community-make-grid">
                {availableMakes.map(make => (
                  <button
                    key={make}
                    className={`community-make ${communityMake===make?'on':''}`}
                    onClick={() => {
                      setCommunityMake(make);
                      setCommunityBoard(COMMUNITY_BOARDS[make][0]);
                    }}
                  >
                    {make}
                  </button>
                ))}
              </div>

              <div className="forum-divider" />
              <div className="card-title">Model boards</div>
              <div className="model-board-list">
                {modelBoards.map(board => (
                  <button key={board} className={`model-board ${communityBoard===board?'on':''}`} onClick={() => setCommunityBoard(board)}>
                    {board}
                  </button>
                ))}
              </div>
              <div className="board-add-row">
                <input
                  className="input board-add-input"
                  placeholder={`Add ${communityMake} board`}
                  value={newBoardName}
                  onChange={e => setNewBoardName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addModelBoard();
                    }
                  }}
                />
                <button className="pbtn" onClick={addModelBoard}>Add board</button>
              </div>

              <div className="forum-divider" />
              <div className="card-title">Discussion boards</div>
              {FORUM_CATEGORIES.map(item => (
                <button key={item} className={`forum-board ${forumCategory===item?'on':''}`} onClick={() => setForumCategory(item)}>
                  <span>{item === 'all' ? 'All topics' : item}</span>
                  <strong>{item === 'all' ? communityThreads.length : communityThreads.filter(thread => thread.category === item).length}</strong>
                </button>
              ))}
            </div>

            <div className="forum-thread-list">
              <div className="forum-context-card">
                <div>
                  <span>Viewing</span>
                  <strong>{communityMake} · {communityBoard}</strong>
                </div>
                <button className="rm-btn" onClick={() => { setCommunityMake('Toyota'); setCommunityBoard('Supra MK5 / A90-A91'); setForumCategory('all'); }}>Supra MK5</button>
              </div>
              {scopedThreads.length === 0 ? (
                <div className="empty-state card">No threads in this community yet. Start the first discussion above.</div>
              ) : scopedThreads.map(thread => (
                <div className={`forum-thread ${thread.pinned ? 'pinned' : ''}`} key={thread.id}>
                  <div className="forum-avatar">{thread.author.slice(0, 1)}</div>
                  <div className="forum-main">
                    <div className="forum-title-row">
                      <span className="forum-category">{thread.category}</span>
                      {thread.pinned && <span className="forum-pin">Pinned</span>}
                    </div>
                    <div className="forum-title">{thread.title}</div>
                    <div className="forum-body">{thread.body}</div>
                    <div className="build-tags">
                      {thread.tags.map(tag => <span key={tag} className="btag">{tag}</span>)}
                    </div>
                    <div className="forum-meta">By {thread.author} · {thread.platform} · Last activity {thread.last}</div>
                  </div>
                  <div className="forum-stats">
                    <div><strong>{thread.replies}</strong><span>Replies</span></div>
                    <div><strong>{thread.views}</strong><span>Views</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {subtab === 'builds' && (
        <>
          <div className="card">
            <div className="card-title">Compare builds</div>
            <div className="compare-select-row">
              <select className="input" value={compareId || ''} onChange={e => setCompareId(Number(e.target.value))}>
                {COMMUNITY_BUILDS.map(build => (
                  <option key={build.id} value={build.id}>{build.name} · {build.hp} · {build.cost}</option>
                ))}
              </select>
            </div>
            {compareBuild && (
              <div className="compare-grid">
                <CompareMetric label="Power" mine={`${myHp} whp`} theirs={compareBuild.hp} delta={`${myHp - compareHp >= 0 ? '+' : ''}${myHp - compareHp} whp`} />
                <CompareMetric label="Mods" mine={installedMods.length} theirs={compareBuild.mods} delta={`${installedMods.length - compareBuild.mods >= 0 ? '+' : ''}${installedMods.length - compareBuild.mods}`} />
                <CompareMetric label="Invested" mine={`$${totalSpent.toLocaleString()}`} theirs={compareBuild.cost} delta={`${totalSpent - compareCost >= 0 ? '+' : '-'}$${Math.abs(totalSpent - compareCost).toLocaleString()}`} />
              </div>
            )}
            {compareBuild && (
              <div className="compare-notes">
                <div>
                  <strong>Your build</strong>
                  <span>{activeVehicle.nickname || `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`} · {activeVehicle.type || 'Vehicle'} · {activeVehicle.color || 'Color not set'}</span>
                </div>
                <div>
                  <strong>{compareBuild.name}</strong>
                  <span>{compareBuild.desc}</span>
                </div>
              </div>
            )}
          </div>

          <div className="chips-row" style={{marginBottom:12}}>
            {FILTERS.map(f => (
              <button key={f} className={`chip ${filter===f?'on':''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All builds' : f}
              </button>
            ))}
          </div>

          <div className="comm-grid">
            {builds.map(b => (
              <div key={b.id} className="build-card">
                <div className="build-thumb" style={{background:`${b.color}22`,borderBottom:'1px solid var(--border)'}}>
                  <svg viewBox="0 0 260 90" style={{width:220}} xmlns="http://www.w3.org/2000/svg">
                    <rect width="260" height="90" fill={`${b.color}15`} />
                    <path d="M28 66 Q34 44 68 36 L108 28 Q138 22 162 23 L218 27 Q244 30 252 46 L256 66 Z" fill={b.color} />
                    <path d="M108 28 Q126 16 156 15 Q178 14 194 24 L196 28 Z" fill="#0a0a18" opacity="0.7" />
                    <circle cx="68" cy="70" r="12" fill="#111" /><circle cx="68" cy="70" r="8" fill="#444" />
                    <circle cx="214" cy="70" r="12" fill="#111" /><circle cx="214" cy="70" r="8" fill="#444" />
                  </svg>
                </div>
                <div className="build-body">
                  <div className="build-name">{b.name}</div>
                  <div className="build-sub">{b.loc}</div>
                  <div className="build-tags">{b.tags.map(t=><span key={t} className="btag">{t}</span>)}</div>
                  <div className="build-desc">{b.desc}</div>
                  <div className="build-stats-row">
                    <div className="bstat"><span className="bstat-val">{b.hp}</span><span className="bstat-label">Power</span></div>
                    <div className="bstat"><span className="bstat-val">{b.mods}</span><span className="bstat-label">Mods</span></div>
                    <div className="bstat"><span className="bstat-val">{b.cost}</span><span className="bstat-label">Invested</span></div>
                    <button className={`like-btn ${likedBuilds.has(b.id)?'liked':''}`} onClick={() => toggleLike(b.id)}>
                      {likedBuilds.has(b.id) ? '♥' : '+♥'} {b.likes + (likedBuilds.has(b.id) ? 1 : 0)}
                    </button>
                    <button className="like-btn" onClick={() => setCompareId(b.id)}>Compare</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {subtab === 'marketplace' && (
        <>
          <div className="card">
            <div className="card-title">Community marketplace</div>
            <div className="estimate-note">Prototype listings for cars and parts. A live version would need seller profiles, photos, location privacy, reporting, escrow/payment options, and moderation.</div>
            <div className="chips-row compact-chips" style={{marginTop:10}}>
              {['all','Car','Part'].map(item => (
                <button key={item} className={`chip ${listingFilter===item?'on':''}`} onClick={() => setListingFilter(item)}>
                  {item === 'all' ? 'All listings' : `${item}s`}
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Compatibility checkpoint before payment</div>
            <div className="form-grid">
              <select className="input span-2" value={checkoutListingId || ''} onChange={e => setCheckoutListingId(Number(e.target.value))}>
                {listings.map(item => (
                  <option key={item.id} value={item.id}>{item.title} · {item.fitment}</option>
                ))}
              </select>
            </div>
            <div className="list-row"><span className="row-name">Buyer vehicle</span><span className="row-value">{activeVehicleLabel}</span></div>
            <div className="list-row"><span className="row-name">Listing fitment</span><span className="row-value">{checkoutListing?.fitment || 'Not specified'}</span></div>
            <div className="list-row"><span className="row-name">Match score</span><span className="row-value">{compatibilityScore}/100</span></div>
            <div className="list-row">
              <span className="row-name">Checkpoint status</span>
              <span className={`row-value ${compatibilityStatus === 'Pass' ? 'price-low' : ''}`}>{compatibilityStatus}</span>
            </div>
            <div className="estimate-note">
              {compatibilityStatus === 'Pass'
                ? 'Payment can proceed with standard buyer protection.'
                : compatibilityStatus === 'Manual review'
                  ? 'Require seller confirmation + photos/part number before payment release.'
                  : 'Block checkout until fitment details are corrected.'}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Fulfillment trust layer</div>
            <div className="estimate-note">Carrier tracking ingestion + proof of delivery + anomaly flags (weight mismatch, route deviation, stalled tracking).</div>
            {shipments.map(item => (
              <div key={item.id} className="alert-row">
                <span className="alert-dot" style={{ background: item.anomaly === 'none' ? '#639922' : '#EF9F27' }} />
                <div className="alert-main">
                  <span className="alert-name">{item.carrier} · {item.tracking}</span>
                  <div className="alert-subline">
                    <span className="alert-type-badge">{item.status}</span>
                    <span className="alert-price-meta">ETA {item.eta} · {item.weight} · {item.route}</span>
                    <span className={`alert-quality ${item.anomaly === 'none' ? 'good' : 'wait'}`}>
                      {item.anomaly === 'none' ? 'No anomaly' : item.anomaly === 'route' ? 'Route deviation flag' : 'Tracking stall flag'}
                    </span>
                    <span className="alert-price-meta">POD: {item.pod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="market-grid">
            {scopedListings.map(item => (
              <div className="market-card" key={item.id}>
                <MarketplaceThumb type={item.type} />
                <div className="part-head">
                  <div>
                    <div className="part-name">{item.title}</div>
                    <div className="shop-type">{item.type} · {item.location}</div>
                  </div>
                  <span className="brand-badge">${item.price.toLocaleString()}</span>
                </div>
                <div className="shop-note">{item.note}</div>
                <div className="list-row"><span className="row-name">Fitment</span><span className="row-value">{item.fitment}</span></div>
                <div className="list-row"><span className="row-name">Seller</span><span className="row-value">{item.seller}</span></div>
                <div className="shop-actions">
                  <button className="pbtn" onClick={() => alert(`Message seller: ${item.seller}`)}>Message</button>
                  <button className="pbtn" onClick={() => alert(`Save listing: ${item.title}`)}>Save</button>
                  <button className="pbtn" onClick={() => alert(`Report listing: ${item.title}`)}>Report</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {subtab === 'list' && (
        <div className="card">
          <div className="card-title">Create marketplace listing</div>
          <div className="form-grid">
            <select className="input" value={listingForm.type} onChange={e => setListingForm(p => ({ ...p, type:e.target.value }))}>
              <option>Part</option>
              <option>Car</option>
            </select>
            <input className="input" type="number" placeholder="Price" value={listingForm.price} onChange={e => setListingForm(p => ({ ...p, price:e.target.value }))} />
            <input className="input span-2" placeholder="Title, car, or part name" value={listingForm.title} onChange={e => setListingForm(p => ({ ...p, title:e.target.value }))} />
            <input className="input" placeholder="Location" value={listingForm.location} onChange={e => setListingForm(p => ({ ...p, location:e.target.value }))} />
            <input className="input" placeholder="Fitment / compatible cars" value={listingForm.fitment} onChange={e => setListingForm(p => ({ ...p, fitment:e.target.value }))} />
            <textarea className="input profile-textarea span-2" placeholder="Condition, mileage, included hardware, title status, pickup/shipping notes..." value={listingForm.note} onChange={e => setListingForm(p => ({ ...p, note:e.target.value }))} />
            <button className="btn btn-yellow span-2" onClick={addListing}>+ Add listing preview</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CompareMetric({ label, mine, theirs, delta }) {
  return (
    <div className="compare-metric">
      <div className="compare-label">{label}</div>
      <div className="compare-values">
        <span>{mine}</span>
        <span>{theirs}</span>
      </div>
      <div className="compare-delta">{delta}</div>
    </div>
  );
}

function MarketplaceThumb({ type }) {
  return (
    <div className={`market-thumb ${type === 'Car' ? 'car' : 'part'}`}>
      {type === 'Car' ? (
        <svg viewBox="0 0 260 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 66 Q34 44 68 36 L108 28 Q138 22 162 23 L218 27 Q244 30 252 46 L256 66 Z" fill="#F5C800" />
          <path d="M108 28 Q126 16 156 15 Q178 14 194 24 L196 28 Z" fill="#0a0a18" opacity="0.75" />
          <circle cx="68" cy="70" r="12" fill="#111" /><circle cx="214" cy="70" r="12" fill="#111" />
        </svg>
      ) : (
        <div className="part-shape"><span /></div>
      )}
      <span>{type}</span>
    </div>
  );
}
