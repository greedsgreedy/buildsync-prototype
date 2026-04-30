-- Optional: seed rows for PartScout MVP demo

insert into public.parts (name, category, brand, image_url, product_url, vehicle_compatibility)
values
  ('BMS Cold Air Intake', 'performance', 'Burger', null, 'https://burgertuning.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('VRSF B58 TU High-Flow Downpipe', 'downpipe', 'VRSF', null, 'https://www.vr-speed.com/', '["Toyota Supra A90/A91","BMW B58"]'::jsonb),
  ('Akrapovic Titanium Cat-Back', 'exhaust', 'Akrapovic', null, 'https://www.akrapovic.com/', '["Toyota Supra A90/A91"]'::jsonb)
on conflict do nothing;

insert into public.part_prices (part_id, vendor_name, price, link)
select p.id, v.vendor_name, v.price, v.link
from public.parts p
join (
  values
    ('BMS Cold Air Intake', 'Burger Tuning', 399.00, 'https://burgertuning.com/'),
    ('BMS Cold Air Intake', 'ECS Tuning', 429.00, 'https://www.ecstuning.com/'),
    ('VRSF B58 TU High-Flow Downpipe', 'VRSF', 389.00, 'https://www.vr-speed.com/'),
    ('VRSF B58 TU High-Flow Downpipe', 'Alibaba', 145.00, 'https://www.alibaba.com/'),
    ('Akrapovic Titanium Cat-Back', 'Akrapovic', 6200.00, 'https://www.akrapovic.com/')
) as v(part_name, vendor_name, price, link)
on p.name = v.part_name;
