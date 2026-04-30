-- Optional: expanded seed rows for PartScout demo catalog

insert into public.parts (name, category, brand, image_url, product_url, vehicle_compatibility)
values
  ('BMS Cold Air Intake', 'intake', 'Burger', null, 'https://burgertuning.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('FTP Chargepipe Kit', 'chargepipe', 'FTP', null, 'https://ftp-motorsport.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('VRSF B58 TU High-Flow Downpipe', 'downpipe', 'VRSF', null, 'https://www.vr-speed.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('Active Autowerke Catted Downpipe', 'downpipe', 'Active Autowerke', null, 'https://store.activeautowerke.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('Akrapovic Titanium Cat-Back', 'exhaust', 'Akrapovic', null, 'https://www.akrapovic.com/', '["Toyota Supra A90/A91"]'::jsonb),
  ('AWE Touring Exhaust', 'exhaust', 'AWE', null, 'https://awe-tuning.com/', '["Toyota Supra A90/A91"]'::jsonb),
  ('Pure800 Turbo Upgrade', 'turbo', 'Pure', null, 'https://www.pureturbos.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('CSF Race Intercooler', 'intercooler', 'CSF', null, 'https://csfrace.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('KW V3 Coilovers', 'coilovers', 'KW', null, 'https://www.kwsuspensions.com/', '["Toyota Supra A90/A91"]'::jsonb),
  ('Eibach Pro-Kit Springs', 'springs', 'Eibach', null, 'https://eibach.com/', '["Toyota Supra A90/A91","BMW Z4 G29"]'::jsonb),
  ('Brembo GT Brake Kit', 'brakes', 'Brembo', null, 'https://www.brembo.com/', '["Toyota Supra A90/A91"]'::jsonb),
  ('Volk TE37 Saga SL 18x10', 'wheels', 'Volk', null, 'https://www.rayswheels.co.jp/', '["Toyota Supra A90/A91","BMW 5x112"]'::jsonb),
  ('Michelin Pilot Sport 4S 275/35R19', 'tires', 'Michelin', null, 'https://www.michelinman.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('MHD Super License', 'tuning', 'MHD', null, 'https://mhdtuning.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('XHP Flashtool Stage 3', 'electronics', 'XHP', null, 'https://www.xhpflashtool.com/', '["Toyota Supra A90/A91","BMW ZF8"]'::jsonb),
  ('Mishimoto Oil Cooler Kit', 'cooling', 'Mishimoto', null, 'https://www.mishimoto.com/', '["Toyota Supra A90/A91"]'::jsonb),
  ('Spool Flex Fuel Kit', 'fueling', 'Spool', null, 'https://spoolperformance.us/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('StopTech Stainless Brake Lines', 'safety', 'StopTech', null, 'https://www.stoptech.com/', '["Toyota Supra A90/A91","BMW Z4 G29"]'::jsonb),
  ('Toyota GR Carbon Mirror Caps', 'exterior', 'Toyota', null, 'https://toyota.com/', '["Toyota Supra A90/A91"]'::jsonb),
  ('BMW B58 Oil Filter Service Kit', 'maintenance', 'BMW', null, 'https://www.fcpeuro.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb)
on conflict do nothing;

insert into public.part_prices (part_id, vendor_name, price, link, source_type, quality_score)
select p.id, v.vendor_name, v.price, v.link, v.source_type, v.quality_score
from public.parts p
join (
  values
    ('BMS Cold Air Intake', 'Burger Tuning', 399.00, 'https://burgertuning.com/', 'official_api', 95),
    ('BMS Cold Air Intake', 'ECS Tuning', 429.00, 'https://www.ecstuning.com/', 'affiliate_feed', 80),
    ('FTP Chargepipe Kit', 'A90 Shop', 279.00, 'https://www.a90shop.com/', 'csv_feed', 65),
    ('FTP Chargepipe Kit', 'Alibaba', 112.00, 'https://www.alibaba.com/', 'manual', 40),
    ('VRSF B58 TU High-Flow Downpipe', 'VRSF', 389.00, 'https://www.vr-speed.com/', 'official_api', 95),
    ('VRSF B58 TU High-Flow Downpipe', 'A90 Shop', 405.00, 'https://www.a90shop.com/', 'csv_feed', 65),
    ('Active Autowerke Catted Downpipe', 'Active Autowerke', 999.00, 'https://store.activeautowerke.com/', 'official_api', 95),
    ('Akrapovic Titanium Cat-Back', 'Akrapovic', 6200.00, 'https://www.akrapovic.com/', 'official_api', 95),
    ('Akrapovic Titanium Cat-Back', 'A90 Shop', 6099.00, 'https://www.a90shop.com/', 'csv_feed', 65),
    ('AWE Touring Exhaust', 'AWE', 1845.00, 'https://awe-tuning.com/', 'official_api', 95),
    ('Pure800 Turbo Upgrade', 'Pure Turbos', 2795.00, 'https://www.pureturbos.com/', 'official_api', 95),
    ('Pure800 Turbo Upgrade', 'A90 Shop', 2849.00, 'https://www.a90shop.com/', 'csv_feed', 65),
    ('CSF Race Intercooler', 'CSF', 899.00, 'https://csfrace.com/', 'official_api', 95),
    ('CSF Race Intercooler', 'Turner Motorsport', 925.00, 'https://www.turnermotorsport.com/', 'affiliate_feed', 80),
    ('KW V3 Coilovers', 'KW', 2499.00, 'https://www.kwsuspensions.com/', 'official_api', 95),
    ('Eibach Pro-Kit Springs', 'Eibach', 349.00, 'https://eibach.com/', 'official_api', 95),
    ('Brembo GT Brake Kit', 'Brembo', 4295.00, 'https://www.brembo.com/', 'official_api', 95),
    ('Volk TE37 Saga SL 18x10', 'System Motorsports', 2980.00, 'https://www.systemmotorsports.com/', 'affiliate_feed', 80),
    ('Michelin Pilot Sport 4S 275/35R19', 'Tire Rack', 412.00, 'https://www.tirerack.com/', 'affiliate_feed', 80),
    ('MHD Super License', 'MHD', 599.00, 'https://mhdtuning.com/', 'official_api', 95),
    ('XHP Flashtool Stage 3', 'XHP', 349.00, 'https://www.xhpflashtool.com/', 'official_api', 95),
    ('Mishimoto Oil Cooler Kit', 'Mishimoto', 780.00, 'https://www.mishimoto.com/', 'official_api', 95),
    ('Spool Flex Fuel Kit', 'Spool Performance', 495.00, 'https://spoolperformance.us/', 'official_api', 95),
    ('StopTech Stainless Brake Lines', 'StopTech', 169.00, 'https://www.stoptech.com/', 'official_api', 95),
    ('Toyota GR Carbon Mirror Caps', 'A90 Shop', 189.00, 'https://www.a90shop.com/', 'csv_feed', 65),
    ('BMW B58 Oil Filter Service Kit', 'FCP Euro', 89.00, 'https://www.fcpeuro.com/', 'affiliate_feed', 80)
) as v(part_name, vendor_name, price, link, source_type, quality_score)
on p.name = v.part_name
on conflict do nothing;
