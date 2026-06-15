-- ============================================================
-- Tanaj Study Hub — make every account visible in a table
-- Run this in your Supabase dashboard: SQL Editor → New query → Run
-- ============================================================

-- 1. Create a public "profiles" table (one row per account).
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  name        text,
  created_at  timestamptz default now()
);

-- 2. When a new user signs up, automatically add a row here.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name'
  )
  on conflict (id) do update
    set email = excluded.email,
        name  = excluded.name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Backfill: copy any accounts that already exist into the table.
insert into public.profiles (id, email, name)
select
  u.id,
  u.email,
  u.raw_user_meta_data ->> 'name'
from auth.users u
on conflict (id) do nothing;

-- 4. Security: enable RLS so each user can only read/update their own row.
--    (The table is still fully visible to you in the Supabase Table Editor.)
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
