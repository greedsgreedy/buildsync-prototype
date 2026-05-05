import { useMemo, useState } from 'react';
import { getBuildGoal, getGoalMaintenanceNotes } from '../lib/buildGoals';
import { getMileageRecommendations, getOilServicePlan } from '../lib/mileageRecommendations';

const BASE_INTERVALS = [
  { key: 'oilLast', label: 'Engine oil', miles: 5000 },
  { key: 'brakeFluidLast', label: 'Brake fluid', miles: 12000 },
  { key: 'transFluidLast', label: 'Transmission fluid', miles: 30000 },
  { key: 'coolantLast', label: 'Coolant', miles: 40000 },
];

const SERVICE_LOG_FIELDS = [
  { key: 'oilLast', label: 'Engine oil' },
  { key: 'brakeFluidLast', label: 'Brake fluid' },
  { key: 'transFluidLast', label: 'Transmission fluid' },
  { key: 'coolantLast', label: 'Coolant' },
  { key: 'sparkPlugsLast', label: 'Spark plugs' },
  { key: 'cabinFilterLast', label: 'Cabin filter' },
  { key: 'engineAirFilterLast', label: 'Engine air filter' },
  { key: 'diffFluidLast', label: 'Differential fluid' },
  { key: 'serpBeltLast', label: 'Serpentine belt' },
];

export default function Maintenance({ store }) {
  const { activeVehicle, updateVehicleProfile, installedMods } = store;
  const [openSourceKey, setOpenSourceKey] = useState('');
  const usage = activeVehicle.usageProfile || {};
  const service = activeVehicle.serviceLog || {};
  const buildGoal = activeVehicle.buildGoal || 'daily';
  const currentMileage = Number(usage.currentMileage || 0);
  const goalMeta = getBuildGoal(buildGoal);
  const goalMaintenanceNotes = getGoalMaintenanceNotes(buildGoal);
  const mileageRecs = getMileageRecommendations(activeVehicle, service, currentMileage);
  const oilPlan = getOilServicePlan(activeVehicle, usage, installedMods);

  const modIntensity = useMemo(() => {
    const powerMods = installedMods.filter(mod => ['performance', 'electronics', 'fueling', 'intercooler', 'downpipe', 'exhaust'].includes(mod.cat)).length;
    if (powerMods >= 6) return 0.8;
    if (powerMods >= 3) return 0.9;
    return 1;
  }, [installedMods]);

  const rows = BASE_INTERVALS.map(item => {
    const dynamicInterval = item.key === 'oilLast'
      ? oilPlan.adjustedMiles
      : Math.max(1500, Math.round(item.miles * (usage.style === 'track' ? 0.62 : usage.style === 'mixed' ? 0.82 : 1) * (usage.climate === 'hot' ? 0.9 : usage.climate === 'cold' ? 0.92 : usage.climate === 'humid' ? 0.9 : usage.climate === 'dusty' ? 0.85 : 1) * modIntensity));
    const last = Number(service[item.key] || 0);
    const nextDue = last + dynamicInterval;
    const remaining = nextDue - currentMileage;
    return { ...item, dynamicInterval, last, nextDue, remaining };
  });

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-title">Maintenance intelligence</div>
        <div className="form-grid">
          <select className="input" value={usage.style || 'street'} onChange={e => updateVehicleProfile({ usageProfile: { style: e.target.value } })}>
            <option value="street">Use: Street daily</option>
            <option value="mixed">Use: Street + canyon/track</option>
            <option value="track">Use: Track focused</option>
          </select>
          <select className="input" value={usage.climate || 'temperate'} onChange={e => updateVehicleProfile({ usageProfile: { climate: e.target.value } })}>
            <option value="temperate">Climate: Temperate</option>
            <option value="hot">Climate: Hot</option>
            <option value="cold">Climate: Cold</option>
            <option value="humid">Climate: Humid</option>
            <option value="dusty">Climate: Dusty</option>
          </select>
          <select className="input" value={usage.oilViscosity || '0W-20'} onChange={e => updateVehicleProfile({ usageProfile: { oilViscosity: e.target.value } })}>
            <option value="0W-20">Oil: 0W-20</option>
            <option value="5W-20">Oil: 5W-20</option>
            <option value="0W-30">Oil: 0W-30</option>
            <option value="5W-30">Oil: 5W-30</option>
            <option value="0W-40">Oil: 0W-40</option>
            <option value="5W-40">Oil: 5W-40</option>
          </select>
          <div className="span-2">
            <div className="filter-label">Current mileage</div>
            <input className="input" type="number" aria-label="Current mileage" value={currentMileage} placeholder="Current mileage" onChange={e => updateVehicleProfile({ usageProfile: { currentMileage: Number(e.target.value || 0) } })} />
          </div>
        </div>
        <div className="estimate-note">
          Intervals adjust from driving style, climate, and mod stack intensity to reduce failures on tuned cars.
        </div>
        <div className="goal-note" style={{ marginTop: 10 }}>
          Oil guidance for <strong>{oilPlan.viscosity}</strong>: {oilPlan.summary} Recommended interval right now is about <strong>{oilPlan.adjustedMiles.toLocaleString()} mi</strong>.
        </div>
      </div>

      <div className="card">
        <div className="filter-compact-head">
          <div className="card-title">Build goal maintenance focus</div>
          <div className="estimate-note">{goalMeta.label}</div>
        </div>
        <div className="goal-note" style={{ marginBottom: 10 }}>{goalMeta.note}</div>
        <div className="recommend-list">
          {goalMaintenanceNotes.map((note) => (
            <div key={note} className="recommend-row">
              <span className="rec-check on">✓</span>
              <span className="rec-name">{note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="filter-compact-head">
          <div className="card-title">Mileage-based replacement recommendations</div>
          <div className="estimate-note">{mileageRecs.profileName}</div>
        </div>
        <div className="goal-note" style={{ marginBottom: 10 }}>
          Uses the current odometer plus your saved service mileage to flag the next common replacement window.
        </div>
        {mileageRecs.visible.length === 0 ? (
          <div className="empty-state">Nothing is in the next service window yet. You&apos;re ahead of the common replacement intervals right now.</div>
        ) : (
          <div className="recommend-list">
            {mileageRecs.visible.map((item) => (
              <div key={item.key} className="recommend-row recommend-row-stack">
                <div className={`rec-check ${item.status === 'due' ? 'warn' : 'soon'}`}>{item.status === 'due' ? '!' : '↗'}</div>
                <div className="recommend-main">
                  <div className="recommend-head">
                    <span className="rec-name">{item.label}</span>
                    <div className="recommend-pill-row">
                      <span className={`source-pill ${item.sourceType || 'community'}`}>{item.sourceLabel || 'Owner pattern'}</span>
                      <span className={`status-pill ${item.status}`}>{item.status === 'due' ? 'Due now' : 'Coming up'}</span>
                    </div>
                  </div>
                  <div className="alert-price-meta">
                    {item.status === 'due'
                      ? `Target service window was ${item.nextDue.toLocaleString()} mi (${Math.abs(item.remaining).toLocaleString()} mi overdue).`
                      : `${item.remaining.toLocaleString()} mi until the ${item.nextDue.toLocaleString()} mi service window.`}
                  </div>
                  <button
                    type="button"
                    className="source-detail-toggle"
                    onClick={() => setOpenSourceKey((prev) => (prev === item.key ? '' : item.key))}
                  >
                    {openSourceKey === item.key ? 'Hide source details' : 'Learn why'}
                  </button>
                  {openSourceKey === item.key && (
                    <div className="source-popover">
                      <div className="alert-price-meta">{item.sourceNote}</div>
                      {Array.isArray(item.links) && item.links.length > 0 && (
                        <div className="source-link-list">
                          {item.links.map((link) => (
                            <a key={`${item.key}-${link.url}`} className={`source-link ${link.kind || 'community'}`} href={link.url} target="_blank" rel="noreferrer">
                              {link.kind === 'manufacturer' ? 'Manufacturer guide' : 'Community reference'}: {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="goal-note">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Service schedule</div>
        {rows.map(row => (
          <div key={row.key} className="list-row">
            <span className="row-name">{row.key === 'oilLast' ? `${row.label} (${oilPlan.viscosity})` : row.label} · every {row.dynamicInterval.toLocaleString()} mi</span>
            <span className="row-value">{row.remaining <= 0 ? `Due now (${Math.abs(row.remaining).toLocaleString()} mi overdue)` : `${row.remaining.toLocaleString()} mi left`}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="filter-compact-head">
          <div className="card-title">Last service mileage</div>
          <div className="estimate-note">Odometer reading when you last replaced or serviced the item</div>
        </div>
        <div className="goal-note" style={{ marginBottom: 10 }}>
          Example: if spark plugs were changed when the car had 42,300 miles on it, enter <strong>42300</strong> here. The app uses that odometer reading, plus the current mileage above, to decide what is due next.
        </div>
        <div className="form-grid">
          {SERVICE_LOG_FIELDS.map((field) => (
            <div key={field.key}>
              <div className="filter-label">{field.label}</div>
              <input
                className="input"
                type="number"
                aria-label={`${field.label} last service mileage`}
                placeholder="Enter odometer mileage"
                value={service[field.key] || 0}
                onChange={e => updateVehicleProfile({ serviceLog: { [field.key]: Number(e.target.value || 0) } })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
