-- ============================================================
-- Tanaj Study Hub — per-user data: quiz scores + personal notes
-- Run this in your Supabase dashboard: SQL Editor → New query → Run
-- (Run AFTER profiles_setup.sql — it relies on auth.users existing.)
-- ============================================================

-- ============================================================
-- 1. QUIZ ATTEMPTS  (one row per finished quiz)
-- ============================================================
create table if not exists public.quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  quiz_label  text not null,
  score       integer not null,
  total       integer not null,
  created_at  timestamptz default now()
);

create index if not exists quiz_attempts_user_idx
  on public.quiz_attempts (user_id, created_at desc);

alter table public.quiz_attempts enable row level security;

drop policy if exists "Users read own attempts" on public.quiz_attempts;
create policy "Users read own attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own attempts" on public.quiz_attempts;
create policy "Users insert own attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own attempts" on public.quiz_attempts;
create policy "Users delete own attempts"
  on public.quiz_attempts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 2. USER NOTES  (personal notes each account writes & saves)
-- ============================================================
create table if not exists public.user_notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default '',
  body        text not null default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists user_notes_user_idx
  on public.user_notes (user_id, updated_at desc);

alter table public.user_notes enable row level security;

drop policy if exists "Users read own notes" on public.user_notes;
create policy "Users read own notes"
  on public.user_notes for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own notes" on public.user_notes;
create policy "Users insert own notes"
  on public.user_notes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own notes" on public.user_notes;
create policy "Users update own notes"
  on public.user_notes for update
  using (auth.uid() = user_id);

drop policy if exists "Users delete own notes" on public.user_notes;
create policy "Users delete own notes"
  on public.user_notes for delete
  using (auth.uid() = user_id);
