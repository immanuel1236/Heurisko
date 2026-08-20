-- Run this in the Supabase SQL editor for a fresh project.
--
-- This mirrors the exact key-value shape the app already used (and was tested
-- against) on Claude's built-in storage: one row per logical dataset
-- (directory, admin queue, audit trail, etc.), value stored as jsonb. This is
-- a faithful, low-risk port of proven behavior — not the fully relational
-- schema in HEURISKO_ARCHITECTURE.md. Migrating to real tables
-- (professional_profiles, verification_requests, etc.) is the natural next
-- step once this pilot outgrows a single-blob-per-dataset model, and nothing
-- here blocks that migration later.

create table if not exists kv_store (
  key text primary key,
  value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row-Level Security: this is a small trusted pilot, so the policy below is
-- deliberately permissive (anyone with the anon key can read/write) rather
-- than pretending to enforce real per-user authorization the app itself
-- doesn't have yet. Tighten this before any real public launch — see
-- HEURISKO_PRODUCTION_READINESS.md §1 for what real per-request authorization
-- needs to look like (it is NOT "make the anon key secret," which doesn't work;
-- anon keys are meant to be public and RLS is the actual boundary).
alter table kv_store enable row level security;

drop policy if exists "pilot_read_all" on kv_store;
drop policy if exists "pilot_write_all" on kv_store;
drop policy if exists "pilot_update_all" on kv_store;

create policy "pilot_read_all" on kv_store
  for select using (true);

create policy "pilot_write_all" on kv_store
  for insert with check (true);

create policy "pilot_update_all" on kv_store
  for update using (true);

-- Realtime: lets every open tab see another tester's change live, without a
-- manual refresh. Requires the table to be added to the supabase_realtime
-- publication (the Supabase dashboard's Realtime toggle for this table does
-- the same thing as the line below).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'kv_store'
  ) then
    alter publication supabase_realtime add table kv_store;
  end if;
end $$;

-- Seed the six keys the app expects on first load (optional — the app's own
-- loadShared() already falls back to an empty value if a key doesn't exist
-- yet, so this step is just to avoid an empty-table state if you'd rather not
-- rely on that fallback path).
insert into kv_store (key, value) values
  ('heurisko:directory', '[]'::jsonb),
  ('heurisko:external-listings', '[]'::jsonb),
  ('heurisko:admin-queue', '[]'::jsonb),
  ('heurisko:audit-trail', '[]'::jsonb),
  ('heurisko:discovery-queue', '[]'::jsonb),
  ('heurisko:published-articles', '[]'::jsonb),
  ('heurisko:accounts', '{}'::jsonb)
on conflict (key) do nothing;
