import { useState } from 'react';

const COLORS = [
  { name: 'Nitro Yellow', value: '#F5C800' },
  { name: 'Absolute Zero', value: '#f1f1eb' },
  { name: 'Nocturnal Black', value: '#101014' },
  { name: 'Renaissance Red', value: '#C82020' },
  { name: 'Refraction Blue', value: '#1840A0' },
  { name: 'Turbulence Gray', value: '#7f8286' },
  { name: 'Burnout Orange', value: '#E05A10' },
];

const MODS = [
  { id: 'tint', label: '20% tint' },
  { id: 'hood', label: 'Carbon hood' },
  { id: 'wing', label: 'Rear wing' },
  { id: 'splitter', label: 'Front splitter' },
  { id: 'lowered', label: 'Lowered stance' },
  { id: 'te37', label: 'Gold TE37 wheels' },
  { id: 'wide', label: 'Widebody flares' },
  { id: 'lights', label: 'Smoked lights' },
];

export default function PreviewStudio() {
  const [color, setColor] = useState(COLORS[0]);
  const [mods, setMods] = useState(new Set(['tint', 'hood', 'wing', 'splitter', 'lowered', 'te37']));

  const toggle = (id) => {
    setMods(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="tab-content">
      <div className="preview-stage card">
        <div className={`preview-car ${mods.has('lowered') ? 'lowered' : ''} ${mods.has('wide') ? 'wide' : ''}`} style={{ '--car-color': color.value }}>
          {mods.has('wing') && <div className="pv-wing" />}
          <div className="pv-body" />
          <div className={`pv-window ${mods.has('tint') ? 'tinted' : ''}`} />
          {mods.has('hood') && <div className="pv-hood" />}
          {mods.has('splitter') && <div className="pv-splitter" />}
          {mods.has('lights') && <div className="pv-light" />}
          <div className={`pv-wheel left ${mods.has('te37') ? 'te37' : ''}`} />
          <div className={`pv-wheel right ${mods.has('te37') ? 'te37' : ''}`} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Paint color</div>
        <div className="swatch-row">
          {COLORS.map(c => (
            <button
              key={c.name}
              className={`swatch ${color.name === c.name ? 'on' : ''}`}
              title={c.name}
              style={{ background: c.value }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Preview mods</div>
        <div className="toggle-grid">
          {MODS.map(mod => (
            <button key={mod.id} className={`toggle-pill ${mods.has(mod.id) ? 'on' : ''}`} onClick={() => toggle(mod.id)}>
              {mod.label}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-yellow btn-full" onClick={() => alert('AI render generation would connect to an image backend here')}>
        Generate AI render
      </button>
    </div>
  );
}
