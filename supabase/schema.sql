-- BuildSync production baseline (run in Supabase SQL editor)

create table if not exists public.garage_profiles (
  user_id uuid not null references auth.users(id) on delete cascade,
  garage_id text not null default 'primary',
  vehicles jsonb not null default '[]'::jsonb,
  active_vehicle_id bigint,
  liked_builds jsonb not null default '[]'::jsonb,
  catalog_feed jsonb not null default '[]'::jsonb,
  app_scope text not null default 'supra_bmw',
  updated_at timestamptz not null default now(),
  primary key (user_id, garage_id)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.garage_profiles enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "garage own read" on public.garage_profiles;
create policy "garage own read" on public.garage_profiles
for select using (auth.uid() = user_id);

drop policy if exists "garage own write" on public.garage_profiles;
create policy "garage own write" on public.garage_profiles
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "audit own read" on public.audit_logs;
create policy "audit own read" on public.audit_logs
for select using (auth.uid() = user_id);

drop policy if exists "audit own insert" on public.audit_logs;
create policy "audit own insert" on public.audit_logs
for insert with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

drop policy if exists "vehicle photos own upload" on storage.objects;
create policy "vehicle photos own upload" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'vehicle-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "vehicle photos public read" on storage.objects;
create policy "vehicle photos public read" on storage.objects
for select using (bucket_id = 'vehicle-photos');

