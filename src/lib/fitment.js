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
    };
  }

  let score = UNIVERSAL_CATEGORIES.has(normalize(part?.category)) ? 58 : 35;
  const reasons = [];
  const badges = [];

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
  }
  if (trimText && (compat.some((item) => item.includes(trimText)) || partText.includes(trimText))) {
    score += 14;
    reasons.push('Trim match');
    badges.push({ label: `Trim ${context.trim}`, tone: 'good' });
  }
  if (engineMatch) {
    score += 18;
    reasons.push('Engine match');
    badges.push({ label: engineText.includes('b58') ? 'B58 match' : 'Engine match', tone: 'good' });
  }
  if (drivetrainMatch || zfMatch) {
    score += 8;
    reasons.push('Drivetrain / transmission match');
    badges.push({ label: context.transmission === 'AT8' ? '8AT / ZF8' : context.transmission || 'Transmission match', tone: 'good' });
  }

  const likelySharedPlatform = engineText.includes('b58') &&
    (compat.some((item) => item.includes('b58') || item.includes('g29') || item.includes('zf8')) ||
      includesAny(partText, ['b58', 'zf8', 'g29']));
  if (!reasons.length && likelySharedPlatform) {
    score += 22;
    reasons.push('Shared B58 / ZF8 platform');
    badges.push({ label: 'Shared platform', tone: 'warn' });
  }

  if (context.emissions === 'EU' && includesAny(partText, ['catless', 'race downpipe'])) {
    score -= 14;
    reasons.push('Emissions verification needed');
    badges.push({ label: 'EU emissions check', tone: 'warn' });
  }
  if (context.brakePackage === 'BigBrakeKit' && includesAny(partText, ['18x9', '18x9.5'])) {
    score -= 12;
    reasons.push('Wheel / brake clearance check');
    badges.push({ label: 'BBK clearance', tone: 'warn' });
  }
  if (context.transmission === 'MT6' && includesAny(partText, ['xhp', 'zf8', 'trans tune'])) {
    score -= 20;
    reasons.push('Transmission-specific check');
    badges.push({ label: '6MT verify', tone: 'warn' });
  }

  const hasExplicitCompat = compat.length > 0;
  const explicitMismatch = hasExplicitCompat && !directPlatformMatch && !supraPlatformMatch && !bmwPlatformMatch && !engineMatch && !likelySharedPlatform && !UNIVERSAL_CATEGORIES.has(normalize(part?.category));
  if (explicitMismatch) {
    score -= 30;
    reasons.push('No direct fitment match found');
    badges.push({ label: 'Manual verification', tone: 'warn' });
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
  };
}
