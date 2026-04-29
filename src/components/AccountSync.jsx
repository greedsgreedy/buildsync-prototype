import { useMemo, useState } from 'react';

export default function AccountSync({ store }) {
  const {
    account,
    vehicles,
    upgradeToAccount,
    setGuestMode,
    toggleCloudSync,
    createSyncBundle,
    restoreSyncBundle,
  } = store;

  const [form, setForm] = useState({ name: account.name || '', email: account.email || '' });
  const [bundle, setBundle] = useState('');
  const [status, setStatus] = useState('');

  const summary = useMemo(() => {
    const mods = vehicles.reduce((acc, v) => acc + (v.installedMods?.length || 0), 0);
    const wishlist = vehicles.reduce((acc, v) => acc + (v.wishlist?.length || 0), 0);
    return { vehicles: vehicles.length, mods, wishlist };
  }, [vehicles]);

  const handleUpgrade = () => {
    if (!form.email.trim()) {
      setStatus('Email is required to create account mode.');
      return;
    }
    upgradeToAccount(form);
    setStatus('Account mode enabled. Local data is now profile-linked on this device.');
  };

  const handleCreateBundle = () => {
    const next = createSyncBundle();
    setBundle(next);
    setStatus('Sync bundle created. Use it on another device in Import sync bundle.');
  };

  const handleRestore = () => {
    const result = restoreSyncBundle(bundle);
    setStatus(result.ok ? 'Sync bundle imported successfully.' : result.error);
  };

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">Account mode</div>
        <div className="list-row"><span className="row-name">Current mode</span><span className="row-value">{account.mode === 'account' ? 'Account' : 'Guest'}</span></div>
        <div className="list-row"><span className="row-name">Profile</span><span className="row-value">{account.name || 'Guest'} {account.email ? `(${account.email})` : ''}</span></div>
        <div className="list-row"><span className="row-name">Cloud sync</span><span className="row-value">{account.cloudSync ? 'Enabled' : 'Disabled'}</span></div>
        <div className="list-row"><span className="row-name">Last sync</span><span className="row-value">{account.lastSyncedAt ? new Date(account.lastSyncedAt).toLocaleString() : 'Not synced yet'}</span></div>
      </div>

      <div className="card">
        <div className="card-title">Create account profile</div>
        <div className="form-grid">
          <input className="input" placeholder="Display name" value={form.name} onChange={e => setForm(p => ({ ...p, name:e.target.value }))} />
          <input className="input" placeholder="Email address" value={form.email} onChange={e => setForm(p => ({ ...p, email:e.target.value }))} />
          <button className="btn btn-yellow span-2" onClick={handleUpgrade}>Use account mode</button>
        </div>
        <div className="shop-actions" style={{marginTop:10}}>
          <button className="pbtn" onClick={toggleCloudSync}>{account.cloudSync ? 'Disable cloud sync' : 'Enable cloud sync'}</button>
          <button className="pbtn" onClick={setGuestMode}>Switch to guest</button>
        </div>
        <div className="estimate-note">
          This prototype uses local persistence and portable sync bundles. Production would replace this with real auth and encrypted cloud sync.
        </div>
      </div>

      <div className="card">
        <div className="card-title">Sync bundle</div>
        <div className="list-row"><span className="row-name">Vehicles</span><span className="row-value">{summary.vehicles}</span></div>
        <div className="list-row"><span className="row-name">Installed mods</span><span className="row-value">{summary.mods}</span></div>
        <div className="list-row"><span className="row-name">Wishlist items</span><span className="row-value">{summary.wishlist}</span></div>
        <div className="shop-actions" style={{marginTop:10}}>
          <button className="pbtn" onClick={handleCreateBundle}>Create sync bundle</button>
          <button className="pbtn" onClick={handleRestore}>Import sync bundle</button>
        </div>
        <textarea
          className="input profile-textarea"
          placeholder="Paste or copy sync bundle here"
          value={bundle}
          onChange={e => setBundle(e.target.value)}
          style={{marginTop:10}}
        />
        {status && <div className="estimate-note" style={{marginTop:10}}>{status}</div>}
      </div>
    </div>
  );
}
