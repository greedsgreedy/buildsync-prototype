// src/pages/index.jsx  (Next.js page = route "/")
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useStore } from '../hooks/useStore';
import Garage       from '../components/Garage';
import MyMods       from '../components/MyMods';
import PartsCatalog from '../components/PartsCatalog';
import PartScout from '../components/PartScout';
import Wishlist     from '../components/Wishlist';
import Calculator   from '../components/Calculator';
import BudgetPlanner from '../components/BudgetPlanner';
import Alerts       from '../components/Alerts';
import Community    from '../components/Community';
import LocalShops   from '../components/LocalShops';
import DriveEvents  from '../components/DriveEvents';
import ProRacing    from '../components/ProRacing';
import SharedParts  from '../components/SharedParts';
import AccountSync  from '../components/AccountSync';
import Maintenance  from '../components/Maintenance';
import Notifications from '../components/Notifications';
import Roadmap from '../components/Roadmap';
import AdminData from '../components/AdminData';
import { supabase } from '../lib/supabase';

const NAV = [
  { id:'garage',    label:'Garage',        icon:'🏎', group:'overview' },
  { id:'account',   label:'Account & sync',icon:'☁', group:'overview' },
  { id:'mods',      label:'My mods',       icon:'🔧', group:'overview' },
  { id:'roadmap',   label:'Roadmap',       icon:'🗺', group:'overview' },
  { id:'admin',     label:'Data admin',    icon:'🧾', group:'overview' },
  { id:'partscout', label:'PartScout',    icon:'🧠',  group:'shopping' },
  { id:'parts',     label:'Parts catalog', icon:'🛒', group:'shopping' },
  { id:'shared',    label:'Shared parts',  icon:'⇄',  group:'shopping' },
  { id:'wishlist',  label:'Wishlist',       icon:'★',  group:'shopping' },
  { id:'notifications',label:'Notifications',icon:'📣', group:'shopping' },
  { id:'calculator',label:'Calculator',     icon:'=',  group:'planning' },
  { id:'maintenance',label:'Maintenance',   icon:'🧰', group:'planning' },
  { id:'budget',    label:'Budget planner',icon:'$',  group:'planning' },
  { id:'alerts',    label:'Drop alerts',   icon:'🔔', group:'planning' },
  { id:'shops',     label:'Local shops',   icon:'⌖',  group:'explore'  },
  { id:'events',    label:'Tracks & Meets',icon:'⌁',  group:'explore'  },
  { id:'racing',    label:'Pro racing',    icon:'🏁', group:'explore'  },
  { id:'community', label:'Community',     icon:'👥', group:'explore'  },
];

export default function App() {
  const [tab, setTab] = useState('garage');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [supabaseTestMsg, setSupabaseTestMsg] = useState('');
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const store = useStore();
  const activeVehicle = store.activeVehicle;
  const adminAllowlist = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(Boolean);
  const userEmail = (store.authUser?.email || store.account?.email || '').toLowerCase();
  const isPrivilegedUser = process.env.NODE_ENV === 'development' || adminAllowlist.includes(userEmail);
  const visibleNav = NAV.filter(item => (item.id === 'admin' ? isPrivilegedUser : true));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPrivilegedUser && tab === 'admin') {
      setTab('garage');
    }
  }, [isPrivilegedUser, tab]);

  if (!mounted) return null;

  async function runSupabaseTest() {
    try {
      setSupabaseTesting(true);
      setSupabaseTestMsg('Testing Supabase...');
      const note = `modscout test ${new Date().toISOString()}`;

      const { error: insertError } = await supabase
        .from('health_check')
        .insert([{ note }]);

      if (insertError) {
        setSupabaseTestMsg(`Insert failed: ${insertError.message}`);
        return;
      }

      const { data, error: readError } = await supabase
        .from('health_check')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (readError) {
        setSupabaseTestMsg(`Read failed: ${readError.message}`);
        return;
      }

      setSupabaseTestMsg(`Success: ${data?.[0]?.note || 'row found'}`);
    } catch (err) {
      setSupabaseTestMsg(`Test failed: ${err.message}`);
    } finally {
      setSupabaseTesting(false);
    }
  }

  const renderTab = () => {
    switch(tab) {
      case 'garage':    return <Garage    store={store} onNavigate={setTab} />;
      case 'account':   return <AccountSync store={store} />;
      case 'mods':      return <MyMods    store={store} />;
      case 'roadmap':   return <Roadmap />;
      case 'admin':     return <AdminData store={store} />;
      case 'partscout': return <PartScout store={store} />;
      case 'parts':     return <PartsCatalog store={store} mode="catalog" onOpenPartScout={() => setTab('partscout')} />;
      case 'shared':    return <SharedParts store={store} />;
      case 'wishlist':  return <Wishlist  store={store} />;
      case 'calculator':return <Calculator store={store} />;
      case 'maintenance': return <Maintenance store={store} />;
      case 'budget':    return <BudgetPlanner />;
      case 'alerts':    return <Alerts    store={store} />;
      case 'notifications': return <Notifications store={store} />;
      case 'shops':     return <LocalShops store={store} />;
      case 'events':    return <DriveEvents store={store} />;
      case 'racing':    return <ProRacing />;
      case 'community': return <Community store={store} />;
      default:          return <Garage    store={store} onNavigate={setTab} />;
    }
  };

  // Group nav items for sidebar sections
  const groups = [...new Set(visibleNav.map(n => n.group))];
  const mobilePrimary = ['garage', 'parts', 'wishlist', 'community'];
  const primaryNav = visibleNav.filter(n => mobilePrimary.includes(n.id));
  const moreNav = visibleNav.filter(n => !mobilePrimary.includes(n.id));

  return (
    <>
      <Head>
        <title>ModScout — A90 Supra Mod Tracker</title>
        <meta name="description" content="Track your A90 Supra mods, compare parts and prices, manage your build budget." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="shell">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="logo">Mod<span>Scout</span></div>
          <div className="car-pill">
            <b>{activeVehicle.year} {activeVehicle.make} {activeVehicle.model} {activeVehicle.trim}</b> · {activeVehicle.engine || 'No engine set'} · {activeVehicle.color || 'No color set'}
          </div>
          <div className="topbar-right">
            <button className="partscout-top-btn" onClick={() => setTab('partscout')}>Search & compare with <strong>PartScout</strong> →</button>
            <button className="icon-btn" title="Alerts">🔔</button>
            <button className="icon-btn" title="Settings">⚙</button>
          </div>
        </header>

        <div className="body">
          {/* SIDEBAR */}
          <nav className="sidebar">
            {groups.map(group => (
              <div key={group}>
                <div className="nav-section">{group}</div>
                {visibleNav.filter(n => n.group === group).map(n => (
                  <button
                    key={n.id}
                    className={`nav-item ${tab === n.id ? 'active' : ''}`}
                    onClick={() => setTab(n.id)}
                  >
                    {n.icon ? <span className="ni-icon">{n.icon}</span> : null}
                    {n.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* MAIN CONTENT */}
          <main className="main">
            {process.env.NODE_ENV === 'development' && (
              <div className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn"
                    onClick={runSupabaseTest}
                    disabled={supabaseTesting}
                  >
                    {supabaseTesting ? 'Testing...' : 'Test Supabase'}
                  </button>
                  <span style={{ opacity: 0.85 }}>{supabaseTestMsg || 'Run once to verify Supabase read/write.'}</span>
                </div>
              </div>
            )}
            {renderTab()}
          </main>
        </div>

        <nav className="mobile-nav">
          {primaryNav.map(n => (
            <button
              key={n.id}
              className={`mobile-nav-item ${tab === n.id ? 'active' : ''}`}
              onClick={() => { setTab(n.id); setMobileMenuOpen(false); }}
            >
              <span>{n.icon || ''}</span>
              <small>{n.label}</small>
            </button>
          ))}
          <button className={`mobile-nav-item ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(v => !v)}>
            <span>⋯</span>
            <small>More</small>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="mobile-more-sheet">
            {moreNav.map(n => (
              <button
                key={n.id}
                className={`mobile-more-item ${tab === n.id ? 'active' : ''}`}
                onClick={() => { setTab(n.id); setMobileMenuOpen(false); }}
              >
                <span>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
