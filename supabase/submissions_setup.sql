-- ============================================================
-- Tanaj Study Hub — quiz questions suggested by visitors
-- Run this in your Supabase dashboard: SQL Editor → New query → Run
-- (Run AFTER content_setup.sql.)
--
-- Signed-in visitors suggest a question on /suggest. Admins review it in
-- /admin → Suggestions; accepting it creates a quiz question linked to the
-- suggestion. The moment that question is PUBLISHED (from the editor,
-- "Publish all", or the Table Editor), the database emails the person who
-- suggested it, in the language they used on the site — via Resend.
--
-- Email setup (once): see "Suggested questions" in supabase/README.md.
-- Without it everything works except the email; suggestions published
-- before it's set up are emailed as soon as it is (select
-- public.send_pending_submission_emails();).
--
-- Safe to re-run.
-- ============================================================

create extension if not exists pg_net;   -- lets the database make HTTP calls (Resend's API)

-- ============================================================
-- 1. THE TABLE
-- ============================================================
-- options + correct_index work like quiz_questions (0 = first answer).
create table if not exists public.question_submissions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  email             text,                         -- copied from the account (never from the form)
  submitter_name    text,
  language          text not null default 'english'
                      check (language in ('english', 'spanish', 'hebrew')),
  quiz_key          text not null references public.quizzes (key) on update cascade on delete cascade,
  question          text not null,
  options           text[] not null check (cardinality(options) = 4),
  correct_index     smallint not null check (correct_index between 0 and 3),
  source            text,                         -- optional verse reference, e.g. "Bereshit 25:27"
  status            text not null default 'pending'
                      check (status in ('pending', 'accepted', 'rejected')),
  quiz_question_id  uuid references public.quiz_questions (id) on delete set null,
  notified_at       timestamptz,                  -- when the "it was added" email was sent
  reviewed_at       timestamptz,
  created_at        timestamptz default now()
);

create index if not exists question_submissions_status_idx
  on public.question_submissions (status, created_at);
create index if not exists question_submissions_user_idx
  on public.question_submissions (user_id, created_at desc);
create index if not exists question_submissions_question_idx
  on public.question_submissions (quiz_question_id);

-- ============================================================
-- 2. WHAT A VISITOR'S INSERT MAY CONTAIN
-- ============================================================
-- Non-admins can only create a fresh pending suggestion for themselves; the
-- email and name come from their account. Also caps open suggestions per
-- person so nobody can flood the review queue.
create or replace function public.prepare_question_submission()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  open_count integer;
begin
  if public.is_admin() or auth.uid() is null then
    -- Admins, the secret-key scripts and the SQL Editor (no signed-in user) keep what they send.
    if new.email is null then
      select email, raw_user_meta_data ->> 'name' into new.email, new.submitter_name
      from auth.users where id = new.user_id;
    end if;
    return new;
  end if;

  new.user_id := auth.uid();
  new.status := 'pending';
  new.quiz_question_id := null;
  new.notified_at := null;
  new.reviewed_at := null;
  select email, raw_user_meta_data ->> 'name' into new.email, new.submitter_name
  from auth.users where id = new.user_id;

  new.question := btrim(new.question);
  new.source := nullif(btrim(coalesce(new.source, '')), '');
  if char_length(new.question) not between 5 and 600 then
    raise exception 'submission_question_length';
  end if;
  if exists (select 1 from unnest(new.options) o where char_length(btrim(coalesce(o, ''))) not between 1 and 200) then
    raise exception 'submission_option_length';
  end if;
  new.options := array(select btrim(o) from unnest(new.options) o);
  if char_length(coalesce(new.source, '')) > 200 then
    raise exception 'submission_source_length';
  end if;

  select count(*) into open_count
  from public.question_submissions
  where user_id = new.user_id and status = 'pending';
  if open_count >= 20 then
    raise exception 'submission_too_many_pending';
  end if;
  return new;
end;
$$;

drop trigger if exists prepare_question_submission on public.question_submissions;
create trigger prepare_question_submission
  before insert on public.question_submissions
  for each row execute function public.prepare_question_submission();

-- ============================================================
-- 3. ROW-LEVEL SECURITY
-- ============================================================
alter table public.question_submissions enable row level security;

drop policy if exists "Users suggest questions" on public.question_submissions;
create policy "Users suggest questions" on public.question_submissions for insert
  to authenticated
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users read own suggestions" on public.question_submissions;
create policy "Users read own suggestions" on public.question_submissions for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins review suggestions" on public.question_submissions;
create policy "Admins review suggestions" on public.question_submissions for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete suggestions" on public.question_submissions;
create policy "Admins delete suggestions" on public.question_submissions for delete
  using (public.is_admin());

grant select, insert, update, delete on public.question_submissions to authenticated;

-- ============================================================
-- 4. THE "YOUR QUESTION WAS ADDED" EMAIL
-- ============================================================
create or replace function public.html_escape(t text)
returns text
language sql
immutable
as $$
  select replace(replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;');
$$;

-- Emails the suggester if their suggestion is accepted, its question is
-- published, and they haven't been emailed yet. Returns true if it sent.
-- Uses three Vault secrets: resend_api_key, email_from, site_url.
create or replace function public.notify_submission(submission_id uuid)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  s        public.question_submissions;
  q        public.quiz_questions;
  quiz     public.quizzes;
  api_key  text;
  sender   text;
  site     text;
  lang     text;
  question text;
  label    text;
  greeting text;
  subject  text;
  html     text;
begin
  select * into s from public.question_submissions where id = submission_id;
  if s.id is null or s.status <> 'accepted' or s.notified_at is not null
     or s.quiz_question_id is null or s.email is null then
    return false;
  end if;
  select * into q from public.quiz_questions where id = s.quiz_question_id;
  if q.id is null or not q.published then
    return false;
  end if;

  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'resend_api_key';
  select decrypted_secret into sender  from vault.decrypted_secrets where name = 'email_from';
  select decrypted_secret into site    from vault.decrypted_secrets where name = 'site_url';
  if api_key is null or sender is null then
    return false;   -- email not set up yet; stays unsent so it can go out later
  end if;
  site := rtrim(coalesce(site, ''), '/');

  select * into quiz from public.quizzes where key = q.quiz_key;
  lang := case s.language when 'spanish' then 'es' when 'hebrew' then 'he' else 'en' end;
  -- The question as published (an admin may have polished it), in their language.
  question := coalesce(nullif(case lang when 'es' then q.question_es when 'he' then q.question_he end, ''), q.question_en);
  label := coalesce(nullif(case lang when 'es' then quiz.label_es when 'he' then quiz.label_he end, ''), quiz.label_en);

  if lang = 'es' then
    subject := '¡Tu pregunta fue añadida a Tanaj Hub!';
    greeting := case when s.submitter_name is not null then '¡Hola, ' || html_escape(s.submitter_name) || '!' else '¡Hola!' end;
    html := '<p>' || greeting || '</p>'
      || '<p>Gracias por tu sugerencia. Tu pregunta ahora forma parte del cuestionario <b>' || html_escape(label) || '</b>:</p>'
      || '<blockquote style="border-left:3px solid #ccc;margin:0;padding:4px 12px;color:#444">' || html_escape(question) || '</blockquote>'
      || case when site <> '' then '<p><a href="' || site || '/quiz">Juega el cuestionario</a></p>' else '' end
      || '<p>— Tanaj Hub</p>';
  elsif lang = 'he' then
    subject := 'השאלה שלך נוספה ל-Tanaj Hub!';
    greeting := case when s.submitter_name is not null then 'שלום ' || html_escape(s.submitter_name) || ',' else 'שלום,' end;
    html := '<div dir="rtl"><p>' || greeting || '</p>'
      || '<p>תודה על ההצעה! השאלה שלך נוספה לחידון <b>' || html_escape(label) || '</b>:</p>'
      || '<blockquote style="border-right:3px solid #ccc;margin:0;padding:4px 12px;color:#444">' || html_escape(question) || '</blockquote>'
      || case when site <> '' then '<p><a href="' || site || '/quiz">לחידון</a></p>' else '' end
      || '<p>— Tanaj Hub</p></div>';
  else
    subject := 'Your question was added to Tanaj Hub!';
    greeting := case when s.submitter_name is not null then 'Hi ' || html_escape(s.submitter_name) || ',' else 'Hi,' end;
    html := '<p>' || greeting || '</p>'
      || '<p>Thanks for your suggestion! Your question is now part of the <b>' || html_escape(label) || '</b> quiz:</p>'
      || '<blockquote style="border-left:3px solid #ccc;margin:0;padding:4px 12px;color:#444">' || html_escape(question) || '</blockquote>'
      || case when site <> '' then '<p><a href="' || site || '/quiz">Play the quiz</a></p>' else '' end
      || '<p>— Tanaj Hub</p>';
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || api_key, 'Content-Type', 'application/json'),
    body := jsonb_build_object('from', sender, 'to', jsonb_build_array(s.email), 'subject', subject, 'html', html)
  );
  update public.question_submissions set notified_at = now() where id = s.id;
  return true;
end;
$$;

-- Only the triggers below (and you, in the SQL Editor) should send email.
revoke execute on function public.notify_submission(uuid) from public, anon, authenticated;

-- A question was published (or created already published) → email whoever suggested it.
create or replace function public.quiz_question_published()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  sid uuid;
begin
  for sid in select id from public.question_submissions
             where quiz_question_id = new.id and status = 'accepted' and notified_at is null
  loop
    perform public.notify_submission(sid);
  end loop;
  return null;
end;
$$;

drop trigger if exists notify_suggesters on public.quiz_questions;
create trigger notify_suggesters
  after insert or update of published on public.quiz_questions
  for each row when (new.published)
  execute function public.quiz_question_published();

-- A suggestion was accepted / linked after its question was already published.
create or replace function public.question_submission_accepted()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  perform public.notify_submission(new.id);
  return null;
end;
$$;

drop trigger if exists notify_on_accept on public.question_submissions;
create trigger notify_on_accept
  after update of status, quiz_question_id on public.question_submissions
  for each row when (new.status = 'accepted' and new.notified_at is null and new.quiz_question_id is not null)
  execute function public.question_submission_accepted();

-- Catch-up: email everyone whose question is already live but who wasn't
-- emailed (e.g. published before email was set up). Run in the SQL Editor:
--   select public.send_pending_submission_emails();
create or replace function public.send_pending_submission_emails()
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  sid uuid;
  sent integer := 0;
begin
  for sid in select id from public.question_submissions
             where status = 'accepted' and notified_at is null and quiz_question_id is not null
  loop
    if public.notify_submission(sid) then sent := sent + 1; end if;
  end loop;
  return sent;
end;
$$;
revoke execute on function public.send_pending_submission_emails() from public, anon, authenticated;
