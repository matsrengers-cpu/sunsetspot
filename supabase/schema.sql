-- =====================================================================
-- SunsetSpots – Supabase-Schema
-- Im Supabase-Dashboard unter "SQL Editor" -> "New query" einfügen und
-- auf "Run" klicken. Danach supabase/seed.sql genauso ausführen.
-- =====================================================================

-- ---------- Tabelle: spots -------------------------------------------
create table if not exists public.spots (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 2 and 80),
  type         text not null check (type in ('strand', 'berg', 'dach', 'see', 'skyline')),
  suitability  text not null check (suitability in ('sunrise', 'sunset', 'both')),
  description  text check (description is null or char_length(description) <= 600),
  lat          double precision not null check (lat between -90 and 90),
  lng          double precision not null check (lng between -180 and 180),
  photo_url    text check (photo_url is null or char_length(photo_url) <= 500),
  created_at   timestamptz not null default now()
);

create index if not exists spots_lat_lng_idx on public.spots (lat, lng);

-- ---------- Row Level Security ---------------------------------------
-- Jeder darf lesen und (anonym) neue Spots anlegen.
-- Ändern und Löschen ist nur über das Dashboard / den service_role-Key möglich.
alter table public.spots enable row level security;

drop policy if exists "Spots sind öffentlich lesbar" on public.spots;
create policy "Spots sind öffentlich lesbar"
  on public.spots for select
  to anon, authenticated
  using (true);

drop policy if exists "Jeder darf Spots anlegen" on public.spots;
create policy "Jeder darf Spots anlegen"
  on public.spots for insert
  to anon, authenticated
  with check (true);

-- ---------- Storage: Bucket für Fotos --------------------------------
-- Öffentlicher Bucket, max. 5 MB pro Datei, nur Bilder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('spot-photos', 'spot-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Spot-Fotos öffentlich lesbar" on storage.objects;
create policy "Spot-Fotos öffentlich lesbar"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'spot-photos');

drop policy if exists "Jeder darf Spot-Fotos hochladen" on storage.objects;
create policy "Jeder darf Spot-Fotos hochladen"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'spot-photos');

-- TODO (später): Moderation, z.B. Spalte "approved boolean default false"
-- und die select-Policy auf "approved = true" einschränken, damit neue
-- Spots erst nach Freigabe sichtbar sind.
