export const BRAND_SCOPE = ['all', 'US Domestic brands', 'JDM', 'Euro', 'Alibaba', 'Temu'];

export const SPECIFIC_BRANDS = [
  'all', 'A90 Shop', 'AWE', 'Active Autowerke', 'Akrapovic', 'ARM', 'BC', 'Bilstein', 'BMS', 'Brembo',
  'Burger', 'CSF', 'Continental', 'Dinan', 'Eibach', 'Enkei', 'Eventuri', 'FTP', 'FCP Euro', 'GReddy',
  'HKS', 'H&R', 'KW', 'MST', 'Milltek', 'Mishimoto', 'MHD', 'Michelin', 'Nitto', 'Pure',
  'SSR', 'Spool', 'StopTech', 'Tein', 'Tomei', 'Turner Motorsport', 'VRSF', 'Valvetronic', 'Volk',
  'Wagner', 'Work', 'XHP', 'Yokohama', 'BMW', 'Toyota', 'Generic',
];

export const PART_FILTERS = [
  'all', 'performance', 'intake', 'chargepipe', 'turbo', 'downpipe', 'midpipe', 'exhaust',
  'intercooler', 'suspension', 'coilovers', 'springs', 'brakes', 'wheels', 'tires',
  'electronics', 'tuning', 'fueling', 'cooling', 'drivetrain', 'maintenance', 'oil',
  'fluids', 'interior', 'exterior', 'aero', 'lighting', 'safety', 'accessories',
];

export const JDM_BRANDS = ['HKS', 'GReddy', 'Tomei', 'Enkei', 'SSR', 'Work', 'Volk', 'Yokohama', 'Nitto', 'Bridgestone', 'Toyota', 'Invidia'];
export const EURO_BRANDS = ['Akrapovic', 'KW', 'Eibach', 'H&R', 'BMW', 'AWE', 'Milltek', 'Brembo', 'Continental', 'Michelin', 'Liqui', 'MST'];

export function titleCase(value) {
  return (value || '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(v => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' ');
}

export function inferBrandScope(part) {
  const brand = (part.brand || '').toLowerCase();
  const vendorNames = (part.vendors || []).map(v => (v.vendor_name || '').toLowerCase());
  if (vendorNames.some(v => v.includes('alibaba'))) return 'Alibaba';
  if (vendorNames.some(v => v.includes('temu'))) return 'Temu';
  if (JDM_BRANDS.some(v => brand.includes(v.toLowerCase()))) return 'JDM';
  if (EURO_BRANDS.some(v => brand.includes(v.toLowerCase()))) return 'Euro';
  return 'US Domestic brands';
}
