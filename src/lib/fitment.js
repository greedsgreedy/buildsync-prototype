const UNIVERSAL_CATEGORIES = new Set([
  'oil',
  'fluids',
  'maintenance',
  'accessories',
  'safety',
  'tires',
  'wheels',
  'lighting',
]);

const CATEGORY_INSTALL_GUIDANCE = {
  intake: {
    installNotes: ['Check coupler seating, clamp torque, and sensor orientation after install.'],
    supportingMods: ['A tune is optional for most intakes, but resetting learned trims can smooth post-install drivability.'],
  },
  chargepipe: {
    installNotes: ['Inspect boost couplers carefully and confirm the pipe clears nearby fan shrouds and heat sources.'],
    supportingMods: ['Strongly recommended before running higher boost targets on tuned cars.'],
  },
  downpipe: {
    installNotes: ['Confirm O2 sensor placement, fastener access, and nearby heat shielding before ordering.'],
    supportingMods: ['A tune is often required to avoid CEL or drivability issues depending on emissions setup.'],
  },
  exhaust: {
    installNotes: ['Verify tip alignment, valve controller support, and hanger preload once the system is heat-cycled.'],
    supportingMods: ['No tune is required for most cat-backs, but cabin drone tolerance varies a lot by use case.'],
  },
  turbo: {
    installNotes: ['Plan for labor, turbo priming procedure, and oil/coolant line inspection during install.'],
    supportingMods: ['Fueling, intercooler, and calibration support are usually required.'],
  },
  fueling: {
    installNotes: ['Confirm injector or pump revision compatibility before scheduling install time.'],
    supportingMods: ['Calibration support is required whenever flow changes meaningfully.'],
  },
  wheels: {
    installNotes: ['Confirm spoke clearance, offset, tire sizing, and fender clearance before buying.'],
    supportingMods: ['Alignment and, in some cases, spacers or studs may be needed depending on brake package.'],
  },
  tires: {
    installNotes: ['Choose compound around climate and use case, not just peak grip numbers.'],
    supportingMods: ['Alignment and pressure logging are recommended if the car sees canyon or track heat.'],
  },
  suspension: {
    installNotes: ['Plan for an alignment after install and note whether ride-height adjustment affects preload.'],
    supportingMods: ['Fresh top hats or a corner balance may be worthwhile depending on the setup.'],
  },
  brakes: {
    installNotes: ['Verify rotor size, pad shape, and wheel clearance before ordering brake parts.'],
    supportingMods: ['Fresh fluid and proper bed-in procedure should be part of the install plan.'],
  },
};

function normalize(value) {
  return String(value || '').toLowerCase().trim();
}

function includesAny(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle));
}

function compatibilityList(part) {
  if (!Array.isArray(part?.vehicle_compatibility)) return [];
  return part.vehicle_compatibility.map((item) => normalize(item)).filter(Boolean);
}

export function buildVehicleContext(vehicle = {}) {
  const fitment = vehicle.fitment || {};
  const make = vehicle.make || vehicle.manufacturer || '';
  const model = vehicle.model || '';
  const trim = vehicle.trim || '';
  const engine = vehicle.engine || '';

  return {
    year: vehicle.year || '',
    make,
    model,
    trim,
    engine,
    vin: fitment.vin || '',
    transmission: fitment.transmission || '',
    brakePackage: fitment.brakePackage || '',
    drivetrain: fitment.drivetrain || '',
    emissions: fitment.emissions || '',
  };
}

export function scorePartFitment(part, vehicle = {}) {
  const context = buildVehicleContext(vehicle);
  const compat = compatibilityList(part);
  const partText = normalize(`${part?.name || ''} ${part?.brand || ''} ${part?.category || ''}`);
  const vehicleText = normalize(`${context.year} ${context.make} ${context.model} ${context.trim} ${context.engine}`);
  const trimText = normalize(context.trim);
  const engineText = normalize(context.engine);
  const makeModelText = normalize(`${context.make} ${context.model}`);
  const hasVehicle = Boolean(context.make || context.model || context.engine || context.trim);

  if (!hasVehicle) {
    return {
      label: 'Needs verification',
      score: 55,
      visible: true,
      reason: 'No active vehicle selected yet',
      matchedRules: [],
      verificationChecks: ['Pick an active vehicle so PartScout can score fitment more confidently.'],
      installNotes: [],
      supportingMods: [],
    };
  }

  let score = UNIVERSAL_CATEGORIES.has(normalize(part?.category)) ? 58 : 35;
  const reasons = [];
  const badges = [];
  const matchedRules = [];
  const verificationChecks = [];
  const installNotes = [];
  const supportingMods = [];

  const directPlatformMatch = compat.some((item) => {
    if (makeModelText && item.includes(makeModelText)) return true;
    if (context.make && context.model && item.includes(normalize(context.model)) && item.includes(normalize(context.make))) return true;
    if (trimText && item.includes(trimText)) return true;
    return false;
  });

  const supraPlatformMatch = includesAny(vehicleText, ['supra', 'a90', 'a91']) &&
    compat.some((item) => includesAny(item, ['supra', 'a90', 'a91']));
  const bmwPlatformMatch = includesAny(vehicleText, ['bmw', 'z4']) &&
    compat.some((item) => includesAny(item, ['bmw', 'z4', 'g29']));
  const engineMatch = engineText && compat.some((item) => item.includes(normalize(context.engine).split(' ')[0]) || (engineText.includes('b58') && item.includes('b58')));
  const drivetrainMatch = context.drivetrain && compat.some((item) => item.includes(normalize(context.drivetrain)));
  const zfMatch = context.transmission === 'AT8' && (compat.some((item) => item.includes('zf8') || item.includes('zf 8')) || partText.includes('zf8'));

  if (directPlatformMatch || supraPlatformMatch || bmwPlatformMatch) {
    score += 36;
    reasons.push('Platform match');
    badges.push({ label: 'Platform', tone: 'good' });
    matchedRules.push(`Platform compatibility matches ${context.make} ${context.model}${context.trim ? ` ${context.trim}` : ''}.`);
  }
  if (trimText && (compat.some((item) => item.includes(trimText)) || partText.includes(trimText))) {
    score += 14;
    reasons.push('Trim match');
    badges.push({ label: `Trim ${context.trim}`, tone: 'good' });
    matchedRules.push(`Trim-specific language matches ${context.trim}.`);
  }
  if (engineMatch) {
    score += 18;
    reasons.push('Engine match');
    badges.push({ label: engineText.includes('b58') ? 'B58 match' : 'Engine match', tone: 'good' });
    matchedRules.push(`Engine support aligns with ${context.engine}.`);
  }
  if (drivetrainMatch || zfMatch) {
    score += 8;
    reasons.push('Drivetrain / transmission match');
    badges.push({ label: context.transmission === 'AT8' ? '8AT / ZF8' : context.transmission || 'Transmission match', tone: 'good' });
    matchedRules.push(
      drivetrainMatch
        ? `Drivetrain rule matches ${context.drivetrain}.`
        : `Transmission clues align with ${context.transmission === 'AT8' ? '8AT / ZF8' : context.transmission}.`
    );
  }

  const likelySharedPlatform = engineText.includes('b58') &&
    (compat.some((item) => item.includes('b58') || item.includes('g29') || item.includes('zf8')) ||
      includesAny(partText, ['b58', 'zf8', 'g29']));
  if (!reasons.length && likelySharedPlatform) {
    score += 22;
    reasons.push('Shared B58 / ZF8 platform');
    badges.push({ label: 'Shared platform', tone: 'warn' });
    matchedRules.push('Shared B58 / ZF8 ecosystem suggests likely cross-platform compatibility.');
  }

  if (context.emissions === 'EU' && includesAny(partText, ['catless', 'race downpipe'])) {
    score -= 14;
    reasons.push('Emissions verification needed');
    badges.push({ label: 'EU emissions check', tone: 'warn' });
    verificationChecks.push('EU emissions setup may require a catted version, local compliance review, or extra calibration planning.');
  }
  if (context.brakePackage === 'BigBrakeKit' && includesAny(partText, ['18x9', '18x9.5'])) {
    score -= 12;
    reasons.push('Wheel / brake clearance check');
    badges.push({ label: 'BBK clearance', tone: 'warn' });
    verificationChecks.push('Wheel spoke and barrel clearance should be checked against the current big brake package.');
  }
  if (context.transmission === 'MT6' && includesAny(partText, ['xhp', 'zf8', 'trans tune'])) {
    score -= 20;
    reasons.push('Transmission-specific check');
    badges.push({ label: '6MT verify', tone: 'warn' });
    verificationChecks.push('This part references ZF8/automatic-specific behavior; manual transmission compatibility needs direct vendor confirmation.');
  }

  const hasExplicitCompat = compat.length > 0;
  const explicitMismatch = hasExplicitCompat && !directPlatformMatch && !supraPlatformMatch && !bmwPlatformMatch && !engineMatch && !likelySharedPlatform && !UNIVERSAL_CATEGORIES.has(normalize(part?.category));
  if (explicitMismatch) {
    score -= 30;
    reasons.push('No direct fitment match found');
    badges.push({ label: 'Manual verification', tone: 'warn' });
    verificationChecks.push('No direct platform or engine rule matched this active vehicle, so confirm fitment manually before purchase.');
  }

  if (context.transmission && !drivetrainMatch && !zfMatch && includesAny(partText, ['clutch', 'manual', 'zf8', 'automatic', 'transmission'])) {
    verificationChecks.push(`Transmission-specific fitment should be checked against the current ${context.transmission} setup.`);
  }

  if (context.emissions && includesAny(partText, ['downpipe', 'catless', 'race', 'opf', 'gpf'])) {
    verificationChecks.push(`Sensor location and emissions equipment should be verified for the ${context.emissions} market car.`);
  }

  const categoryGuidance = CATEGORY_INSTALL_GUIDANCE[normalize(part?.category)] || {};
  installNotes.push(...(categoryGuidance.installNotes || []));
  supportingMods.push(...(categoryGuidance.supportingMods || []));

  if (engineText.includes('b58') && includesAny(partText, ['turbo', 'downpipe', 'fuel', 'injector', 'high-flow'])) {
    supportingMods.push('Healthy spark plugs, fresh coils, and a known-good calibration path are smart before pushing B58 power mods hard.');
  }
  if (includesAny(partText, ['coilover', 'spring', 'sway bar', 'wheel', 'tire'])) {
    supportingMods.push('Plan for an alignment after install so the car behaves predictably with the new setup.');
  }
  if (includesAny(partText, ['track', 'bbk', 'pad', 'rotor'])) {
    supportingMods.push('Brake fluid condition and bed-in procedure should be part of the install plan.');
  }

  score = Math.max(0, Math.min(99, score));

  let label = 'Needs verification';
  if (score >= 82) label = 'Direct fit';
  else if (score >= 60) label = 'Likely fit';

  return {
    label,
    score,
    visible: score >= 35,
    reason: reasons[0] || (label === 'Direct fit' ? 'Matched active vehicle profile' : 'Review trim, sensors, and vendor notes'),
    badges,
    matchedRules: [...new Set(matchedRules)],
    verificationChecks: [...new Set(verificationChecks)],
    installNotes: [...new Set(installNotes)],
    supportingMods: [...new Set(supportingMods)],
  };
}
