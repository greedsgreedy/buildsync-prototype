import { useMemo } from 'react';

const USAGE_MULTIPLIERS = {
  street: 1,
  mixed: 0.82,
  track: 0.62,
};

const CLIMATE_MULTIPLIERS = {
  temperate: 1,
  hot: 0.9,
  cold: 0.92,
  humid: 0.9,
  dusty: 0.85,
};

const BASE_INTERVALS = [
  { key: 'oilLast', label: 'Engine oil', miles: 5000 },
  { key: 'brakeFluidLast', label: 'Brake fluid', miles: 12000 },
  { key: 'transFluidLast', label: 'Transmission fluid', miles: 30000 },
  { key: 'coolantLast', label: 'Coolant', miles: 40000 },
];

export default function Maintenance({ store }) {
  const { activeVehicle, updateVehicleProfile, installedMods } = store;
  const usage = activeVehicle.usageProfile || {};
  const service = activeVehicle.serviceLog || {};
  const currentMileage = Number(usage.currentMileage || 0);

  const modIntensity = useMemo(() => {
    const powerMods = installedMods.filter(mod => ['performance', 'electronics', 'fueling', 'intercooler', 'downpipe', 'exhaust'].includes(mod.cat)).length;
    if (powerMods >= 6) return 0.8;
    if (powerMods >= 3) return 0.9;
    return 1;
  }, [installedMods]);

  const rows = BASE_INTERVALS.map(item => {
    const usageMul = USAGE_MULTIPLIERS[usage.style || 'street'] || 1;
    const climateMul = CLIMATE_MULTIPLIERS[usage.climate || 'temperate'] || 1;
    const dynamicInterval = Math.max(1500, Math.round(item.miles * usageMul * climateMul * modIntensity));
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
          <div className="span-2">
            <div className="filter-label">Current mileage</div>
            <input className="input" type="number" aria-label="Current mileage" value={currentMileage} placeholder="Current mileage" onChange={e => updateVehicleProfile({ usageProfile: { currentMileage: Number(e.target.value || 0) } })} />
          </div>
        </div>
        <div className="estimate-note">
          Intervals adjust from driving style, climate, and mod stack intensity to reduce failures on tuned cars.
        </div>
      </div>

      <div className="card">
        <div className="card-title">Service schedule</div>
        {rows.map(row => (
          <div key={row.key} className="list-row">
            <span className="row-name">{row.label} · every {row.dynamicInterval.toLocaleString()} mi</span>
            <span className="row-value">{row.remaining <= 0 ? `Due now (${Math.abs(row.remaining).toLocaleString()} mi overdue)` : `${row.remaining.toLocaleString()} mi left`}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Last service mileage</div>
        <div className="form-grid">
          <input className="input" type="number" placeholder="Oil last changed at" value={service.oilLast || 0} onChange={e => updateVehicleProfile({ serviceLog: { oilLast: Number(e.target.value || 0) } })} />
          <input className="input" type="number" placeholder="Brake fluid last at" value={service.brakeFluidLast || 0} onChange={e => updateVehicleProfile({ serviceLog: { brakeFluidLast: Number(e.target.value || 0) } })} />
          <input className="input" type="number" placeholder="Transmission fluid last at" value={service.transFluidLast || 0} onChange={e => updateVehicleProfile({ serviceLog: { transFluidLast: Number(e.target.value || 0) } })} />
          <input className="input" type="number" placeholder="Coolant last at" value={service.coolantLast || 0} onChange={e => updateVehicleProfile({ serviceLog: { coolantLast: Number(e.target.value || 0) } })} />
        </div>
      </div>
    </div>
  );
}
