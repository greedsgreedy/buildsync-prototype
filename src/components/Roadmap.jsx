const PHASES = [
  {
    phase: 'V1 · Trustable core',
    items: [
      'VIN decoder + trim/brake/transmission fitment checks',
      'Maintenance intelligence with dynamic service intervals',
      'Notification center for price, stock, events, and service due',
      'Account mode + cloud sync foundation',
    ],
  },
  {
    phase: 'V2 · Commerce + community quality',
    items: [
      'Verified seller/shop badges and reporting flows',
      'Marketplace anti-spam + reputation points',
      'Price history charts and smarter alert confidence',
      'Install timeline with receipts, photos, and milestones',
    ],
  },
  {
    phase: 'V3 · Moat + scale',
    items: [
      'Full fitment engine with compatibility graph across platforms',
      'Regionalization at checkout level (currency/tax/shipping/duty)',
      'Real-time vendor APIs and back-in-stock webhooks',
      'Personalized build plans based on goals, budget, and usage',
    ],
  },
];

export default function Roadmap() {
  return (
    <div className="tab-content">
      {PHASES.map(phase => (
        <div className="card" key={phase.phase}>
          <div className="card-title">{phase.phase}</div>
          {phase.items.map(item => (
            <div className="list-row" key={item}>
              <span className="row-name">{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

