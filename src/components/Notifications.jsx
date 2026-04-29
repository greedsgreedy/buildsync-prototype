import { useMemo } from 'react';
import { PARTS, getPriceAnalytics, minPrice } from '../data';

function daysBetween(dateA, dateB) {
  return Math.floor((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Notifications({ store }) {
  const { activeVehicle, alerts, installedMods } = store;

  const notifications = useMemo(() => {
    const list = [];

    alerts.forEach(alert => {
      const part = PARTS.find(p => p.name.toLowerCase().includes(alert.part.toLowerCase()) || alert.part.toLowerCase().includes(p.name.toLowerCase()));
      if (!part) return;
      const now = minPrice(part.vendors);
      const stats = getPriceAnalytics(part);
      if (alert.type === 'drop' && now <= stats.lowest30) {
        list.push({ type: 'price', priority: 1, title: `${part.name} hit 30-day low`, body: `Now $${now.toLocaleString()} (${stats.lowest30.toLocaleString()} 30d low)` });
      }
      if (alert.type === 'restock') {
        list.push({ type: 'stock', priority: 2, title: `${part.name} restock watch active`, body: 'Track vendor availability in live backend mode.' });
      }
    });

    const usage = activeVehicle.usageProfile || {};
    const service = activeVehicle.serviceLog || {};
    const mileage = Number(usage.currentMileage || 0);
    const oilDue = (Number(service.oilLast || 0) + 5000) - mileage;
    if (oilDue <= 400) {
      list.push({
        type: 'maintenance',
        priority: 1,
        title: oilDue <= 0 ? 'Oil service overdue' : 'Oil service due soon',
        body: oilDue <= 0 ? `${Math.abs(oilDue).toLocaleString()} miles overdue.` : `${oilDue.toLocaleString()} miles remaining.`,
      });
    }

    const now = new Date();
    installedMods.forEach(mod => {
      const parsed = Date.parse(`01 ${mod.date}`);
      if (!Number.isNaN(parsed)) {
        const install = new Date(parsed);
        const ageDays = daysBetween(now, install);
        if (ageDays > 360 && ageDays < 395) {
          list.push({
            type: 'anniversary',
            priority: 3,
            title: `${mod.name} anniversary`,
            body: `${Math.round(ageDays / 365)} year since install at ${mod.miles || 'unknown mileage'}.`,
          });
        }
      }
    });

    list.push({
      type: 'events',
      priority: 3,
      title: 'Event reminder stream ready',
      body: 'Connect your created events and calendars to trigger day-before and roll-in reminders.',
    });

    return list.sort((a, b) => a.priority - b.priority);
  }, [alerts, activeVehicle, installedMods]);

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">Notification center</div>
        {notifications.length === 0 ? (
          <div className="empty-state">No active notifications</div>
        ) : notifications.map((item, idx) => (
          <div key={`${item.type}-${idx}`} className="alert-row">
            <span className="alert-dot" style={{ background: item.priority === 1 ? '#E24B4A' : item.priority === 2 ? '#EF9F27' : '#378ADD' }} />
            <div className="alert-main">
              <span className="alert-name">{item.title}</span>
              <div className="alert-price-meta">{item.body}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="estimate-note">
        Production notifications stack: push + email + in-app with quiet hours, batching, and per-signal controls.
      </div>
    </div>
  );
}

