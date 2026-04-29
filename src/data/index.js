// src/data/index.js
// Central data store — swap for Supabase calls in production

export const CAT_META = {
  performance: { color: '#0a1628', text: '#85B7EB', label: 'Performance' },
  suspension:  { color: '#0e0e20', text: '#AFA9EC', label: 'Suspension' },
  exterior:    { color: '#0e1f08', text: '#97C459', label: 'Exterior' },
  wheels:      { color: '#0e1f08', text: '#97C459', label: 'Wheels' },
  tires:       { color: '#061a1a', text: '#8DE3DE', label: 'Tires' },
  brakes:      { color: '#1a0808', text: '#F09595', label: 'Brakes' },
  electronics: { color: '#0a1628', text: '#85B7EB', label: 'Electronics' },
  lights:      { color: '#1a1000', text: '#FAC775', label: 'Lights' },
  oil:         { color: '#1a0808', text: '#F09595', label: 'Oil & fluids' },
  accessories: { color: '#1e1e22', text: '#888',    label: 'Accessories' },
  safety:      { color: '#1a0a14', text: '#ED93B1', label: 'Safety' },
  intercooler: { color: '#081a12', text: '#9FE1CB', label: 'Intercooler' },
  downpipe:    { color: '#1a0e06', text: '#F5C4B3', label: 'Downpipe' },
  exhaust:     { color: '#1a1000', text: '#FAC775', label: 'Exhaust' },
  fueling:     { color: '#1a0a14', text: '#ED93B1', label: 'Fueling' },
};

export const POPULAR_BRANDS = [
  'Toyota',
  'Volkswagen',
  'Ford',
  'BYD',
  'Hyundai',
  'Honda',
  'Suzuki',
  'Nissan',
  'Kia',
  'Chevrolet',
  'BMW',
  'Geely',
  'Mercedes-Benz',
  'Renault',
  'Audi',
  'Lexus',
  'Mazda',
  'Tesla',
  'Porsche',
  'Subaru',
  'Dodge',
  'Jeep',
  'GMC',
  'Cadillac',
  'Acura',
  'Infiniti',
  'Mitsubishi',
  'Volvo',
  'Mini',
  'Genesis',
  'Ram',
  'Rivian',
  'Lucid',
  'Land Rover',
];

export const VEHICLE_TYPES = ['Coupe', 'Sedan', 'Hatchback', 'Wagon', 'Convertible', 'Truck', 'SUV', 'Crossover', 'EV', 'Hybrid', 'Van'];

export const MANUFACTURER_MODELS = {
  Toyota: ['Supra', 'GR86', 'Corolla', 'Camry', 'Prius', 'RAV4', 'RAV4 Prime', 'Tacoma', 'Tundra', '4Runner', 'Land Cruiser', 'Sequoia', 'bZ4X'],
  Volkswagen: ['Golf GTI', 'Golf R', 'Jetta GLI', 'Arteon', 'Tiguan', 'Atlas', 'Taos', 'ID.4', 'ID. Buzz'],
  Ford: ['Mustang', 'F-150', 'F-150 Lightning', 'Bronco', 'Bronco Sport', 'Ranger', 'Maverick', 'Explorer', 'Expedition', 'Mustang Mach-E'],
  BYD: ['Seal', 'Atto 3', 'Dolphin', 'Han', 'Tang', 'Song Plus'],
  Hyundai: ['Elantra N', 'Veloster N', 'Ioniq 5', 'Ioniq 6', 'Kona Electric', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade'],
  Honda: ['Civic', 'Civic Type R', 'Accord', 'Integra', 'CR-V', 'Passport', 'Pilot', 'Ridgeline', 'Prologue', 'S2000'],
  Suzuki: ['Swift Sport', 'Jimny', 'Vitara', 'Baleno', 'S-Cross'],
  Nissan: ['GT-R', 'Z', '370Z', '350Z', 'Sentra', 'Altima', 'Rogue', 'Pathfinder', 'Armada', 'Frontier', 'Ariya'],
  Kia: ['Stinger', 'K5', 'EV6', 'EV9', 'Telluride', 'Sportage', 'Sorento', 'Forte', 'Niro EV'],
  Chevrolet: ['Corvette', 'Camaro', 'Silverado', 'Silverado EV', 'Colorado', 'Tahoe', 'Suburban', 'Blazer EV', 'Equinox EV'],
  BMW: ['M2', 'M3', 'M4', 'M5', 'M8', '340i', '440i', 'i4', 'i5', 'iX', 'Supra', 'X3 M', 'X5 M'],
  Geely: ['Coolray', 'Monjaro', 'Preface', 'Geometry C', 'Okavango'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'AMG GT', 'C63 AMG', 'E63 AMG', 'A-Class', 'G-Class', 'GLC', 'GLE', 'EQS SUV'],
  Renault: ['Clio', 'Megane RS', 'Captur', 'Arkana', 'Austral', 'Twingo'],
  Audi: ['A3', 'S3', 'RS3', 'A4', 'S4', 'RS5', 'RS6 Avant', 'R8', 'TT RS', 'Q5', 'Q7', 'Q8 e-tron'],
  Lexus: ['IS 500', 'IS 350', 'RC F', 'LC 500', 'GS F', 'NX', 'RX', 'GX', 'LX', 'RZ'],
  Mazda: ['MX-5 Miata', 'Mazda3', 'Mazda6', 'CX-30', 'CX-5', 'CX-50', 'CX-90', 'RX-7', 'RX-8'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  Porsche: ['911', '718 Cayman', '718 Boxster', 'Taycan', 'Panamera', 'Macan', 'Cayenne'],
  Subaru: ['WRX', 'STI', 'BRZ', 'Impreza', 'Legacy', 'Forester', 'Outback', 'Crosstrek'],
  Dodge: ['Charger', 'Challenger', 'Durango', 'Viper', 'Hornet'],
  Jeep: ['Wrangler', 'Gladiator', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade'],
  GMC: ['Sierra', 'Canyon', 'Yukon', 'Terrain', 'Hummer EV'],
  Cadillac: ['CT4-V Blackwing', 'CT5-V Blackwing', 'Escalade', 'Lyriq', 'ATS-V', 'CTS-V'],
  Acura: ['Integra', 'Integra Type S', 'TLX Type S', 'NSX', 'RSX', 'MDX', 'RDX'],
  Infiniti: ['Q50', 'Q60', 'G35', 'G37', 'QX60', 'QX80'],
  Mitsubishi: ['Lancer Evolution', 'Eclipse', '3000GT', 'Outlander', 'Eclipse Cross'],
  Volvo: ['S60', 'S90', 'V60', 'XC40', 'XC60', 'XC90', 'EX30'],
  Mini: ['Cooper S', 'John Cooper Works', 'Clubman', 'Countryman'],
  Genesis: ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
  Ram: ['1500', '1500 TRX', '2500', '3500', 'ProMaster'],
  Rivian: ['R1T', 'R1S', 'R2'],
  Lucid: ['Air', 'Gravity'],
  'Land Rover': ['Defender', 'Range Rover', 'Range Rover Sport', 'Discovery', 'Discovery Sport'],
};

export const LOCAL_SHOPS = [
  { id:1, name:'Apex Euro Performance', type:'Performance shop', specs:['Euro','BMW','Mercedes-Benz','Audi'], services:['Tuning','Diagnostics','Suspension','Maintenance'], city:'Los Angeles, CA', country:'United States', phone:'+1 (213) 555-0148', email:'service@apexeuroperformance.example', rating:4.8, price:'$$$', note:'Good fit for B58, S58, AMG, and VAG performance work.' },
  { id:2, name:'JDM Craft Garage', type:'Specialty mechanic', specs:['JDM','Toyota','Honda','Nissan','Subaru'], services:['Engine work','Turbo installs','Track prep','Maintenance'], city:'Torrance, CA', country:'United States', phone:'+1 (310) 555-0192', email:'hello@jdmcraftgarage.example', rating:4.7, price:'$$', note:'Supras, Type R, Z, WRX/STI, and canyon/track setups.' },
  { id:3, name:'Precision Tint & PPF', type:'Tint / PPF', specs:['All vehicles','EV','Luxury'], services:['Tint','PPF','Ceramic coating','Detailing'], city:'Pasadena, CA', country:'United States', phone:'+1 (626) 555-0127', email:'bookings@precisiontintppf.example', rating:4.9, price:'$$', note:'Window tint, paint protection film, ceramic, and interior protection.' },
  { id:4, name:'Torque Truck & Offroad', type:'Truck / SUV shop', specs:['Truck','SUV','Domestic','Toyota','Jeep'], services:['Lift kits','Wheels/tires','Lighting','Overlanding'], city:'Anaheim, CA', country:'United States', phone:'+1 (714) 555-0188', email:'sales@torquetruckoffroad.example', rating:4.6, price:'$$', note:'Tacoma, Tundra, F-150, Bronco, Wrangler, and 4Runner builds.' },
  { id:5, name:'EV Service Lab', type:'EV specialist', specs:['EV','Tesla','Rivian','Lucid','Hyundai','Kia'], services:['EV diagnostics','Suspension','Brakes','Tires','Accessories'], city:'Irvine, CA', country:'United States', phone:'+1 (949) 555-0106', email:'support@evservicelab.example', rating:4.7, price:'$$$', note:'EV-friendly shop for suspension, brake, tire, and accessory installs.' },
  { id:6, name:'Wheel Fitment Studio', type:'Wheels / tires', specs:['All vehicles','JDM','Euro','Truck','SUV'], services:['Tires','Mount/balance','Alignment','Fitment'], city:'Glendale, CA', country:'United States', phone:'+1 (818) 555-0161', email:'fitment@wheelfitmentstudio.example', rating:4.8, price:'$$', note:'Fitment checks, performance tires, alignments, and track/autocross setups.' },
  { id:7, name:'Street Legal Smog & Repair', type:'General mechanic', specs:['All vehicles','Domestic','JDM','Euro'], services:['Maintenance','Smog','Brakes','Diagnostics'], city:'Long Beach, CA', country:'United States', phone:'+1 (562) 555-0134', email:'frontdesk@streetlegalrepair.example', rating:4.5, price:'$', note:'Everyday maintenance and compliance work before/after modifications.' },
  { id:8, name:'Carbon & Aero Works', type:'Body / aero shop', specs:['JDM','Euro','Show','Track'], services:['Aero install','Carbon parts','Body kits','Paint match'], city:'Ontario, CA', country:'United States', phone:'+1 (909) 555-0175', email:'projects@carbonaeroworks.example', rating:4.6, price:'$$$', note:'Front lips, diffusers, wings, hoods, widebody, and fitment corrections.' },
  { id:9, name:'Tokyo Circuit Works', type:'JDM performance shop', specs:['JDM','Toyota','Honda','Nissan','Subaru'], services:['Tuning','Suspension','Diagnostics','Track prep'], city:'Yokohama', country:'Japan', phone:'+81 45-555-0138', email:'contact@tokyocircuitworks.example', rating:4.9, price:'$$$', note:'Sports car focused shop for Supra, GT-R, Civic Type R, BRZ, and track-day prep.' },
  { id:10, name:'Nordbahn Sporttechnik', type:'Euro performance shop', specs:['Euro','BMW','Porsche','Audi','Mercedes-Benz'], services:['Tuning','Diagnostics','Suspension','Brakes'], city:'Munich', country:'Germany', phone:'+49 89 5550 214', email:'service@nordbahnsporttechnik.example', rating:4.8, price:'$$$', note:'Strong for BMW M cars, Porsche GT cars, and German performance alignment/setup work.' },
  { id:11, name:'Apex Lane Garage', type:'Sports car specialist', specs:['JDM','Euro','Toyota','BMW','Mazda'], services:['Maintenance','Tires','Alignment','Track prep'], city:'Birmingham', country:'United Kingdom', phone:'+44 121 555 0184', email:'hello@apexlanegarage.example', rating:4.7, price:'$$', note:'Track-friendly service shop with a focus on Supra, GT86/GR86, MX-5, and BMW coupe platforms.' },
  { id:12, name:'Harbour Performance Lab', type:'Performance workshop', specs:['JDM','Euro','Porsche','Nissan','Hyundai'], services:['Tuning','Brakes','Suspension','Detailing'], city:'Sydney', country:'Australia', phone:'+61 2 5550 0177', email:'book@harbourperformancelab.example', rating:4.8, price:'$$$', note:'Street and circuit-focused workshop for sports cars and high-performance daily builds.' },
];

export const LOCAL_DRIVE_EVENTS = [
  { id:1, name:'Willow Springs International Raceway', kind:'Track', city:'Rosamond, CA', distance:'80 mi', date:'Date varies by organizer', tags:['Road course','HPDE','Track day'], vehicleTypes:['Coupe','Sedan','EV'], schedule:'Open track and club calendars', cost:'$$$', website:'https://www.willowspringsraceway.com/', note:'Classic high-speed road course. Best for HPDE, time attack, and club events.' },
  { id:2, name:'Buttonwillow Raceway Park', kind:'Track', city:'Buttonwillow, CA', distance:'145 mi', date:'Most weekends', tags:['Road course','HPDE','Time attack'], vehicleTypes:['Coupe','Sedan','EV'], schedule:'Weekend events', cost:'$$$', website:'https://buttonwillowraceway.com/', note:'Popular SoCal track with frequent HPDE and time attack days.' },
  { id:3, name:'Auto Club Speedway Infield Events', kind:'Autocross', city:'Fontana, CA', distance:'45 mi', date:'Monthly / organizer calendar', tags:['Autocross','Beginner friendly','SCCA'], vehicleTypes:['All vehicles'], schedule:'Monthly club events', cost:'$', website:'https://www.speedventures.com/Events/trackinfo.aspx?id=6', note:'Low-risk place to learn car control and test setup changes legally. Verify current availability because the Fontana facility has changed over time.' },
  { id:4, name:'Irwindale Speedway Drift Nights', kind:'Drift', city:'Irwindale, CA', distance:'25 mi', date:'Posted event nights', tags:['Drift','Spectator','Practice'], vehicleTypes:['Coupe','Sedan'], schedule:'Evenings / posted calendar', cost:'$$', website:'https://irwindalespeedway.com/track-info/', note:'Legal drift practice and spectator events. Check tech requirements before going.' },
  { id:5, name:'Angeles Crest Highway', kind:'Canyon / touge-style drive', city:'La Canada Flintridge, CA', distance:'22 mi', date:'Year-round / best in clear weather', tags:['Scenic road','Canyon','Legal cruise'], vehicleTypes:['Coupe','Sedan','Motorcycle'], schedule:'Best early morning daylight', cost:'Free', website:'https://www.angelescrestscenichighway.com/', note:'Scenic mountain route. Keep it legal, watch cyclists, weather, debris, and enforcement.' },
  { id:6, name:'Glendora Mountain Road', kind:'Canyon / touge-style drive', city:'Glendora, CA', distance:'28 mi', date:'Year-round / daylight recommended', tags:['Scenic road','Canyon','Legal cruise'], vehicleTypes:['Coupe','Sedan'], schedule:'Daylight only recommended', cost:'Free', website:'https://www.fs.usda.gov/angeles', note:'Technical canyon road. Drive within limits and avoid unsafe or illegal racing behavior.' },
  { id:7, name:'Cars & Coffee San Clemente', kind:'Car meet', city:'San Clemente, CA', distance:'60 mi', date:'Saturdays', tags:['Cars & coffee','Community','Morning meet'], vehicleTypes:['All vehicles'], schedule:'Saturday mornings', cost:'Free', website:'https://www.southoccarsandcoffee.com/', note:'Large casual community meet with varied builds. Respect venue rules and no reckless exits.' },
  { id:8, name:'South OC Cars and Coffee', kind:'Car meet', city:'San Juan Capistrano, CA', distance:'58 mi', date:'Weekend mornings', tags:['Cars & coffee','Exotics','JDM','Euro'], vehicleTypes:['All vehicles'], schedule:'Weekend mornings', cost:'Free', website:'https://www.southoccarsandcoffee.com/', note:'Good place to find builds, vendors, and local shop recommendations.' },
  { id:9, name:'EV Owners Cruise Night', kind:'Car meet', city:'Irvine, CA', distance:'42 mi', date:'Monthly', tags:['EV','Cruise','Community'], vehicleTypes:['EV'], schedule:'Monthly', cost:'Free', website:'https://www.plugshare.com/', note:'EV-focused meetup for Tesla, Rivian, Lucid, Hyundai/Kia EV, and conversion builds.' },
  { id:10, name:'Truck & Overland Trail Meetup', kind:'Meet / trail', city:'Corona, CA', distance:'50 mi', date:'Monthly', tags:['Truck','SUV','Overland','Trail'], vehicleTypes:['Truck','SUV'], schedule:'Monthly', cost:'Free', website:'https://www.fs.usda.gov/cleveland', note:'Truck/SUV meetups and beginner-friendly trail planning. Verify trail legality and permits.' },
];

export const PRO_RACING_EVENTS = [
  { id:101, name:'24 Hours of Le Mans', series:'FIA WEC', city:'Le Mans, France', region:'Global', date:'June 10-14, 2026', startDate:'2026-06-10', endDate:'2026-06-14', tags:['Endurance','WEC','GT3'], schedule:'Annual endurance race weekend', cost:'$$$', website:'https://www.24h-lemans.com/', note:'Flagship endurance event with prototypes and GT racing. Great for fans following sports car racing at the highest level.' },
  { id:102, name:'Rolex 24 at Daytona', series:'IMSA', city:'Daytona Beach, FL', region:'North America', date:'January 21-25, 2026', startDate:'2026-01-21', endDate:'2026-01-25', tags:['Endurance','IMSA','GT3'], schedule:'Annual season-opening endurance weekend', cost:'$$$', website:'https://www.daytonainternationalspeedway.com/events/rolex-24/', note:'Major IMSA endurance event and one of the biggest sports car weekends in North America.' },
  { id:103, name:'Formula 1 United States Grand Prix', series:'Formula 1', city:'Austin, TX', region:'North America', date:'October 23-25, 2026', startDate:'2026-10-23', endDate:'2026-10-25', tags:['F1','Open wheel','Weekend event'], schedule:'Grand Prix race weekend', cost:'$$$$', website:'https://www.formula1.com/en/racing/2026/United_States.html', note:'Premier open-wheel race weekend with practice, qualifying, support races, and fan zone activity.' },
  { id:104, name:'GT World Challenge America', series:'SRO GT', city:'North America', region:'Touring series', date:'March 27 - October 11, 2026', startDate:'2026-03-27', endDate:'2026-10-11', tags:['GT3','Sprint','Weekend event'], schedule:'Multi-round GT sprint/endurance series', cost:'$$$', website:'https://www.gt-world-challenge-america.com/', note:'Professional GT racing with strong manufacturer presence and useful crossover for track-day fans.' },
  { id:105, name:'IMSA WeatherTech SportsCar Championship', series:'IMSA', city:'United States', region:'Touring series', date:'January 21 - October 3, 2026', startDate:'2026-01-21', endDate:'2026-10-03', tags:['IMSA','Endurance','GT3'], schedule:'Season-long pro sports car series', cost:'$$$', website:'https://www.imsa.com/weathertech/', note:'Useful umbrella event listing for Daytona, Sebring, Road Atlanta, Laguna Seca, and more.' },
];

export const CROSS_PLATFORM_PARTS = [
  { id:1, name:'B58 TU High-Flow Downpipe', brand:'VRSF', category:'Downpipe', platform:'B58', sharedWith:['Toyota Supra A90/A91','BMW Z4 M40i G29','BMW M340i G20','BMW 340i F30','BMW 440i F32'], note:'Check flange, OPF/GPF, and year-specific sensor locations before ordering.', vendors:[{n:'VRSF',p:389},{n:'ECS Tuning',p:429},{n:'Alibaba',p:145}] },
  { id:2, name:'B58 Charge Pipe Upgrade', brand:'Burger', category:'Intake / charge air', platform:'B58', sharedWith:['Toyota Supra A90/A91','BMW M240i F22','BMW 340i F30','BMW 440i F32','BMW X3 M40i G01'], note:'Fitment varies by chassis routing, but engine-side B58 parts often overlap.', vendors:[{n:'BMS Direct',p:189},{n:'Turner Motorsport',p:209},{n:'Alibaba',p:58}] },
  { id:3, name:'MHD Universal WiFi Adapter', brand:'MHD', category:'Tuning', platform:'B58 / BMW DME', sharedWith:['Toyota Supra A90/A91','BMW M340i G20','BMW 340i F30','BMW Z4 M40i G29','BMW X3 M40i G01'], note:'Software license and DME support matter more than physical fitment.', vendors:[{n:'MHD Store',p:129},{n:'Amazon',p:139}] },
  { id:4, name:'Bootmod3 B58 License', brand:'ProTuning Freaks', category:'Tuning', platform:'B58 / BMW DME', sharedWith:['Toyota Supra A90/A91','BMW M340i G20','BMW M240i F22','BMW 540i G30','BMW Z4 M40i G29'], note:'Confirm ECU unlock status, build date, and supported ROM before buying.', vendors:[{n:'bootmod3',p:595},{n:'Authorized tuner',p:595}] },
  { id:5, name:'Pure Stage 2 B58 Turbo', brand:'Pure', category:'Turbo', platform:'B58', sharedWith:['Toyota Supra A90/A91','BMW M340i G20','BMW 340i F30','BMW 440i F32','BMW Z4 M40i G29'], note:'Turbo family overlaps, but install hardware and calibration differ by chassis.', vendors:[{n:'Pure Turbos',p:3200},{n:'Vivid Racing',p:3349}] },
  { id:6, name:'Dorch Stage 2 HPFP', brand:'Dorch', category:'Fueling', platform:'B58', sharedWith:['Toyota Supra A90/A91','BMW M340i G20','BMW 340i F30','BMW 440i F32','BMW X3 M40i G01'], note:'Common B58 fueling upgrade. Verify engine generation and ethanol goals.', vendors:[{n:'Dorch Engineering',p:1199},{n:'ECS Tuning',p:1249}] },
  { id:7, name:'NGK B58 Colder Spark Plugs', brand:'NGK', category:'Ignition', platform:'B58', sharedWith:['Toyota Supra A90/A91','BMW M240i','BMW 340i','BMW 440i','BMW 540i','BMW Z4 M40i'], note:'Often shared across B58 tuning setups; gap depends on boost and fuel.', vendors:[{n:'Amazon',p:88},{n:'FCP Euro',p:96},{n:'ECS Tuning',p:99}] },
  { id:8, name:'ZF 8HP Transmission Service Kit', brand:'ZF', category:'Drivetrain', platform:'ZF 8HP', sharedWith:['Toyota Supra A90/A91','BMW 340i F30','BMW M340i G20','BMW 540i G30','BMW X3 M40i G01'], note:'ZF 8HP family parts overlap, but pan/filter and fluid quantity can differ.', vendors:[{n:'FCP Euro',p:329},{n:'ECS Tuning',p:349}] },
  { id:9, name:'B58 Oil Filter Service Kit', brand:'Mann', category:'Maintenance', platform:'B58', sharedWith:['Toyota Supra A90/A91','BMW M240i','BMW 340i','BMW 440i','BMW 540i','BMW Z4 M40i'], note:'Great example of BMW service parts that also apply to the Supra B58.', vendors:[{n:'FCP Euro',p:18},{n:'Amazon',p:22},{n:'Toyota Parts',p:28}] },
  { id:10, name:'CSF B58 Heat Exchanger / Cooling Upgrade', brand:'CSF', category:'Cooling', platform:'B58', sharedWith:['Toyota Supra A90/A91','BMW M340i G20','BMW Z4 M40i G29','BMW X3 M40i G01'], note:'Cooling system packaging is chassis-specific; confirm exact application.', vendors:[{n:'CSF',p:820},{n:'Vivid Racing',p:849}] },
  { id:11, name:'Toyota/Lexus 2GR-FKS Intake Filter Kit', brand:'AEM', category:'Intake / maintenance', platform:'Toyota/Lexus 2GR', sharedWith:['Toyota Camry V6','Toyota Tacoma V6','Toyota Highlander V6','Lexus IS 350','Lexus RX 350','Lexus GS 350'], note:'2GR family parts often overlap, but airbox shape and sensor placement vary by chassis.', vendors:[{n:'AEM',p:68},{n:'RockAuto',p:54},{n:'Amazon',p:62}] },
  { id:12, name:'Toyota/Lexus 2GR Spark Plug Set', brand:'Denso', category:'Ignition', platform:'Toyota/Lexus 2GR', sharedWith:['Lexus IS 350','Lexus GS 350','Lexus RX 350','Toyota Camry V6','Toyota Avalon V6','Toyota Highlander V6'], note:'Good shared service item across many Toyota/Lexus V6 models. Verify engine code and heat range.', vendors:[{n:'Toyota Parts',p:96},{n:'Lexus Parts',p:112},{n:'RockAuto',p:84}] },
  { id:13, name:'Nissan/Infiniti VQ35/VQ37 Coil Pack Set', brand:'Hitachi', category:'Ignition', platform:'Nissan/Infiniti VQ', sharedWith:['Nissan 350Z','Nissan 370Z','Infiniti G35','Infiniti G37','Infiniti Q50','Infiniti Q60'], note:'VQ service parts commonly cross-shop between Nissan and Infiniti, but connector/year changes matter.', vendors:[{n:'Z1 Motorsports',p:349},{n:'Concept Z',p:369},{n:'RockAuto',p:310}] },
  { id:14, name:'Nissan/Infiniti VQ Cat-Back Exhaust Platform Search', brand:'ISR / Tomei / Motordyne', category:'Exhaust', platform:'Nissan/Infiniti VQ', sharedWith:['Nissan 350Z','Nissan 370Z','Infiniti G35 Coupe','Infiniti G37 Coupe','Infiniti Q60'], note:'Engines overlap, but exhausts are highly chassis and wheelbase specific. Use this as a cross-search family, not a guaranteed fit.', vendors:[{n:'Z1 Motorsports',p:899},{n:'Concept Z',p:950},{n:'Alibaba',p:320}] },
  { id:15, name:'Honda/Acura K-Series Coilovers Search', brand:'Tein / BC Racing', category:'Suspension', platform:'Honda/Acura K-Series', sharedWith:['Honda Civic Si','Acura RSX','Acura TSX','Acura Integra','Honda Accord'], note:'Engine family overlaps, but suspension fitment is chassis-specific. Useful for cross-shopping brands and part families.', vendors:[{n:'Evasive Motorsports',p:899},{n:'Kseries Parts',p:930},{n:'Amazon',p:960}] },
  { id:16, name:'Honda/Acura K20/K24 RBC/RRC Intake Manifold Search', brand:'Honda OEM / Skunk2', category:'Intake / engine', platform:'Honda/Acura K-Series', sharedWith:['Honda Civic Si','Acura RSX Type-S','Acura TSX','Honda Accord K24','Acura Integra'], note:'K-series manifold swaps are common, but throttle body, adapter, hood clearance, and ECU tuning vary.', vendors:[{n:'Kseries Parts',p:320},{n:'Hybrid Racing',p:349},{n:'eBay',p:220}] },
  { id:17, name:'Subaru/Toyota FA24 Oil Filter + Plug Kit', brand:'Subaru OEM', category:'Maintenance', platform:'Subaru/Toyota FA24', sharedWith:['Toyota GR86','Subaru BRZ','Subaru WRX FA24','Subaru Ascent'], note:'FA-family maintenance parts often overlap between Toyota/Subaru twins. Confirm turbo vs NA differences.', vendors:[{n:'Subaru Parts',p:24},{n:'Toyota Parts',p:28},{n:'Amazon',p:22}] },
  { id:18, name:'Toyota GR86 / Subaru BRZ Header Search', brand:'HKS / Tomei / JDL', category:'Exhaust', platform:'Subaru/Toyota FA24', sharedWith:['Toyota GR86','Subaru BRZ'], note:'The twins share a platform, but year/generation and emissions compliance still matter.', vendors:[{n:'FTspeed',p:890},{n:'CounterSpace Garage',p:940},{n:'JDL',p:999}] },
  { id:19, name:'VW/Audi EA888 Turbo Inlet Pipe', brand:'034Motorsport', category:'Intake / turbo', platform:'VW/Audi EA888', sharedWith:['VW GTI','VW Golf R','Audi A3','Audi S3','Audi TT','Audi Q3'], note:'EA888 parts often cross-shop across VW/Audi MQB cars. Check generation, turbo, and PCV routing.', vendors:[{n:'034Motorsport',p:150},{n:'ECS Tuning',p:165},{n:'FCP Euro',p:158}] },
  { id:20, name:'Hyundai/Kia/Genesis 2.0T Spark Plug Set', brand:'NGK', category:'Ignition', platform:'Hyundai/Kia/Genesis Theta', sharedWith:['Hyundai Veloster N','Hyundai Elantra N','Kia Stinger 2.0T','Genesis G70 2.0T','Hyundai Sonata N Line'], note:'Hyundai/Kia/Genesis share many service families, but tune level and heat range matter.', vendors:[{n:'SXTH Element',p:88},{n:'N75 Motorsports',p:92},{n:'Amazon',p:78}] },
  { id:21, name:'5x114.3 Performance Wheel Fitment Search', brand:'Enkei / Volk / Work', category:'Wheels', platform:'Cross-brand 5x114.3', sharedWith:['Toyota Supra A90/A91','Nissan Z','Honda Civic Type R','Acura Integra Type S','Subaru WRX STI','Lexus IS'], note:'Bolt pattern alone is not enough. Verify center bore, offset, brake clearance, load rating, and tire size.', vendors:[{n:'Tire Rack',p:320},{n:'Vivid Racing',p:480},{n:'Fitment Industries',p:360}] },
  { id:22, name:'Universal Bucket Seat + Side Mount Search', brand:'Bride / Recaro / Sparco', category:'Interior / safety', platform:'Universal / bracket-specific', sharedWith:['Toyota Supra','Nissan Z','Honda Civic','Subaru BRZ','BMW M3','Mazda MX-5'], note:'Seats may be universal, but rails, occupancy sensors, airbags, and legality are vehicle-specific.', vendors:[{n:'Evasive Motorsports',p:899},{n:'Vivid Racing',p:950},{n:'Sparco',p:899}] },
  { id:23, name:'OBD2 Data Logger / Gauge Display', brand:'AIM / Banks / P3', category:'Electronics', platform:'Universal OBD2', sharedWith:['Most OBD2 vehicles','Toyota','BMW','Honda','Nissan','Ford','Tesla limited support'], note:'OBD2 works broadly, but available channels differ by ECU and protocol.', vendors:[{n:'AIM Sports',p:449},{n:'P3 Cars',p:389},{n:'Banks Power',p:295}] },
  { id:24, name:'DOT 4 Racing Brake Fluid', brand:'Motul / Castrol / Endless', category:'Fluids', platform:'Universal consumable', sharedWith:['Track cars','Daily drivers','Euro','JDM','Domestic','Truck/SUV'], note:'Cross-brand consumable. Match DOT spec and service interval; do not mix incompatible fluids.', vendors:[{n:'Amazon',p:24},{n:'FCP Euro',p:28},{n:'Tire Rack',p:26}] },
];

export const PARTS = [
  { id:1,  name:'BMS Cold Air Intake',         brand:'Burger',    cat:'performance', pri:'must', vendors:[{n:'BMS Direct',p:269,s:0,t:'us'},{n:'ECS Tuning',p:289,s:0,t:'us'},{n:'Alibaba',p:88,s:34,t:'alibaba'},{n:'Temu',p:74,s:18,t:'temu'}] },
  { id:2,  name:'BMS Chargepipe',               brand:'Burger',    cat:'performance', pri:'want', vendors:[{n:'BMS Direct',p:189,s:0,t:'us'},{n:'Alibaba',p:58,s:28,t:'alibaba'}] },
  { id:3,  name:'BMS JB4 Piggyback',            brand:'Burger',    cat:'electronics', pri:'want', vendors:[{n:'BMS Direct',p:549,s:0,t:'us'},{n:'Amazon',p:575,s:0,t:'us'}] },
  { id:4,  name:'Pure Stage 2 Turbo',           brand:'Pure',      cat:'performance', pri:'want', vendors:[{n:'Pure Turbos',p:3200,s:0,t:'us'},{n:'Vivid Racing',p:3349,s:0,t:'us'}] },
  { id:5,  name:'Akrapovic Titanium Cat-Back',  brand:'Akrapovic', cat:'exhaust',     pri:'want', vendors:[{n:'Vivid Racing',p:2100,s:0,t:'us'},{n:'ECS Tuning',p:2149,s:0,t:'us'},{n:'Alibaba',p:620,s:95,t:'alibaba'}] },
  { id:6,  name:'Milltek Non-Resonated Cat-Back',brand:'Milltek',  cat:'exhaust',     pri:'want', vendors:[{n:'Milltek',p:1850,s:0,t:'us'},{n:'ECS Tuning',p:1920,s:0,t:'us'}] },
  { id:7,  name:'AWE Touring Exhaust',          brand:'AWE',       cat:'exhaust',     pri:'want', vendors:[{n:'AWE Tuning',p:1650,s:0,t:'us'},{n:'Amazon',p:1720,s:0,t:'us'}] },
  { id:8,  name:'Invidia Q300 Cat-Back',        brand:'Invidia',   cat:'exhaust',     pri:'nice', vendors:[{n:'Invidia',p:980,s:0,t:'us'},{n:'Alibaba',p:280,s:75,t:'alibaba'}] },
  { id:9,  name:'DP Race 3" Catless Downpipe',  brand:'Generic',   cat:'downpipe',    pri:'must', vendors:[{n:'FunctionFirst',p:680,s:0,t:'us'},{n:'Alibaba',p:145,s:55,t:'alibaba'},{n:'Temu',p:119,s:22,t:'temu'}] },
  { id:10, name:'Agency Power Downpipe',        brand:'Agency Power',cat:'downpipe',  pri:'want', vendors:[{n:'Agency Power',p:750,s:0,t:'us'},{n:'Alibaba',p:190,s:55,t:'alibaba'}] },
  { id:11, name:'Mishimoto Intercooler Kit',    brand:'Mishimoto', cat:'intercooler', pri:'must', vendors:[{n:'Mishimoto',p:749,s:0,t:'us'},{n:'Amazon',p:779,s:0,t:'us'},{n:'Alibaba',p:210,s:65,t:'alibaba'},{n:'Temu',p:189,s:28,t:'temu'}] },
  { id:12, name:'Wagner Evo Intercooler',       brand:'Wagner',    cat:'intercooler', pri:'want', vendors:[{n:'Wagner',p:890,s:0,t:'us'},{n:'ECS Tuning',p:920,s:0,t:'us'}] },
  { id:13, name:'CSF High-Perf Intercooler',    brand:'CSF',       cat:'intercooler', pri:'want', vendors:[{n:'CSF',p:820,s:0,t:'us'},{n:'Vivid Racing',p:849,s:0,t:'us'}] },
  { id:14, name:'MHD Bootmod3 Stage 2 Tune',    brand:'MHD',       cat:'electronics', pri:'must', vendors:[{n:'MHD App',p:399,s:0,t:'us'}] },
  { id:15, name:'MHD WiFi OBD2 Dongle',         brand:'MHD',       cat:'electronics', pri:'must', vendors:[{n:'MHD Store',p:129,s:0,t:'us'},{n:'Amazon',p:139,s:0,t:'us'}] },
  { id:16, name:'Defi Boost + Oil Temp Gauges', brand:'Defi',      cat:'electronics', pri:'nice', vendors:[{n:'Defi USA',p:480,s:12,t:'us'},{n:'Alibaba',p:135,s:32,t:'alibaba'},{n:'Temu',p:98,s:15,t:'temu'}] },
  { id:17, name:'AIM MXS Strada Dash Logger',   brand:'AIM',       cat:'electronics', pri:'nice', vendors:[{n:'AIM Sports',p:1290,s:0,t:'us'}] },
  { id:18, name:'KW V3 Coilovers',              brand:'KW',        cat:'suspension',  pri:'want', vendors:[{n:'KW Direct',p:1999,s:0,t:'us'},{n:'Turner Mtrsp.',p:2100,s:0,t:'us'},{n:'Alibaba',p:480,s:85,t:'alibaba'}] },
  { id:19, name:'BC Racing BR Coilovers',       brand:'BC',        cat:'suspension',  pri:'want', vendors:[{n:'BC Racing',p:899,s:0,t:'us'},{n:'Amazon',p:929,s:0,t:'us'},{n:'Alibaba',p:290,s:75,t:'alibaba'}] },
  { id:20, name:'Tein Flex Z Coilovers',        brand:'Tein',      cat:'suspension',  pri:'want', vendors:[{n:'Tein',p:780,s:0,t:'us'},{n:'Amazon',p:810,s:0,t:'us'}] },
  { id:21, name:'Eibach Pro-Kit Springs',       brand:'Eibach',    cat:'suspension',  pri:'nice', vendors:[{n:'Eibach',p:280,s:0,t:'us'},{n:'Amazon',p:295,s:0,t:'us'},{n:'Alibaba',p:85,s:28,t:'alibaba'}] },
  { id:22, name:'H&R Sport Springs',            brand:'H&R',       cat:'suspension',  pri:'nice', vendors:[{n:'H&R',p:260,s:0,t:'us'},{n:'ECS Tuning',p:275,s:0,t:'us'}] },
  { id:23, name:'Cusco Front Strut Brace',      brand:'Cusco',     cat:'suspension',  pri:'nice', vendors:[{n:'Cusco USA',p:340,s:0,t:'us'},{n:'Alibaba',p:95,s:38,t:'alibaba'}] },
  { id:24, name:'Whiteline Front Sway Bar',     brand:'Whiteline', cat:'suspension',  pri:'nice', vendors:[{n:'Whiteline',p:210,s:0,t:'us'},{n:'Amazon',p:225,s:0,t:'us'}] },
  { id:25, name:'Cusco Rear Sway Bar',          brand:'Cusco',     cat:'suspension',  pri:'want', vendors:[{n:'Cusco USA',p:420,s:0,t:'us'},{n:'Alibaba',p:110,s:40,t:'alibaba'}] },
  { id:26, name:'Brembo GT 6-Piston BBK',       brand:'Brembo',    cat:'brakes',      pri:'want', vendors:[{n:'Brembo Direct',p:3200,s:0,t:'us'},{n:'Vivid Racing',p:3349,s:0,t:'us'},{n:'Alibaba',p:780,s:110,t:'alibaba'}] },
  { id:27, name:'StopTech Street Brake Pads',   brand:'StopTech',  cat:'brakes',      pri:'must', vendors:[{n:'StopTech',p:89,s:0,t:'us'},{n:'Amazon',p:95,s:0,t:'us'}] },
  { id:28, name:'EBC Yellowstuff Pads',         brand:'EBC',       cat:'brakes',      pri:'want', vendors:[{n:'EBC',p:120,s:0,t:'us'},{n:'Amazon',p:130,s:0,t:'us'},{n:'Alibaba',p:42,s:18,t:'alibaba'}] },
  { id:29, name:'Hawk HP Plus Pads',            brand:'Hawk',      cat:'brakes',      pri:'want', vendors:[{n:'Hawk',p:110,s:0,t:'us'},{n:'Amazon',p:118,s:0,t:'us'}] },
  { id:30, name:'Volk TE37 Saga 18x10 +34',     brand:'Volk',      cat:'wheels',      pri:'want', vendors:[{n:'Wheel Pros',p:2350,s:0,t:'us'},{n:'Vivid Racing',p:2480,s:0,t:'us'},{n:'Alibaba',p:580,s:95,t:'alibaba'}] },
  { id:31, name:'Volk CE28N 18x9.5',            brand:'Volk',      cat:'wheels',      pri:'want', vendors:[{n:'Wheel Pros',p:2100,s:0,t:'us'},{n:'Alibaba',p:520,s:95,t:'alibaba'}] },
  { id:32, name:'Enkei RPF1 18x9.5 +38',        brand:'Enkei',     cat:'wheels',      pri:'nice', vendors:[{n:'Tire Rack',p:285,s:0,t:'us'},{n:'Discount Tire',p:299,s:0,t:'us'},{n:'Alibaba',p:92,s:48,t:'alibaba'}] },
  { id:33, name:'Work Emotion CR Kiwami 18x10', brand:'Work',      cat:'wheels',      pri:'nice', vendors:[{n:'Vivid Racing',p:1800,s:0,t:'us'},{n:'Alibaba',p:420,s:88,t:'alibaba'}] },
  { id:34, name:'SSR SP1 18x10',                brand:'SSR',       cat:'wheels',      pri:'nice', vendors:[{n:'Vivid Racing',p:1650,s:0,t:'us'},{n:'Alibaba',p:380,s:85,t:'alibaba'}] },
  { id:35, name:'Gram Lights 57CR 18x9.5',      brand:'Gram Lights',cat:'wheels',     pri:'nice', vendors:[{n:'Tire Rack',p:320,s:0,t:'us'},{n:'Alibaba',p:98,s:48,t:'alibaba'}] },
  { id:36, name:'BBS RI-A 18x9.5',              brand:'BBS',       cat:'wheels',      pri:'nice', vendors:[{n:'BBS',p:680,s:0,t:'us'},{n:'Vivid Racing',p:720,s:0,t:'us'}] },
  { id:37, name:'Morimoto XB LED Headlights',   brand:'Morimoto',  cat:'lights',      pri:'nice', vendors:[{n:'Morimoto',p:899,s:0,t:'us'},{n:'Alibaba',p:195,s:48,t:'alibaba'},{n:'Temu',p:149,s:20,t:'temu'}] },
  { id:38, name:'Seibon Carbon Fibre Hood',      brand:'Seibon',    cat:'exterior',    pri:'want', vendors:[{n:'Seibon',p:1200,s:0,t:'us'},{n:'Alibaba',p:280,s:75,t:'alibaba'}] },
  { id:39, name:'Carbon Fibre Front Splitter',  brand:'Generic',   cat:'exterior',    pri:'nice', vendors:[{n:'Rocket Bunny',p:650,s:45,t:'us'},{n:'Alibaba',p:98,s:38,t:'alibaba'},{n:'Temu',p:72,s:16,t:'temu'}] },
  { id:40, name:'Rocket Bunny Widebody Kit',    brand:'Generic',   cat:'exterior',    pri:'nice', vendors:[{n:'Pandem/TRA Kyoto',p:4800,s:180,t:'us'},{n:'Alibaba',p:980,s:145,t:'alibaba'}] },
  { id:41, name:'HKS Hi-Power Exhaust',         brand:'HKS',       cat:'exhaust',     pri:'want', vendors:[{n:'HKS',p:1450,s:0,t:'us'},{n:'Alibaba',p:390,s:85,t:'alibaba'}] },
  { id:42, name:'Tomei Expreme Ti Cat-Back',    brand:'Tomei',     cat:'exhaust',     pri:'want', vendors:[{n:'Tomei',p:1680,s:0,t:'us'},{n:'Alibaba',p:420,s:85,t:'alibaba'}] },
  { id:43, name:'GReddy Ti-C Cat-Back',         brand:'GReddy',    cat:'exhaust',     pri:'want', vendors:[{n:'GReddy',p:1380,s:0,t:'us'},{n:'Alibaba',p:350,s:80,t:'alibaba'}] },
  { id:44, name:'Motul 8100 X-cess 5W-40 (5L)', brand:'Motul',     cat:'oil',         pri:'must', vendors:[{n:'Amazon',p:42,s:0,t:'us'},{n:'ECS Tuning',p:39,s:0,t:'us'},{n:'Temu',p:28,s:8,t:'temu'}] },
  { id:45, name:'Liqui Moly Synthoil 5W-40 (5L)',brand:'Liqui',    cat:'oil',         pri:'must', vendors:[{n:'Amazon',p:38,s:0,t:'us'},{n:'Walmart',p:35,s:0,t:'us'}] },
  { id:46, name:'Castrol Edge 5W-30 LL (5L)',   brand:'Castrol',   cat:'oil',         pri:'must', vendors:[{n:'Amazon',p:32,s:0,t:'us'},{n:'AutoZone',p:35,s:0,t:'us'}] },
  { id:47, name:'NGK Iridium Spark Plugs (set)', brand:'NGK',      cat:'accessories', pri:'must', vendors:[{n:'Amazon',p:48,s:0,t:'us'},{n:'AutoZone',p:52,s:0,t:'us'},{n:'Alibaba',p:18,s:12,t:'alibaba'}] },
  { id:48, name:'Mishimoto Radiator Hose Kit',  brand:'Mishimoto', cat:'accessories', pri:'must', vendors:[{n:'Mishimoto',p:89,s:0,t:'us'},{n:'Amazon',p:95,s:0,t:'us'},{n:'Alibaba',p:28,s:18,t:'alibaba'}] },
  { id:49, name:'GR Supra OEM Floor Mats',      brand:'Toyota',    cat:'accessories', pri:'nice', vendors:[{n:'Toyota Parts',p:89,s:8,t:'us'},{n:'Amazon',p:75,s:0,t:'us'},{n:'Temu',p:28,s:10,t:'temu'}] },
  { id:50, name:'Sparco Pro 2000 Bucket Seat',  brand:'Sparco',    cat:'safety',      pri:'nice', vendors:[{n:'Sparco',p:899,s:0,t:'us'},{n:'Amazon',p:929,s:0,t:'us'},{n:'Alibaba',p:220,s:65,t:'alibaba'}] },
  { id:51, name:'Bride Zeta IV Bucket Seat',    brand:'Bride',     cat:'safety',      pri:'nice', vendors:[{n:'Bride Direct',p:1250,s:0,t:'us'},{n:'Alibaba',p:310,s:72,t:'alibaba'}] },
  { id:52, name:'Recaro SPG Bucket Seat',       brand:'Recaro',    cat:'safety',      pri:'nice', vendors:[{n:'Recaro',p:1100,s:0,t:'us'},{n:'Amazon',p:1149,s:0,t:'us'}] },
  { id:53, name:'High-Flow Fuel Injectors (x6)',brand:'Injector Dynamics',cat:'fueling',pri:'want',vendors:[{n:'Injector Dynamics',p:580,s:0,t:'us'},{n:'Alibaba',p:135,s:42,t:'alibaba'}] },
  { id:54, name:'Walbro 450 Fuel Pump',         brand:'Walbro',    cat:'fueling',     pri:'want', vendors:[{n:'Walbro',p:180,s:0,t:'us'},{n:'Amazon',p:189,s:0,t:'us'},{n:'Alibaba',p:55,s:22,t:'alibaba'}] },
  { id:55, name:'Radium Fuel Pressure Reg',     brand:'Radium',    cat:'fueling',     pri:'nice', vendors:[{n:'Radium Engineering',p:220,s:0,t:'us'},{n:'Alibaba',p:68,s:18,t:'alibaba'}] },
  { id:56, name:'Michelin Pilot Sport 4S 275/35ZR19', brand:'Michelin', cat:'tires', pri:'must', vendors:[{n:'Tire Rack',p:392,s:0,t:'us'},{n:'Discount Tire',p:405,s:0,t:'us'}] },
  { id:57, name:'Michelin Pilot Sport Cup 2 275/35ZR19', brand:'Michelin', cat:'tires', pri:'want', vendors:[{n:'Tire Rack',p:455,s:0,t:'us'},{n:'Discount Tire',p:468,s:0,t:'us'}] },
  { id:58, name:'Yokohama Advan A052 275/35R18', brand:'Yokohama', cat:'tires', pri:'want', vendors:[{n:'Tire Rack',p:390,s:0,t:'us'},{n:'Vivid Racing',p:410,s:0,t:'us'}] },
  { id:59, name:'Bridgestone Potenza RE-71RS 275/35R18', brand:'Bridgestone', cat:'tires', pri:'want', vendors:[{n:'Tire Rack',p:372,s:0,t:'us'},{n:'Discount Tire',p:389,s:0,t:'us'}] },
  { id:60, name:'Continental ExtremeContact Sport 02 275/35ZR19', brand:'Continental', cat:'tires', pri:'must', vendors:[{n:'Tire Rack',p:318,s:0,t:'us'},{n:'Discount Tire',p:329,s:0,t:'us'}] },
  { id:61, name:'Nitto NT555RII Drag Radial 305/35R18', brand:'Nitto', cat:'tires', pri:'want', vendors:[{n:'Discount Tire',p:345,s:0,t:'us'},{n:'Summit Racing',p:356,s:0,t:'us'}] },
  { id:62, name:'Toyo Proxes R888R 285/35ZR18', brand:'Toyo', cat:'tires', pri:'nice', vendors:[{n:'Tire Rack',p:338,s:0,t:'us'},{n:'Vivid Racing',p:352,s:0,t:'us'}] },
  { id:63, name:'Falken Azenis RT660 275/35R18', brand:'Falken', cat:'tires', pri:'want', vendors:[{n:'Tire Rack',p:286,s:0,t:'us'},{n:'Discount Tire',p:299,s:0,t:'us'}] },
];

export const INSTALLED_MODS = [
  { id:1, name:'BMS Cold Air Intake',      cat:'performance', brand:'Burger',    price:269,  date:'Jan 2023', miles:'12,400' },
  { id:2, name:'MHD Stage 2 E30 Tune',     cat:'electronics', brand:'MHD',       price:399,  date:'Feb 2023', miles:'12,600' },
  { id:3, name:'DP Race 3" Downpipe',      cat:'performance', brand:'Generic',   price:680,  date:'Feb 2023', miles:'12,600' },
  { id:4, name:'Akrapovic Titanium Cat-Back',cat:'performance',brand:'Akrapovic',price:2100, date:'Apr 2023', miles:'15,200' },
  { id:5, name:'KW V3 Coilovers',          cat:'suspension',  brand:'KW',        price:1999, date:'Jun 2023', miles:'18,900' },
  { id:6, name:'Volk TE37 18x10 +34',      cat:'wheels',      brand:'Volk',      price:2350, date:'Aug 2023', miles:'22,100' },
  { id:7, name:'Seibon Carbon Hood',        cat:'exterior',    brand:'Seibon',    price:1200, date:'Oct 2023', miles:'25,800' },
  { id:8, name:'20% Window Tint',           cat:'exterior',    brand:'Local',     price:380,  date:'Nov 2023', miles:'26,400' },
  { id:9, name:'Alcantara Steering Wrap',   cat:'interior',    brand:'Local',     price:320,  date:'Dec 2023', miles:'27,000' },
];

export const COMMUNITY_BUILDS = [
  { id:1, name:'Tyler S.', loc:'Los Angeles, CA', color:'#F5C800', tags:['Street','Daily'],  hp:'380 whp', mods:14, cost:'$12,400', likes:87,  desc:'Stage 2 tune, TE37s, KW V3, Akrapovic. Canyon carver.' },
  { id:2, name:'Jay M.',   loc:'Miami, FL',        color:'#1a1a1a', tags:['Show','Wide'],    hp:'340 whp', mods:22, cost:'$28,000', likes:214, desc:'Rocket Bunny widebody, air suspension, Bride seats, Defi gauges.' },
  { id:3, name:'Kevin T.', loc:'Houston, TX',      color:'#C82020', tags:['Track','500+'],   hp:'520 whp', mods:19, cost:'$34,500', likes:156, desc:'Pure Stage 2, Brembo BBK, full cage, Motec dash, semi-slicks.' },
  { id:4, name:'Alex R.',  loc:'Seattle, WA',      color:'#1840A0', tags:['Street','Clean'], hp:'420 whp', mods:11, cost:'$15,800', likes:63,  desc:'Stage 2 E30, Mishimoto intercooler, BC coilovers, TE37 bronze.' },
  { id:5, name:'Marcus L.',loc:'Chicago, IL',      color:'#888888', tags:['Drift','Track'],  hp:'460 whp', mods:17, cost:'$22,000', likes:98,  desc:'Rear diff lock, BC coilovers maxed, cage, harness, drift knuckles.' },
  { id:6, name:'Sam K.',   loc:'San Diego, CA',    color:'#E05A10', tags:['Street','500+'],  hp:'510 whp', mods:16, cost:'$29,900', likes:178, desc:'Pure Stage 2, E50 tune, Brembo, Seibon carbon, Volk CE28.' },
  { id:7, name:'Maya V.',  loc:'Austin, TX',       color:'#1D7F5C', tags:['SUV','Overland','Daily'], hp:'310 whp', mods:18, cost:'$19,600', likes:121, desc:'4Runner build with lift, Method wheels, armor, lighting, roof tent, and trail comms.' },
  { id:8, name:'Noah P.',  loc:'Denver, CO',       color:'#2B3552', tags:['Truck','Overland','Tow'], hp:'420 whp', mods:21, cost:'$31,200', likes:144, desc:'F-150 Tremor setup with 35s, bed rack, Baja Designs lights, tune, and recovery gear.' },
  { id:9, name:'Priya R.', loc:'San Jose, CA',     color:'#7C8A98', tags:['EV','Street','Tech'], hp:'455 whp', mods:10, cost:'$13,900', likes:93, desc:'Model 3 Performance with coilovers, forged wheels, brake cooling, tint, and aero kit.' },
  { id:10, name:'Chris D.',loc:'Portland, OR',     color:'#D4D9DF', tags:['EV','SUV','Adventure'], hp:'835 whp', mods:12, cost:'$24,800', likes:167, desc:'Rivian R1S camping build with all-terrain tires, crossbars, storage, lighting, and recovery kit.' },
];

export const BP_PHASES = {
  1: { label:'Phase 1 · Foundation', note:'Tune, intake, downpipe and fluids first — safe power gains before anything else.', parts:['BMS Cold Air Intake','DP Race 3" Catless Downpipe','MHD Bootmod3 Stage 2 Tune','Motul 8100 X-cess 5W-40 (5L)','Mishimoto Radiator Hose Kit','StopTech Street Brake Pads'] },
  2: { label:'Phase 2 · Power',       note:'Intercooler, turbo upgrade and supporting fuel mods once foundation is solid.',    parts:['Mishimoto Intercooler Kit','Pure Stage 2 Turbo','BC Racing BR Coilovers','High-Flow Fuel Injectors (x6)','Walbro 450 Fuel Pump','Defi Boost + Oil Temp Gauges'] },
  3: { label:'Phase 3 · Looks',       note:'Aesthetics last — appearance mods after the mechanical build is complete.',        parts:['Volk TE37 Saga 18x10 +34','Seibon Carbon Fibre Hood','Carbon Fibre Front Splitter','Morimoto XB LED Headlights','Rocket Bunny Widebody Kit'] },
};

export const minPrice = (vendors, vendorFilter = 'all') => {
  const filtered = vendorFilter === 'all'
    ? vendors
    : vendors.filter(v => vendorFilter === 'us' ? v.t === 'us' : v.t === vendorFilter);
  return filtered.length ? Math.min(...filtered.map(v => v.p)) : Infinity;
};

const FITMENT_BY_CATEGORY = {
  performance: { level:'likely', label:'Likely fit', note:'Usually fits platform cars, but tune and ECU strategy often required.' },
  downpipe: { level:'custom', label:'Custom work', note:'Emissions hardware, sensor positions, and software support must match.' },
  exhaust: { level:'likely', label:'Likely fit', note:'Confirm wheelbase/chassis variant and valved vs non-valved compatibility.' },
  intercooler: { level:'likely', label:'Likely fit', note:'Charge pipe routing and bumper trim may vary by trim/market.' },
  suspension: { level:'direct', label:'Direct fit', note:'Verify exact generation/chassis and damper top-hat configuration.' },
  brakes: { level:'direct', label:'Direct fit', note:'Check rotor diameter and caliper clearance with current wheels.' },
  exterior: { level:'custom', label:'Custom work', note:'Body fitment may require trimming, drilling, or paint matching.' },
  wheels: { level:'likely', label:'Likely fit', note:'Verify offset, center bore, lug seat, and brake clearance.' },
  tires: { level:'direct', label:'Direct fit', note:'Select sizes based on wheel width, suspension setup, and intended use.' },
  electronics: { level:'likely', label:'Likely fit', note:'Wiring and software compatibility should be confirmed before install.' },
  lights: { level:'likely', label:'Likely fit', note:'Harness adapters and regional lighting regulations may apply.' },
  fueling: { level:'custom', label:'Custom work', note:'Fueling upgrades often require tune changes and supporting hardware.' },
  oil: { level:'direct', label:'Direct fit', note:'Use oil spec and interval required by your engine and usage.' },
  accessories: { level:'direct', label:'Direct fit', note:'Basic fitment is straightforward; verify generation-specific clips.' },
  safety: { level:'custom', label:'Custom work', note:'Seat rails, occupancy sensors, and legal compliance require attention.' },
};

export const getFitmentMeta = (part) => {
  const base = FITMENT_BY_CATEGORY[part.cat] || { level:'likely', label:'Likely fit', note:'Check part details before purchase.' };

  if (part.vendors?.some(v => v.t === 'alibaba' || v.t === 'temu')) {
    return {
      ...base,
      note: `${base.note} Budget vendor listings can vary in quality and exact specs.`,
    };
  }

  return base;
};

const hashPartSeed = (text) => {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) % 1000003;
  return h;
};

export const getPriceHistory = (part) => {
  const base = minPrice(part.vendors);
  if (!Number.isFinite(base) || base <= 0) return [];

  const seed = hashPartSeed(`${part.id}:${part.name}`);
  return Array.from({ length: 12 }, (_, idx) => {
    const wave = Math.sin((idx + (seed % 7)) / 2.2) * 0.06;
    const trend = (11 - idx) * 0.003;
    const jitter = (((seed + idx * 97) % 21) - 10) / 1000;
    const multiplier = 1 + wave + trend + jitter;
    return Math.max(1, Math.round(base * multiplier));
  });
};

export const getPriceAnalytics = (part) => {
  const history = getPriceHistory(part);
  if (!history.length) return { history: [], lowest30: 0, lowest90: 0 };

  const last4 = history.slice(-4);
  const lowest30 = Math.min(...last4);
  const lowest90 = Math.min(...history);
  return { history, lowest30, lowest90 };
};
