-- ============================================================
-- Tanaj Study Hub — Spanish translations of Sefaria commentaries
-- Run this in your Supabase dashboard: SQL Editor → New query → Run
--
-- Sefaria has Rashi, Ramban, midrash… in English and Hebrew only. The first
-- time someone opens a commentary in Spanish, the Vercel function
-- api/translate-commentary.js translates Sefaria's English with DeepL and
-- saves it here; everyone after that reads the saved copy.
--
-- One row per Sefaria ref ("Rashi on Genesis 1:2", "Bereshit Rabbah 1:1").
-- To fix a bad translation, edit segments_es in the Table Editor. Deleting a
-- row makes the next visitor translate it again.
--
-- Safe to re-run.
-- ============================================================

create table if not exists public.commentary_translations (
  ref          text primary key,                 -- Sefaria ref, as Sefaria returns it
  en_version   text,                             -- the English version that was translated
  segments_es  text[] not null,                  -- one entry per comment, light HTML (<b>, <i>…)
  created_at   timestamptz default now()
);

alter table public.commentary_translations enable row level security;

-- Anyone may read. Only the server (secret key, which bypasses RLS) writes,
-- so visitors can't insert their own "translations".
drop policy if exists "commentary_translations are readable by everyone" on public.commentary_translations;
create policy "commentary_translations are readable by everyone"
  on public.commentary_translations for select
  using (true);
