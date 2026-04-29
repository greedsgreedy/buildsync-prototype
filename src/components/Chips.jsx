// src/components/Chips.jsx
export default function Chips({ options, active, onChange, className = '' }) {
  return (
    <div className={`chips-row ${className}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          className={`chip ${active === opt.value ? 'on' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
