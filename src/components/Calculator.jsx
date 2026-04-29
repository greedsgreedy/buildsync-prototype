import { useMemo, useState } from 'react';
import { CAT_META } from '../data';

const TAX_RATES = {
  AL: 0.0929, AK: 0.0182, AZ: 0.0853, AR: 0.0946, CA: 0.0885,
  CO: 0.0781, CT: 0.0635, DE: 0, DC: 0.06, FL: 0.0702,
  GA: 0.0738, HI: 0.0444, ID: 0.0603, IL: 0.0886, IN: 0.07,
  IA: 0.0694, KS: 0.0857, KY: 0.06, LA: 0.0956, ME: 0.055,
  MD: 0.06, MA: 0.0625, MI: 0.06, MN: 0.0813, MS: 0.0710,
  MO: 0.0841, MT: 0, NE: 0.0697, NV: 0.0824, NH: 0,
  NJ: 0.066, NM: 0.0772, NY: 0.0853, NC: 0.0698, ND: 0.0704,
  OH: 0.0724, OK: 0.0899, OR: 0, PA: 0.0634, RI: 0.07,
  SC: 0.0749, SD: 0.0640, TN: 0.0955, TX: 0.0820, UT: 0.0725,
  VT: 0.0636, VA: 0.0577, WA: 0.0929, WV: 0.0657, WI: 0.0570, WY: 0.0556,
};

const SHIPPING_PRESETS = {
  standard: { label: 'Standard estimate', rate: 0.06, perItem: 12 },
  freight: { label: 'Large parts / freight', rate: 0.10, perItem: 38 },
  pickup: { label: 'Local pickup', rate: 0, perItem: 0 },
  manual: { label: 'Manual override', rate: 0, perItem: 0 },
};

const COUNTRIES = {
  US: { label: 'United States', taxLabel: 'Sales tax', tax: 0.0825, duty: 0.025 },
  CA: { label: 'Canada', taxLabel: 'GST/HST estimate', tax: 0.12, duty: 0.06 },
  MX: { label: 'Mexico', taxLabel: 'VAT estimate', tax: 0.16, duty: 0.10 },
  GB: { label: 'United Kingdom', taxLabel: 'VAT estimate', tax: 0.20, duty: 0.045 },
  DE: { label: 'Germany', taxLabel: 'VAT estimate', tax: 0.19, duty: 0.045 },
  FR: { label: 'France', taxLabel: 'VAT estimate', tax: 0.20, duty: 0.045 },
  JP: { label: 'Japan', taxLabel: 'Consumption tax', tax: 0.10, duty: 0.03 },
  AU: { label: 'Australia', taxLabel: 'GST estimate', tax: 0.10, duty: 0.05 },
  AE: { label: 'United Arab Emirates', taxLabel: 'VAT estimate', tax: 0.05, duty: 0.05 },
};

const ORIGIN_COUNTRIES = {
  US: 'United States',
  CN: 'China',
  JP: 'Japan',
  DE: 'Germany',
  KR: 'South Korea',
  GB: 'United Kingdom',
  TW: 'Taiwan',
  TH: 'Thailand',
  MX: 'Mexico',
};

const SOURCE_PRESETS = {
  usRetailer: { label: 'Origin: US retailer / domestic', origin: 'US', rate: 0.06, perItem: 12 },
  alibaba: { label: 'Origin: Alibaba / China supplier', origin: 'CN', rate: 0.13, perItem: 45 },
  temu: { label: 'Origin: Temu / China marketplace', origin: 'CN', rate: 0.10, perItem: 22 },
  japan: { label: 'Origin: Japan performance shop', origin: 'JP', rate: 0.12, perItem: 55 },
  europe: { label: 'Origin: Europe performance shop', origin: 'DE', rate: 0.11, perItem: 50 },
  manual: { label: 'Origin: manual country/shipping', origin: 'US', rate: 0, perItem: 0 },
};

const DUTY_CATEGORY_RATES = {
  general: { label: 'General auto parts', rate: 0.035 },
  performance: { label: 'Performance / engine parts', rate: 0.045 },
  wheels: { label: 'Wheels / tires', rate: 0.04 },
  body: { label: 'Carbon / body panels', rate: 0.06 },
  electronics: { label: 'Electronics / tuning', rate: 0.025 },
  apparel: { label: 'Accessories / merch', rate: 0.08 },
};

export default function Calculator({ store }) {
  const { wishlist, wishlistTotal, removeFromWishlist } = store;
  const [destinationCountry, setDestinationCountry] = useState('US');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('');
  const [sourcePreset, setSourcePreset] = useState('usRetailer');
  const [originCountry, setOriginCountry] = useState('US');
  const [dutyCategory, setDutyCategory] = useState('general');
  const [includeDuty, setIncludeDuty] = useState(true);
  const [manualShipping, setManualShipping] = useState('');
  const [installRate, setInstallRate] = useState(140);

  const source = SOURCE_PRESETS[sourcePreset] || SOURCE_PRESETS.usRetailer;
  const effectiveOrigin = sourcePreset === 'manual' ? originCountry : source.origin;
  const isInternational = effectiveOrigin !== destinationCountry;
  const destination = COUNTRIES[destinationCountry] || COUNTRIES.US;
  const taxRate = destinationCountry === 'US' ? (TAX_RATES[state] ?? destination.tax) : destination.tax;

  const shipping = useMemo(() => {
    if (sourcePreset === 'manual') return Math.max(0, Math.round(parseFloat(manualShipping) || 0));
    const internationalMultiplier = isInternational ? 1 : 0.55;
    return Math.round(((wishlistTotal * source.rate) + (wishlist.length * source.perItem)) * internationalMultiplier);
  }, [isInternational, manualShipping, source, sourcePreset, wishlist.length, wishlistTotal]);

  const dutyRate = isInternational && includeDuty ? (DUTY_CATEGORY_RATES[dutyCategory]?.rate ?? destination.duty) : 0;
  const duty = Math.round(wishlistTotal * dutyRate);
  const taxableAmount = wishlistTotal + shipping + duty;
  const tax = Math.round(taxableAmount * taxRate);
  const contingency = Math.round(wishlistTotal * 0.08);
  const install = Math.round(wishlist.length * (Number(installRate) || 0));
  const projected = wishlistTotal + shipping + duty + tax + contingency + install;

  return (
    <div className="tab-content">
      <div className="stat-grid four">
        <div className="stat"><div className="stat-val">${wishlistTotal.toLocaleString()}</div><div className="stat-label">Parts subtotal</div></div>
        <div className="stat"><div className="stat-val">${shipping.toLocaleString()}</div><div className="stat-label">Estimated shipping</div></div>
        <div className="stat"><div className="stat-val">${duty.toLocaleString()}</div><div className="stat-label">Import duty</div></div>
        <div className="stat"><div className="stat-val accent">${projected.toLocaleString()}</div><div className="stat-label">Landed total</div></div>
      </div>

      <div className="card">
        <div className="card-title">Destination and origin</div>
        <div className="form-grid">
          <select className="input" value={destinationCountry} onChange={e => setDestinationCountry(e.target.value)}>
            {Object.entries(COUNTRIES).map(([code, country]) => (
              <option key={code} value={code}>Ship to: {country.label}</option>
            ))}
          </select>
          <select className="input" value={sourcePreset} onChange={e => setSourcePreset(e.target.value)}>
            {Object.entries(SOURCE_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>{preset.label}</option>
            ))}
          </select>
          {destinationCountry === 'US' ? (
            <select className="input" value={state} onChange={e => setState(e.target.value)}>
              {Object.keys(TAX_RATES).map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          ) : (
            <input className="input" value={destination.taxLabel} disabled />
          )}
          <input className="input" placeholder={destinationCountry === 'US' ? 'ZIP code optional' : 'Postal code optional'} value={zip} onChange={e => setZip(e.target.value)} />
          {sourcePreset === 'manual' && (
            <select className="input" value={originCountry} onChange={e => setOriginCountry(e.target.value)}>
              {Object.entries(ORIGIN_COUNTRIES).map(([code, label]) => (
                <option key={code} value={code}>Origin country: {label}</option>
              ))}
            </select>
          )}
          <select className={`input ${sourcePreset === 'manual' ? '' : 'span-2'}`} value={dutyCategory} onChange={e => setDutyCategory(e.target.value)}>
            {Object.entries(DUTY_CATEGORY_RATES).map(([key, dutyCat]) => (
              <option key={key} value={key}>{dutyCat.label}</option>
            ))}
          </select>
          {sourcePreset === 'manual' && (
            <input className="input span-2" type="number" placeholder="Manual shipping total $" value={manualShipping} onChange={e => setManualShipping(e.target.value)} />
          )}
          <label className="check-line span-2">
            <input type="checkbox" checked={includeDuty} onChange={e => setIncludeDuty(e.target.checked)} />
            Include import duty estimate when origin and destination differ
          </label>
          <input className="input span-2" type="number" placeholder="Install allowance per part $" value={installRate} onChange={e => setInstallRate(e.target.value)} />
        </div>
        <div className="estimate-note">
          Estimates use destination-level tax/VAT/GST, source-based shipping, and broad duty categories. Production would use exact address, carrier, vendor origin, HS/tariff code, and checkout data.
        </div>
      </div>

      <div className="stat-grid four">
        <div className="stat"><div className="stat-val">${tax.toLocaleString()}</div><div className="stat-label">{destination.taxLabel}</div></div>
        <div className="stat"><div className="stat-val">${install.toLocaleString()}</div><div className="stat-label">Install allowance</div></div>
        <div className="stat"><div className="stat-val">${contingency.toLocaleString()}</div><div className="stat-label">Contingency</div></div>
        <div className="stat"><div className="stat-val">{(taxRate * 100).toFixed(2)}%</div><div className="stat-label">Tax rate</div></div>
      </div>

      <div className="card">
        <div className="card-title">Saved parts estimate</div>
        {wishlist.length === 0 ? (
          <div className="empty-state">Save parts from the catalog to calculate a build total</div>
        ) : wishlist.map(item => {
          const cm = CAT_META[item.cat] || { color: '#1e1e22', text: '#888', label: item.cat };
          return (
            <div key={item.id} className="calc-row">
              <span className="cat-badge" style={{ background: cm.color, color: cm.text }}>{cm.label}</span>
              <span className="calc-name">{item.name}</span>
              <span className="calc-price">${item.price.toLocaleString()}</span>
              <button className="rm-btn" onClick={() => removeFromWishlist(item.id)}>Remove</button>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-title">Cost assumptions</div>
        <div className="list-row"><span className="row-name">Destination</span><span className="row-value">{destination.label}{destinationCountry === 'US' ? ` · ${state}` : ''}</span></div>
        <div className="list-row"><span className="row-name">Ships from</span><span className="row-value">{ORIGIN_COUNTRIES[effectiveOrigin] || effectiveOrigin} · {isInternational ? 'international' : 'domestic'}</span></div>
        <div className="list-row"><span className="row-name">Shipping</span><span className="row-value">{source.label} · ${shipping.toLocaleString()}</span></div>
        <div className="list-row"><span className="row-name">Duty estimate</span><span className="row-value">{(dutyRate * 100).toFixed(2)}% · ${duty.toLocaleString()}</span></div>
        <div className="list-row"><span className="row-name">{destination.taxLabel}</span><span className="row-value">{(taxRate * 100).toFixed(2)}% · ${tax.toLocaleString()}</span></div>
        <div className="list-row"><span className="row-name">Taxable amount</span><span className="row-value">Parts + shipping + duty · ${taxableAmount.toLocaleString()}</span></div>
        <div className="list-row"><span className="row-name">Install allowance</span><span className="row-value">${(Number(installRate) || 0).toLocaleString()} per saved part</span></div>
        <div className="list-row"><span className="row-name">Contingency</span><span className="row-value">8% for hardware, fluids, fitment extras</span></div>
        {zip && <div className="list-row"><span className="row-name">ZIP</span><span className="row-value">{zip}</span></div>}
      </div>
    </div>
  );
}
