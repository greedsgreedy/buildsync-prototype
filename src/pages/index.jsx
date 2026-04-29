// src/pages/index.jsx  (Next.js page = route "/")
import { useState } from 'react';
import Head from 'next/head';
import { useStore } from '../hooks/useStore';
import Garage       from '../components/Garage';
import MyMods       from '../components/MyMods';
import PartsCatalog from '../components/PartsCatalog';
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

const NAV = [
  { id:'garage',    label:'Garage',        icon:'🏎', group:'overview' },
  { id:'account',   label:'Account & sync',icon:'☁', group:'overview' },
  { id:'mods',      label:'My mods',       icon:'🔧', group:'overview' },
  { id:'roadmap',   label:'Roadmap',       icon:'🗺', group:'overview' },
  { id:'admin',     label:'Data admin',    icon:'🧾', group:'overview' },
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
  const store = useStore();
  const activeVehicle = store.activeVehicle;

  const renderTab = () => {
    switch(tab) {
      case 'garage':    return <Garage    store={store} onNavigate={setTab} />;
      case 'account':   return <AccountSync store={store} />;
      case 'mods':      return <MyMods    store={store} />;
      case 'roadmap':   return <Roadmap />;
      case 'admin':     return <AdminData store={store} />;
      case 'parts':     return <PartsCatalog store={store} />;
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
  const groups = [...new Set(NAV.map(n => n.group))];

  return (
    <>
      <Head>
        <title>BuildSync — A90 Supra Mod Tracker</title>
        <meta name="description" content="Track your A90 Supra mods, compare parts and prices, manage your build budget." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="shell">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="logo">Build<span>Sync</span></div>
          <div className="car-pill">
            <b>{activeVehicle.year} {activeVehicle.make} {activeVehicle.model} {activeVehicle.trim}</b> · {activeVehicle.engine || 'No engine set'} · {activeVehicle.color || 'No color set'}
          </div>
          <div className="topbar-right">
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
                {NAV.filter(n => n.group === group).map(n => (
                  <button
                    key={n.id}
                    className={`nav-item ${tab === n.id ? 'active' : ''}`}
                    onClick={() => setTab(n.id)}
                  >
                    <span className="ni-icon">{n.icon}</span>
                    {n.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* MAIN CONTENT */}
          <main className="main">
            {renderTab()}
          </main>
        </div>
      </div>
    </>
  );
}
