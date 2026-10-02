-- ============================================================
-- Tanaj Study Hub — site content: quizzes, study notes, midrashim, map places
-- Run this in your Supabase dashboard: SQL Editor → New query → Run
-- (Run AFTER profiles_setup.sql and user_data_setup.sql.)
--
-- Everyone can READ published content. Only accounts listed in
-- public.admins can ADD / EDIT / DELETE it (from the site, later) — you can
-- always edit anything in the Supabase Table Editor regardless.
--
-- Safe to re-run: it only creates what's missing and resets the policies.
-- ============================================================

-- ============================================================
-- 0. ADMINS  (who may edit content from the site)
-- ============================================================
-- A separate table (not a column on profiles) because users are allowed to
-- update their own profile row — they must not be able to make themselves admin.
-- RLS is on with NO policies, so the API can't read or write it at all;
-- only is_admin() (below) and the dashboard can.
create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Keeps updated_at current on every edit (Table Editor or site).
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 1. QUIZZES  (one row per quiz card: Bereshit, Shemot, …)
-- ============================================================
create table if not exists public.quizzes (
  key             text primary key,               -- 'bereshit', 'neviimAjaronim', …
  label_en        text not null,
  label_es        text,
  label_he        text,
  description_en  text not null default '',
  description_es  text,
  description_he  text,
  sort_order      integer not null default 0,
  published       boolean not null default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- 2. QUIZ QUESTIONS
-- ============================================================
-- correct_index is the position (0 = first) of the right answer, shared by
-- all three languages — so options_en / _es / _he must list the answers in
-- the same order.
create table if not exists public.quiz_questions (
  id             uuid primary key default gen_random_uuid(),
  quiz_key       text not null references public.quizzes (key) on update cascade on delete cascade,
  sort_order     integer not null default 0,
  question_en    text not null,
  question_es    text,
  question_he    text,
  options_en     text[] not null,
  options_es     text[],
  options_he     text[],
  correct_index  smallint not null,
  book           text,                           -- multi-book quizzes only: the book's id in src/data/books.js
  chapter        smallint check (chapter >= 1),  -- the perek the question is about (null = not set)
  published      boolean not null default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  constraint correct_index_in_range
    check (correct_index >= 0 and correct_index < cardinality(options_en)),
  constraint options_same_length
    check ((options_es is null or cardinality(options_es) = cardinality(options_en))
       and (options_he is null or cardinality(options_he) = cardinality(options_en)))
);

create index if not exists quiz_questions_quiz_idx
  on public.quiz_questions (quiz_key, sort_order);

-- Added after the table was first created, so older databases get it too.
alter table public.quiz_questions
  add column if not exists chapter smallint check (chapter >= 1);
alter table public.quiz_questions
  add column if not exists book text;

create index if not exists quiz_questions_chapter_idx
  on public.quiz_questions (quiz_key, chapter);

-- Random questions from one or more quizzes, picked in the database so the
-- browser only downloads the handful it will show. Called by the site as
-- POST /rest/v1/rpc/random_quiz_questions.
--
-- `chapters` optionally limits single-book quizzes to certain perakim:
--   {"shemot": [1,2,3,24,25]}  → Shemot questions only from those chapters.
-- `books` does the same for multi-book quizzes, per book ([] = whole book):
--   {"neviimAjaronim": {"yona": [], "yeshayahu": [1,2]}}  → only Yona, and
--   Yeshayahu 1–2.
-- Quizzes not named in either use all their questions.
drop function if exists public.random_quiz_questions(text[], integer);
drop function if exists public.random_quiz_questions(text[], integer, jsonb);
create or replace function public.random_quiz_questions(
  quiz_keys text[], how_many integer, chapters jsonb default null, books jsonb default null)
returns setof public.quiz_questions
language sql
volatile
as $$
  select *
  from public.quiz_questions q
  where q.quiz_key = any (quiz_keys) and q.published
    and (chapters is null
         or not (chapters ? q.quiz_key)
         or q.chapter in (select jsonb_array_elements_text(chapters -> q.quiz_key)::smallint))
    and (books is null
         or not (books ? q.quiz_key)
         or (books -> q.quiz_key ? q.book
             and (jsonb_array_length(books -> q.quiz_key -> q.book) = 0
                  or q.chapter in (select jsonb_array_elements_text(books -> q.quiz_key -> q.book)::smallint))))
  order by random()
  limit least(greatest(how_many, 1), 100);
$$;

-- ============================================================
-- 3. STUDY NOTES  (the built-in topics on the Notes page)
-- ============================================================
create table if not exists public.note_topics (
  slug        text primary key,                   -- 'important-dates', …
  title_en    text not null,
  title_es    text,
  title_he    text,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- An entry is a text card (body_*) and/or a table (table_* =
-- {"headers": [...], "rows": [[...], ...]}).
create table if not exists public.note_entries (
  id          uuid primary key default gen_random_uuid(),
  topic_slug  text not null references public.note_topics (slug) on update cascade on delete cascade,
  sort_order  integer not null default 0,
  title_en    text not null,
  title_es    text,
  title_he    text,
  body_en     text,
  body_es     text,
  body_he     text,
  table_en    jsonb,
  table_es    jsonb,
  table_he    jsonb,
  published   boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists note_entries_topic_idx
  on public.note_entries (topic_slug, sort_order);

-- ============================================================
-- 4. MIDRASHIM  (curated ✨ entries in the verse commentary panel)
-- ============================================================
-- status 'draft' = only admins see it; 'reviewed' = live for everyone.
create table if not exists public.midrashim (
  id             text primary key,                -- 'og-survived-the-flood'
  type           text not null
                   check (type in ('identity', 'crossover', 'backstory', 'connection', 'wonder', 'measure')),
  status         text not null default 'draft'
                   check (status in ('draft', 'reviewed')),
  title_en       text not null,
  title_he       text not null,
  title_es       text not null,
  story_en       text not null,
  story_he       text not null,
  story_es       text not null,
  other_view_en  text,
  other_view_he  text,
  other_view_es  text,
  characters     text[] not null default '{}',
  anchors        text[] not null,                 -- Sefaria refs: 'Genesis 14:13'
  sources        text[] not null default '{}',    -- Sefaria refs: 'Niddah 61a'
  sort_order     integer not null default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ============================================================
-- 5. MAP PLACES  (OpenBible.info geocoding, CC BY 4.0)
-- ============================================================
create table if not exists public.places (
  id              text primary key,
  name            text not null,
  lat             double precision not null,
  lng             double precision not null,
  type            text not null check (type in ('city', 'region', 'mountain', 'river', 'water')),
  books           text[] not null default '{}',   -- ids from src/data/books.js
  periods         text[] not null default '{}',
  aliases         text[] not null default '{}',
  description_en  text,                           -- what happened here (to fill in)
  description_es  text,
  description_he  text,
  published       boolean not null default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- 6. updated_at TRIGGERS + ROW-LEVEL SECURITY for every content table
-- ============================================================
do $$
declare
  t text;
begin
  foreach t in array array['quizzes', 'quiz_questions', 'note_topics', 'note_entries', 'midrashim', 'places']
  loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format(
      'create trigger touch_updated_at before update on public.%I
         for each row execute function public.touch_updated_at()', t);

    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "Admins write" on public.%I', t);
    execute format(
      'create policy "Admins write" on public.%I for all
         using (public.is_admin()) with check (public.is_admin())', t);

    execute format('drop policy if exists "Anyone reads published" on public.%I', t);
    if t = 'midrashim' then
      execute format(
        'create policy "Anyone reads published" on public.%I for select
           using (status = ''reviewed'' or public.is_admin())', t);
    else
      execute format(
        'create policy "Anyone reads published" on public.%I for select
           using (published or public.is_admin())', t);
    end if;
  end loop;
end;
$$;

-- Explicit API access (RLS above still decides which ROWS each person gets).
grant select on public.quizzes, public.quiz_questions, public.note_topics,
                public.note_entries, public.midrashim, public.places
  to anon, authenticated;
grant insert, update, delete on public.quizzes, public.quiz_questions, public.note_topics,
                                public.note_entries, public.midrashim, public.places
  to authenticated;
grant execute on function public.random_quiz_questions(text[], integer, jsonb, jsonb) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- 7. MAKE YOURSELF ADMIN  (run once, with your own email)
-- ============================================================
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;
