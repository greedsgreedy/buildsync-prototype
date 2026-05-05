const DEFAULT_WINDOW = 5000;
const TOYOTA_MAINTENANCE_GUIDE_URL = 'https://assets.sia.toyota.com/publications/en/omms-s/T-MMS-21Supra/pdf/T-MMS-21Supra.pdf';
const TOYOTA_OWNERS_MANUAL_URL = 'https://www.toyota.com/owners/warranty-owners-manuals/';
const BMW_OWNERS_MANUAL_URL = 'https://www.bmwusa.com/owners-manuals.html';
const B58_SERVICE_THREAD_URL = 'https://f30.bimmerpost.com/forums/showthread.php?t=1698823';
const B58_SPARK_THREAD_URL = 'https://f30.bimmerpost.com/forums/showthread.php?t=2016273';
const SUPRA_CABIN_FILTER_THREAD_URL = 'https://www.supramkv.com/threads/how-to-replace-cabin-air-filter.25828/';

const OIL_USAGE_MULTIPLIERS = {
  street: 1,
  mixed: 0.82,
  track: 0.62,
};

const OIL_CLIMATE_MULTIPLIERS = {
  temperate: 1,
  hot: 0.9,
  cold: 0.92,
  humid: 0.9,
  dusty: 0.85,
};

const OIL_SERVICE_PROFILES = {
  '0W-20': {
    baseMiles: 10000,
    sourceType: 'manufacturer',
    sourceLabel: 'Manufacturer baseline',
    summary: 'Best match for stock daily-driven setups following OEM-style long interval guidance.',
  },
  '5W-20': {
    baseMiles: 8000,
    sourceType: 'community',
    sourceLabel: 'Owner pattern',
    summary: 'Usually treated as a more conservative interval than 0W-20 once owners start deviating from a pure OEM fill strategy.',
  },
  '0W-30': {
    baseMiles: 7000,
    sourceType: 'community',
    sourceLabel: 'Owner pattern',
    summary: 'Common enthusiast middle ground for spirited street use with a shorter refresh window than thin OEM oil.',
  },
  '5W-30': {
    baseMiles: 6500,
    sourceType: 'community',
    sourceLabel: 'Owner pattern',
    summary: 'Popular street-performance choice that many owners service sooner for heat and shear protection.',
  },
  '0W-40': {
    baseMiles: 5000,
    sourceType: 'community',
    sourceLabel: 'Owner pattern',
    summary: 'Usually paired with tuned or hotter-use cars, so owners commonly shorten the oil interval.',
  },
  '5W-40': {
    baseMiles: 4500,
    sourceType: 'community',
    sourceLabel: 'Owner pattern',
    summary: 'Typically used on harder-driven setups where owners prefer the shortest service cadence in this group.',
  },
};

function buildLinks(...links) {
  return links.filter(Boolean);
}

const SERVICE_PROFILES = {
  default: {
    name: 'General enthusiast maintenance',
    items: [
      {
        key: 'sparkPlugsLast',
        label: 'Spark plugs',
        interval: 45000,
        note: 'Fresh plugs help keep tuned and direct-injection engines happy under load.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Based on common enthusiast replacement cadence rather than a strict OEM reminder window.',
        links: buildLinks({ label: 'Community service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
      {
        key: 'cabinFilterLast',
        label: 'Cabin air filter',
        interval: 15000,
        note: 'Keeps airflow strong and reduces HVAC strain.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'Best treated as routine filter maintenance from the normal service schedule.',
        links: buildLinks({ label: 'Toyota owner resources', url: TOYOTA_OWNERS_MANUAL_URL, kind: 'manufacturer' }),
      },
      {
        key: 'engineAirFilterLast',
        label: 'Engine air filter',
        interval: 20000,
        note: 'A clean filter helps maintain airflow and consistent trims.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'Follows normal scheduled filter inspection / replacement behavior.',
        links: buildLinks({ label: 'Toyota maintenance guide', url: TOYOTA_MAINTENANCE_GUIDE_URL, kind: 'manufacturer' }),
      },
      {
        key: 'diffFluidLast',
        label: 'Differential fluid',
        interval: 40000,
        note: 'Worth servicing early on spirited rear-wheel-drive cars.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Common enthusiast preventative interval for cars that see heat cycles and spirited driving.',
        links: buildLinks({ label: 'BMW/B58 service thread', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
    ],
  },
  supra_b58_auto: {
    name: 'Toyota Supra 3.0 / B58 / 8AT service profile',
    items: [
      {
        key: 'sparkPlugsLast',
        label: 'Spark plugs',
        interval: 60000,
        note: 'A common 60k-mile service on street-driven B58 cars; tuned cars often benefit from shorter intervals.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'Anchored to the normal mid-mileage service rhythm, then shortened by many tuned-car owners.',
        links: buildLinks(
          { label: 'Toyota maintenance guide', url: TOYOTA_MAINTENANCE_GUIDE_URL, kind: 'manufacturer' },
          { label: 'B58 owner interval thread', url: B58_SPARK_THREAD_URL, kind: 'community' },
        ),
      },
      {
        key: 'cabinFilterLast',
        label: 'Cabin air filter',
        interval: 20000,
        note: 'Easy refresh item once the car starts seeing weaker HVAC flow or dusty use.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Supra owners often replace this more proactively than the basic schedule because it is cheap and noticeable.',
        links: buildLinks(
          { label: 'SupraMKV cabin filter how-to', url: SUPRA_CABIN_FILTER_THREAD_URL, kind: 'community' },
          { label: 'Toyota owner resources', url: TOYOTA_OWNERS_MANUAL_URL, kind: 'manufacturer' },
        ),
      },
      {
        key: 'engineAirFilterLast',
        label: 'Engine air filter',
        interval: 20000,
        note: 'Especially worth checking sooner if you drive in dusty climates or run an open intake.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'Treated as a normal service-item cadence, with earlier checks for dusty use or intake changes.',
        links: buildLinks({ label: 'Toyota maintenance guide', url: TOYOTA_MAINTENANCE_GUIDE_URL, kind: 'manufacturer' }),
      },
      {
        key: 'diffFluidLast',
        label: 'Differential fluid',
        interval: 60000,
        note: 'Helpful preventative service once the chassis starts stacking mileage and heat cycles.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Common Supra / BMW owner preventative interval because rear diff fluid sees real heat on spirited cars.',
        links: buildLinks({ label: 'B58 service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
      {
        key: 'transFluidLast',
        label: 'ZF8 automatic transmission fluid',
        interval: 60000,
        note: 'A common enthusiast refresh point for the ZF8 once mileage and heat cycles build up.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Toyota does not surface this as a simple dashboard reminder, but many B58 / ZF8 owners service it preventatively.',
        links: buildLinks({ label: 'B58 service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
      {
        key: 'serpBeltLast',
        label: 'Serpentine belt inspection / replacement',
        interval: 60000,
        note: 'Inspect for cracking and glazing once the car reaches the mid-mileage service window.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Usually surfaced by owners as a smart inspection point around the same time as other 60k-mile refresh items.',
        links: buildLinks({ label: 'B58 owner interval thread', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
    ],
  },
  supra_b58_manual: {
    name: 'Toyota Supra 3.0 / B58 / 6MT service profile',
    items: [
      {
        key: 'sparkPlugsLast',
        label: 'Spark plugs',
        interval: 60000,
        note: 'Still a common 60k-mile service point; tuned cars usually shorten this.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'Same mid-mileage B58 spark plug rhythm as the automatic cars.',
        links: buildLinks(
          { label: 'Toyota maintenance guide', url: TOYOTA_MAINTENANCE_GUIDE_URL, kind: 'manufacturer' },
          { label: 'B58 owner interval thread', url: B58_SPARK_THREAD_URL, kind: 'community' },
        ),
      },
      {
        key: 'transFluidLast',
        label: 'Manual transmission fluid',
        interval: 50000,
        note: 'Manual cars benefit from a gearbox fluid refresh once mileage and spirited use accumulate.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'This is more enthusiast-driven preventative maintenance than an obvious consumer-facing Toyota reminder.',
        links: buildLinks({ label: 'BMW/B58 service discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
      {
        key: 'diffFluidLast',
        label: 'Differential fluid',
        interval: 60000,
        note: 'Rear diff fluid is still worth doing around the same mileage band on spirited 6MT cars.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Manual cars often see more aggressive driveline loading, so owners usually keep this on the preventative list.',
        links: buildLinks({ label: 'BMW/B58 service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
      {
        key: 'cabinFilterLast',
        label: 'Cabin air filter',
        interval: 20000,
        note: 'Cheap, noticeable refresh item once airflow starts dropping.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'A proactive comfort item many Supra owners handle early because it is inexpensive and easy to notice.',
        links: buildLinks({ label: 'SupraMKV cabin filter how-to', url: SUPRA_CABIN_FILTER_THREAD_URL, kind: 'community' }),
      },
    ],
  },
  supra_b48: {
    name: 'Toyota Supra 2.0 / B48 service profile',
    items: [
      {
        key: 'sparkPlugsLast',
        label: 'Spark plugs',
        interval: 60000,
        note: 'The 2.0 Supra still benefits from a mid-mileage plug refresh, especially if it has seen a tune.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'Uses the same general BMW/Toyota service rhythm for modern turbo plug replacement.',
        links: buildLinks({ label: 'Toyota maintenance guide', url: TOYOTA_MAINTENANCE_GUIDE_URL, kind: 'manufacturer' }),
      },
      {
        key: 'cabinFilterLast',
        label: 'Cabin air filter',
        interval: 20000,
        note: 'Good proactive refresh item once cabin airflow weakens.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Owners often replace this before it becomes an obvious comfort issue because the cost is low.',
        links: buildLinks({ label: 'SupraMKV cabin filter how-to', url: SUPRA_CABIN_FILTER_THREAD_URL, kind: 'community' }),
      },
      {
        key: 'engineAirFilterLast',
        label: 'Engine air filter',
        interval: 20000,
        note: 'Worth checking sooner for dusty climates or aftermarket intake setups.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'Still follows normal filter inspection / replacement maintenance logic.',
        links: buildLinks({ label: 'Toyota maintenance guide', url: TOYOTA_MAINTENANCE_GUIDE_URL, kind: 'manufacturer' }),
      },
      {
        key: 'transFluidLast',
        label: 'ZF8 automatic transmission fluid',
        interval: 60000,
        note: 'Preventative refresh point once the 2.0 car starts accumulating mileage and heat cycles.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'More enthusiast preventative maintenance than a simple owner-facing interval reminder.',
        links: buildLinks({ label: 'BMW/B58 interval discussion (ZF-based service rhythm)', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
    ],
  },
  bmw_b58: {
    name: 'BMW B58 service profile',
    items: [
      {
        key: 'sparkPlugsLast',
        label: 'Spark plugs',
        interval: 60000,
        note: 'BMW B58 owners commonly treat 60k as the standard replacement point on stock street cars.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'BMW owner guidance and owner experience both point to the same broad 60k service band.',
        links: buildLinks(
          { label: 'BMW digital owner manual', url: BMW_OWNERS_MANUAL_URL, kind: 'manufacturer' },
          { label: 'B58 spark plug interval thread', url: B58_SPARK_THREAD_URL, kind: 'community' },
        ),
      },
      {
        key: 'cabinFilterLast',
        label: 'Cabin microfilter',
        interval: 20000,
        note: 'Often replaced around the same cadence as BMW microfilter service reminders.',
        sourceType: 'manufacturer',
        sourceLabel: 'Manufacturer baseline',
        sourceNote: 'BMW service cadence commonly surfaces cabin microfilter replacement around 20k-mile intervals.',
        links: buildLinks(
          { label: 'BMW digital owner manual', url: BMW_OWNERS_MANUAL_URL, kind: 'manufacturer' },
          { label: 'B58 service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' },
        ),
      },
      {
        key: 'engineAirFilterLast',
        label: 'Engine intake filter',
        interval: 40000,
        note: 'Often checked or replaced sooner on modified cars and dusty-use cars.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Many B58 owners monitor intake filter condition based on use rather than waiting for the full long interval.',
        links: buildLinks({ label: 'B58 service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
      {
        key: 'transFluidLast',
        label: 'ZF8 automatic transmission fluid',
        interval: 60000,
        note: 'Common preventative service target for BMW B58 cars with the ZF8.',
        sourceType: 'community',
        sourceLabel: 'Owner pattern',
        sourceNote: 'Often treated as a worthwhile preventative step once the car hits the 50–60k-mile band.',
        links: buildLinks({ label: 'B58 service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' }),
      },
    ],
  },
};

function getVehicleProfile(vehicle) {
  const make = String(vehicle?.make || '').toLowerCase();
  const model = String(vehicle?.model || '').toLowerCase();
  const engine = String(vehicle?.engine || '').toLowerCase();
  const transmission = String(vehicle?.fitment?.transmission || '').toLowerCase();

  if (make === 'toyota' && model.includes('supra') && engine.includes('b58')) {
    return transmission.includes('mt') || transmission.includes('6mt')
      ? SERVICE_PROFILES.supra_b58_manual
      : SERVICE_PROFILES.supra_b58_auto;
  }

  if (make === 'toyota' && model.includes('supra') && (engine.includes('2.0') || engine.includes('b48'))) {
    return SERVICE_PROFILES.supra_b48;
  }

  if (make === 'bmw' && engine.includes('b58')) {
    return SERVICE_PROFILES.bmw_b58;
  }

  return SERVICE_PROFILES.default;
}

export function getOilServicePlan(vehicle, usageProfile = {}, installedMods = []) {
  const viscosity = usageProfile.oilViscosity || '0W-20';
  const oilProfile = OIL_SERVICE_PROFILES[viscosity] || OIL_SERVICE_PROFILES['0W-20'];
  const usageMul = OIL_USAGE_MULTIPLIERS[usageProfile.style || 'street'] || 1;
  const climateMul = OIL_CLIMATE_MULTIPLIERS[usageProfile.climate || 'temperate'] || 1;
  const powerMods = installedMods.filter(mod => ['performance', 'electronics', 'fueling', 'intercooler', 'downpipe', 'exhaust'].includes(mod.cat)).length;
  const modMul = powerMods >= 6 ? 0.8 : powerMods >= 3 ? 0.9 : 1;
  const adjustedMiles = Math.max(2500, Math.round(oilProfile.baseMiles * usageMul * climateMul * modMul));

  const make = String(vehicle?.make || '').toLowerCase();
  const model = String(vehicle?.model || '').toLowerCase();
  const engine = String(vehicle?.engine || '').toLowerCase();
  const links = [];

  if (make === 'toyota' && model.includes('supra')) {
    links.push({ label: 'Toyota maintenance guide', url: TOYOTA_MAINTENANCE_GUIDE_URL, kind: 'manufacturer' });
    links.push({ label: 'Toyota owner resources', url: TOYOTA_OWNERS_MANUAL_URL, kind: 'manufacturer' });
  }
  if (make === 'bmw' || engine.includes('b58') || engine.includes('b48')) {
    links.push({ label: 'BMW digital owner manual', url: BMW_OWNERS_MANUAL_URL, kind: 'manufacturer' });
    links.push({ label: 'B58 service interval discussion', url: B58_SERVICE_THREAD_URL, kind: 'community' });
  }

  return {
    viscosity,
    baseMiles: oilProfile.baseMiles,
    adjustedMiles,
    sourceType: oilProfile.sourceType,
    sourceLabel: oilProfile.sourceLabel,
    summary: oilProfile.summary,
    links,
  };
}

export function getMileageRecommendations(vehicle, serviceLog = {}, currentMileage = 0) {
  const mileage = Number(currentMileage || 0);
  const profile = getVehicleProfile(vehicle);
  const leadWindow = mileage >= 100000 ? 7500 : DEFAULT_WINDOW;

  const recommendations = profile.items.map((item) => {
    const last = Number(serviceLog[item.key] || 0);
    const nextDue = last > 0 ? last + item.interval : item.interval;
    const remaining = nextDue - mileage;

    let status = 'ok';
    if (remaining <= 0) status = 'due';
    else if (remaining <= leadWindow) status = 'soon';

    return {
      ...item,
      last,
      nextDue,
      remaining,
      status,
    };
  });

  return {
    profileName: profile.name,
    leadWindow,
    items: recommendations,
    visible: recommendations.filter((item) => item.status !== 'ok'),
  };
}
