import { useEffect, useState } from 'react';
import { MANUFACTURER_MODELS, POPULAR_BRANDS, VEHICLE_TYPES } from '../data';

// src/components/Garage.jsx
export default function Garage({ store, onNavigate }) {
  const {
    vehicles, activeVehicle, activeVehicleId, setActiveVehicleId, addVehicle, removeVehicle,
    updateVehicleProfile, addVehiclePhoto, removeVehiclePhoto, uploadVehiclePhoto, logAudit,
    installedMods, totalSpent, wishlist, alerts,
  } = store;
  const [form, setForm] = useState({ year:'', make:'', model:'', trim:'', type:'Coupe', engine:'', color:'' });
  const [profile, setProfile] = useState({
    nickname: activeVehicle.nickname || '',
    bio: activeVehicle.bio || '',
    instagram: activeVehicle.socials?.instagram || '',
    tiktok: activeVehicle.socials?.tiktok || '',
    youtube: activeVehicle.socials?.youtube || '',
    buildThread: activeVehicle.socials?.buildThread || '',
  });
  const [vinDraft, setVinDraft] = useState(activeVehicle.fitment?.vin || '');
  const [vinSavedFor, setVinSavedFor] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    setProfile({
      nickname: activeVehicle.nickname || '',
      bio: activeVehicle.bio || '',
      instagram: activeVehicle.socials?.instagram || '',
      tiktok: activeVehicle.socials?.tiktok || '',
      youtube: activeVehicle.socials?.youtube || '',
      buildThread: activeVehicle.socials?.buildThread || '',
    });
    setVinDraft(activeVehicle.fitment?.vin || '');
    setVinSavedFor('');
  }, [activeVehicle]);

  const progress = [
    { label:'Performance', val:70, color:'#378ADD', cur:7, max:10 },
    { label:'Exterior',    val:50, color:'#639922', cur:4, max:8 },
    { label:'Suspension',  val:50, color:'#7F77DD', cur:2, max:4 },
    { label:'Interior',    val:20, color:'#EF9F27', cur:1, max:5 },
  ];

  const handleAddVehicle = () => {
    if (!form.year.trim() || !form.make.trim() || !form.model.trim()) return;
    addVehicle(form);
    setForm({ year:'', make:'', model:'', trim:'', type:'Coupe', engine:'', color:'' });
  };

  const modelOptions = MANUFACTURER_MODELS[form.make] || [];
  const photos = activeVehicle.photos || [];

  const handleProfileSave = () => {
    updateVehicleProfile({
      nickname: profile.nickname,
      bio: profile.bio,
      socials: {
        instagram: profile.instagram,
        tiktok: profile.tiktok,
        youtube: profile.youtube,
        buildThread: profile.buildThread,
      },
    });
    if (typeof logAudit === 'function') {
      logAudit('garage_profile_update', { vehicleId: activeVehicleId });
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const file = files[0];
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadStatus('Only PNG, JPG, JPEG, or WEBP files are allowed.');
      event.target.value = '';
      return;
    }
    setUploadStatus('');
    // Single-photo policy: replace existing photo instead of adding multiple.
    (photos || []).forEach(photo => removeVehiclePhoto(photo.id));
    (async () => {
      if (typeof uploadVehiclePhoto === 'function') {
        const result = await uploadVehiclePhoto(file);
        if (!result.ok) {
          const url = URL.createObjectURL(file);
          addVehiclePhoto({ url, name: file.name });
          setUploadStatus(`Cloud upload skipped: ${result.error}. Saved locally.`);
        } else {
          setUploadStatus('Photo uploaded to cloud storage.');
        }
        return;
      }
      const url = URL.createObjectURL(file);
      addVehiclePhoto({ url, name: file.name });
    })();
    event.target.value = '';
  };

  const handleUpdateVin = () => {
    const clean = vinDraft.toUpperCase().slice(0, 17);
    updateVehicleProfile({
      fitment: {
        vin: clean,
        vinDecoded: clean.length >= 11,
      },
    });
    setVinSavedFor(`${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} ${activeVehicle.trim}`);
    if (typeof logAudit === 'function') {
      logAudit('vin_update', { vehicleId: activeVehicleId, vinLength: clean.length });
    }
  };

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">My vehicles</div>
        <div className="vehicle-grid">
          {vehicles.map(vehicle => (
            <button
              key={vehicle.id}
              className={`vehicle-card ${vehicle.id === activeVehicleId ? 'active' : ''}`}
              onClick={() => setActiveVehicleId(vehicle.id)}
            >
              <span className="vehicle-name">{vehicle.year} {vehicle.make} {vehicle.model}</span>
              <span className="vehicle-meta">{vehicle.type || 'Vehicle'} · {vehicle.trim || 'Base'} · {vehicle.engine || 'Engine not set'} · {vehicle.color || 'Color not set'}</span>
            </button>
          ))}
        </div>
        <div className="active-vehicle-actions">
          <div>
            <div className="active-vehicle-title">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model} {activeVehicle.trim}</div>
            <div className="subtle-text">Editing this vehicle's mods, wishlist, alerts, and spend.</div>
          </div>
          <button
            className="rm-btn"
            disabled={vehicles.length <= 1}
            onClick={() => removeVehicle(activeVehicleId)}
            title={vehicles.length <= 1 ? 'Keep at least one vehicle in the garage' : 'Remove active vehicle'}
          >
            Remove vehicle
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Garage profile</div>
        <div className="profile-layout">
          <div>
            <div className="photo-grid">
              {photos.length === 0 ? (
                <div className="photo-empty">Add car photos</div>
              ) : photos.map(photo => (
                <div key={photo.id} className="photo-tile">
                  <img src={photo.url} alt={photo.name || 'Vehicle'} />
                  <button className="photo-remove" onClick={() => removeVehiclePhoto(photo.id)}>×</button>
                </div>
              ))}
            </div>
            <label className="btn btn-full photo-upload">
              {photos.length ? 'Replace photo' : 'Upload photo'}
              <input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={handlePhotoUpload} />
            </label>
            {uploadStatus && <div className="estimate-note" style={{ marginTop: 8 }}>{uploadStatus}</div>}
          </div>
          <div className="profile-form">
            <input className="input" placeholder="Build nickname" value={profile.nickname} onChange={e => setProfile(p => ({ ...p, nickname:e.target.value }))} />
            <textarea className="input profile-textarea" placeholder="Build notes / story" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio:e.target.value }))} />
            <input className="input" placeholder="Instagram handle" value={profile.instagram} onChange={e => setProfile(p => ({ ...p, instagram:e.target.value }))} />
            <input className="input" placeholder="TikTok handle" value={profile.tiktok} onChange={e => setProfile(p => ({ ...p, tiktok:e.target.value }))} />
            <input className="input" placeholder="YouTube channel" value={profile.youtube} onChange={e => setProfile(p => ({ ...p, youtube:e.target.value }))} />
            <input className="input" placeholder="Build thread / website URL" value={profile.buildThread} onChange={e => setProfile(p => ({ ...p, buildThread:e.target.value }))} />
            <button className="btn btn-yellow" onClick={handleProfileSave}>Save profile</button>
          </div>
        </div>
        <div className="profile-preview">
          <strong>{activeVehicle.nickname || `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`}</strong>
          <span>{activeVehicle.bio || 'No build notes yet'}</span>
          <div className="social-row">
            {activeVehicle.socials?.instagram && <span>IG: {activeVehicle.socials.instagram}</span>}
            {activeVehicle.socials?.tiktok && <span>TikTok: {activeVehicle.socials.tiktok}</span>}
            {activeVehicle.socials?.youtube && <span>YouTube: {activeVehicle.socials.youtube}</span>}
            {activeVehicle.socials?.buildThread && <span>Thread: {activeVehicle.socials.buildThread}</span>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Fitment profile (VIN + trim-aware)</div>
        <div className="form-grid">
          <div className="custom-event-row span-2">
            <input
              className="input"
              placeholder="VIN (17 chars)"
              value={vinDraft}
              onChange={e => setVinDraft(e.target.value.toUpperCase().slice(0, 17))}
            />
            <button className="pbtn" onClick={handleUpdateVin}>Update VIN</button>
          </div>
          <select className="input" value={activeVehicle.fitment?.transmission || 'AT8'} onChange={e => updateVehicleProfile({ fitment: { transmission: e.target.value } })}>
            <option value="AT8">Transmission: 8AT</option>
            <option value="MT6">Transmission: 6MT</option>
            <option value="DCT">Transmission: DCT</option>
          </select>
          <select className="input" value={activeVehicle.fitment?.brakePackage || 'Stock'} onChange={e => updateVehicleProfile({ fitment: { brakePackage: e.target.value } })}>
            <option value="Stock">Brake package: Stock</option>
            <option value="BigBrakeKit">Brake package: Big brake kit</option>
            <option value="TrackPads">Brake package: Track pad setup</option>
          </select>
          <select className="input" value={activeVehicle.fitment?.drivetrain || 'RWD'} onChange={e => updateVehicleProfile({ fitment: { drivetrain: e.target.value } })}>
            <option value="RWD">Drivetrain: RWD</option>
            <option value="AWD">Drivetrain: AWD</option>
            <option value="FWD">Drivetrain: FWD</option>
          </select>
          <select className="input" value={activeVehicle.fitment?.emissions || 'US'} onChange={e => updateVehicleProfile({ fitment: { emissions: e.target.value } })}>
            <option value="US">Emissions: US</option>
            <option value="EU">Emissions: EU</option>
            <option value="JP">Emissions: JP</option>
            <option value="Other">Emissions: Other</option>
          </select>
        </div>
        <div className="estimate-note">
          VIN decode status: {activeVehicle.fitment?.vinDecoded ? 'Decoded profile ready' : 'Pending VIN decode (prototype mode)'}.
          {vinSavedFor ? ` Saved to: ${vinSavedFor}.` : ''}
        </div>
      </div>

      <div className="stat-grid four">
        <StatCard value={installedMods.length} label="Mods installed" accent />
        <StatCard value={`$${totalSpent.toLocaleString()}`} label="Total invested" />
        <StatCard value={wishlist.length} label="Wishlist items" />
        <StatCard value={alerts.length} label="Active alerts" />
      </div>

      <div className="card">
        <div className="card-title">Build progress</div>
        {progress.map(p => (
          <div key={p.label} className="prog-row">
            <div className="prog-labels">
              <span>{p.label}</span>
              <span>{p.cur} / {p.max}</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill" style={{ width:`${p.val}%`, background:p.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Recent wishlist</div>
        {wishlist.length === 0 ? (
          <div className="empty-state">
            No saved parts yet —{' '}
            <span className="link" onClick={() => onNavigate('parts')}>browse catalog</span>
          </div>
        ) : (
          <>
            {wishlist.slice(0, 5).map(w => (
              <div key={w.id} className="list-row">
                <span className="row-name">{w.name}</span>
                <span className="row-value">from ${w.price?.toLocaleString()}</span>
              </div>
            ))}
            {wishlist.length > 5 && (
              <div className="subtle-text" onClick={() => onNavigate('wishlist')} style={{cursor:'pointer',marginTop:6}}>
                +{wishlist.length - 5} more in wishlist →
              </div>
            )}
          </>
        )}
      </div>

      <button className="btn btn-yellow btn-full" onClick={() => onNavigate('budget')}>
        Open budget planner →
      </button>

      <div className="card">
        <div className="card-title">Add vehicle</div>
        <div className="brand-picker">
          <div className="filter-label">Popular manufacturers</div>
          <select
            className="input brand-select"
            value={POPULAR_BRANDS.includes(form.make) ? form.make : ''}
            onChange={e => setForm(p => ({ ...p, make:e.target.value, model:'' }))}
          >
            <option value="">Choose manufacturer</option>
            {POPULAR_BRANDS.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <div className="chips-row brand-chips">
            {POPULAR_BRANDS.slice(0, 15).map(brand => (
              <button
                key={brand}
                className={`chip ${form.make === brand ? 'on' : ''}`}
                onClick={() => setForm(p => ({ ...p, make:brand, model:'' }))}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
        <div className="brand-picker">
          <div className="filter-label">Popular models</div>
          <select
            className="input brand-select"
            value={modelOptions.includes(form.model) ? form.model : ''}
            onChange={e => setForm(p => ({ ...p, model:e.target.value }))}
            disabled={!modelOptions.length}
          >
            <option value="">{modelOptions.length ? 'Choose model' : 'Choose a manufacturer first'}</option>
            {modelOptions.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          {modelOptions.length > 0 && (
            <div className="chips-row brand-chips">
              {modelOptions.map(model => (
                <button
                  key={model}
                  className={`chip ${form.model === model ? 'on' : ''}`}
                  onClick={() => setForm(p => ({ ...p, model }))}
                >
                  {model}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="form-grid">
          <input className="input" placeholder="Year" value={form.year} onChange={e => setForm(p => ({ ...p, year:e.target.value }))} />
          <input className="input" placeholder="Manufacturer or custom make" value={form.make} onChange={e => setForm(p => ({ ...p, make:e.target.value }))} />
          <input className="input" placeholder="Model or custom model" value={form.model} onChange={e => setForm(p => ({ ...p, model:e.target.value }))} />
          <input className="input" placeholder="Trim" value={form.trim} onChange={e => setForm(p => ({ ...p, trim:e.target.value }))} />
          <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type:e.target.value }))}>
            {VEHICLE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <input className="input" placeholder="Engine" value={form.engine} onChange={e => setForm(p => ({ ...p, engine:e.target.value }))} />
          <input className="input" placeholder="Color" value={form.color} onChange={e => setForm(p => ({ ...p, color:e.target.value }))} />
          <button className="btn btn-yellow span-2" onClick={handleAddVehicle}>+ Add vehicle</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, accent }) {
  return (
    <div className="stat">
      <div className={`stat-val ${accent ? 'accent' : ''}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
