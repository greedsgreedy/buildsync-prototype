export const BUILD_GOALS = {
  daily: {
    label: 'Daily street',
    shortLabel: 'Daily',
    note: 'Reliable power, comfort, strong consumables, and low-drama maintenance before bigger mods.',
    parts: [
      'BMS Cold Air Intake',
      'MHD WiFi OBD2 Dongle',
      'MHD Bootmod3 Stage 2 Tune',
      'StopTech Street Brake Pads',
      'Continental ExtremeContact Sport 02 275/35ZR19',
      'Motul 8100 X-cess 5W-40 (5L)',
      'NGK Iridium Spark Plugs (set)',
      'Eibach Pro-Kit Springs',
    ],
    maintenance: [
      'Shorten oil intervals slightly and keep spark plugs ahead of tune demand.',
      'Prioritize brake pads, tires, and alignment before adding more power.',
    ],
    alerts: [
      { part: 'Continental ExtremeContact Sport 02', type: 'drop' },
      { part: 'Motul 8100 X-cess 5W-40', type: 'watch' },
      { part: 'NGK Iridium Spark Plugs', type: 'watch' },
    ],
  },
  touge: {
    label: 'Canyon / touge',
    shortLabel: 'Canyon',
    note: 'Cooling, brake feel, and chassis balance matter more than headline power numbers.',
    parts: [
      'Mishimoto Intercooler Kit',
      'KW V3 Coilovers',
      'Cusco Front Strut Brace',
      'Whiteline Front Sway Bar',
      'Cusco Rear Sway Bar',
      'EBC Yellowstuff Pads',
      'Falken Azenis RT660 275/35R18',
      'Volk TE37 Saga 18x10 +34',
    ],
    maintenance: [
      'Watch tires, pads, and brake fluid closely if the car sees repeated downhill heat cycles.',
      'Re-check alignment after spring or coilover changes to keep turn-in predictable.',
    ],
    alerts: [
      { part: 'KW V3 Coilovers', type: 'drop' },
      { part: 'Falken Azenis RT660', type: 'watch' },
      { part: 'EBC Yellowstuff Pads', type: 'restock' },
    ],
  },
  track: {
    label: 'Track day',
    shortLabel: 'Track',
    note: 'Heat management, braking, and data first. Chasing power without control gets expensive fast.',
    parts: [
      'Mishimoto Intercooler Kit',
      'Brembo GT 6-Piston BBK',
      'KW V3 Coilovers',
      'AIM MXS Strada Dash Logger',
      'Yokohama Advan A052 275/35R18',
      'Bridgestone Potenza RE-71RS 275/35R18',
      'Defi Boost + Oil Temp Gauges',
      'Motul 8100 X-cess 5W-40 (5L)',
      'Sparco Pro 2000 Bucket Seat',
    ],
    maintenance: [
      'Brake fluid, tire heat cycles, and oil condition should be watched much more aggressively.',
      'Plan extra inspections after each event for pads, rotors, wheel torque, and cooling hardware.',
    ],
    alerts: [
      { part: 'Yokohama Advan A052', type: 'restock' },
      { part: 'Brembo GT 6-Piston BBK', type: 'drop' },
      { part: 'Motul 8100 X-cess 5W-40', type: 'watch' },
    ],
  },
  drag: {
    label: 'Drag / roll racing',
    shortLabel: 'Drag',
    note: 'Power adders need supporting fuel, cooling, and transmission health if you want repeatable passes.',
    parts: [
      'Pure Stage 2 Turbo',
      'High-Flow Fuel Injectors (x6)',
      'Walbro 450 Fuel Pump',
      'Mishimoto Intercooler Kit',
      'DP Race 3" Catless Downpipe',
      'Nitto NT555RII Drag Radial 305/35R18',
      'MHD Bootmod3 Stage 2 Tune',
      'Defi Boost + Oil Temp Gauges',
    ],
    maintenance: [
      'Fueling, plugs, and transmission service intervals should be shortened once power jumps significantly.',
      'Keep a close eye on tire condition and drivetrain shock after repeated hard launches or highway pulls.',
    ],
    alerts: [
      { part: 'Pure Stage 2 Turbo', type: 'restock' },
      { part: 'Walbro 450 Fuel Pump', type: 'watch' },
      { part: 'Nitto NT555RII Drag Radial', type: 'drop' },
    ],
  },
  show: {
    label: 'Show build',
    shortLabel: 'Show',
    note: 'Visual impact, finish quality, and presentation details come first.',
    parts: [
      'Seibon Carbon Fibre Hood',
      'Carbon Fibre Front Splitter',
      'Morimoto XB LED Headlights',
      'Volk CE28N 18x9.5',
      'Bride Zeta IV Bucket Seat',
      'GR Supra OEM Floor Mats',
      'Rocket Bunny Widebody Kit',
    ],
    maintenance: [
      'Paint care, trim fitment, and interior upkeep matter just as much as mechanical condition.',
      'Keep a replacement list for exterior parts that are often backordered or limited-run.',
    ],
    alerts: [
      { part: 'Rocket Bunny Widebody Kit', type: 'restock' },
      { part: 'Morimoto XB LED Headlights', type: 'drop' },
      { part: 'Volk CE28N 18x9.5', type: 'watch' },
    ],
  },
  starter: {
    label: 'Budget starter',
    shortLabel: 'Starter',
    note: 'A sensible foundation that improves the car without blowing the whole budget at once.',
    parts: [
      'BMS Cold Air Intake',
      'MHD WiFi OBD2 Dongle',
      'StopTech Street Brake Pads',
      'Falken Azenis RT660 275/35R18',
      'Motul 8100 X-cess 5W-40 (5L)',
      'GR Supra OEM Floor Mats',
      'Cusco Front Strut Brace',
    ],
    maintenance: [
      'Stay disciplined with fluids, brakes, and tires before stacking convenience purchases.',
      'Use alerts to buy common consumables at the right time instead of emergency-buying them later.',
    ],
    alerts: [
      { part: 'BMS Cold Air Intake', type: 'drop' },
      { part: 'StopTech Street Brake Pads', type: 'watch' },
      { part: 'Falken Azenis RT660', type: 'drop' },
    ],
  },
};

export const DEFAULT_BUILD_GOAL = 'daily';

export function getBuildGoal(key) {
  return BUILD_GOALS[key] || BUILD_GOALS[DEFAULT_BUILD_GOAL];
}

export function getGoalAlerts(key) {
  return getBuildGoal(key).alerts || [];
}

export function getGoalMaintenanceNotes(key) {
  return getBuildGoal(key).maintenance || [];
}
