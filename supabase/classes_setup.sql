-- ============================================================
-- Tanaj Study Hub — classes for schools
-- Run this in your Supabase dashboard: SQL Editor → New query → Run
-- (Run AFTER profiles_setup.sql, user_data_setup.sql, content_setup.sql and
--  submissions_setup.sql.)
--
-- Also switch on  Authentication → Sign In / Providers → "Allow anonymous
-- sign-ins". Students join a class with a code and a nickname and no email;
-- Supabase gives each of them a real but anonymous account, so the existing
-- per-user tables (quiz_attempts and so on) keep working for them.
--
-- WHO SEES WHAT
--   student   their own rows, their classes, the assignments of those classes
--   teacher   their own classes, the roster (nicknames) of those classes, and
--             ONLY the quiz attempts a student made on an assignment of theirs
--             — never a student's other quizzes, notes or anything else
--   everyone  nothing else
--
-- MAKING SOMEONE A TEACHER: /admin → Teachers → add their email. It works
-- before or after they sign up; they become a teacher once they log in with
-- that (confirmed) email. Keep "Confirm email" ON in Supabase → Authentication,
-- otherwise anyone could sign up with a teacher's address.
--
-- Safe to re-run: it only creates what's missing and resets the policies.
-- ============================================================

-- ============================================================
-- 1. TEACHERS  (accounts allowed to create classes)
-- ============================================================
-- Same pattern as public.admins: RLS on with NO policies, so the API can't
-- read or write these; only the functions below and the dashboard can.
--
-- teacher_emails is what /admin → Teachers manages (by email, so a teacher
-- can be added before they have an account). public.teachers is the older
-- by-account list; it still counts, and is copied into teacher_emails below.
create table if not exists public.teachers (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  school      text,
  created_at  timestamptz default now()
);
alter table public.teachers enable row level security;

create table if not exists public.teacher_emails (
  email       text primary key check (email = lower(btrim(email)) and position('@' in email) > 1),
  school      text,
  created_at  timestamptz default now()
);
alter table public.teacher_emails enable row level security;

insert into public.teacher_emails (email, school)
select lower(u.email), t.school
  from public.teachers t join auth.users u on u.id = t.user_id
 where u.email is not null
on conflict (email) do nothing;

-- A teacher = listed by account, or logged in with a confirmed email that's
-- on the list.
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.teachers where user_id = auth.uid())
      or exists (
        select 1 from public.teacher_emails e
        join auth.users u on lower(u.email) = e.email
        where u.id = auth.uid() and u.email_confirmed_at is not null
      );
$$;

-- ---- Admin-only: manage teachers from /admin → Teachers ----
create or replace function public.admin_list_teachers()
returns table (email text, school text, added_at timestamptz, has_account boolean, name text, class_count integer)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can do this.' using errcode = '42501';
  end if;
  return query
    select e.email, e.school, e.created_at,
           u.id is not null,
           (u.raw_user_meta_data ->> 'name'),
           coalesce((select count(*)::integer from public.classes c
                      where c.teacher_id = u.id and not c.archived), 0)
      from public.teacher_emails e
      left join auth.users u on lower(u.email) = e.email
     order by e.created_at desc;
end;
$$;

create or replace function public.admin_add_teacher(teacher_email text, school_name text default null)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can do this.' using errcode = '42501';
  end if;
  insert into public.teacher_emails (email, school)
  values (lower(btrim(teacher_email)), nullif(btrim(school_name), ''))
  on conflict (email) do update set school = coalesce(excluded.school, public.teacher_emails.school);
end;
$$;

-- Stops them creating classes and hides their Teach page. Their existing
-- classes stay, so students don't lose anything.
create or replace function public.admin_remove_teacher(teacher_email text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can do this.' using errcode = '42501';
  end if;
  delete from public.teacher_emails where email = lower(btrim(teacher_email));
  delete from public.teachers
   where user_id in (select id from auth.users where lower(email) = lower(btrim(teacher_email)));
end;
$$;

revoke all on function public.admin_list_teachers() from public, anon;
revoke all on function public.admin_add_teacher(text, text) from public, anon;
revoke all on function public.admin_remove_teacher(text) from public, anon;
grant execute on function public.admin_list_teachers() to authenticated;
grant execute on function public.admin_add_teacher(text, text) to authenticated;
grant execute on function public.admin_remove_teacher(text) to authenticated;

-- ============================================================
-- 2. CLASSES, MEMBERS, ASSIGNMENTS
-- ============================================================
create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (length(btrim(name)) between 1 and 80),
  join_code   text not null unique,
  archived    boolean not null default false,
  created_at  timestamptz default now()
);
create index if not exists classes_teacher_idx on public.classes (teacher_id);

create table if not exists public.class_members (
  class_id    uuid not null references public.classes (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  nickname    text not null check (length(btrim(nickname)) between 1 and 40),
  joined_at   timestamptz default now(),
  primary key (class_id, user_id)
);
create index if not exists class_members_user_idx on public.class_members (user_id);

create table if not exists public.assignments (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references public.classes (id) on delete cascade,
  quiz_key    text not null references public.quizzes (key) on update cascade on delete cascade,
  due_at      timestamptz,
  created_at  timestamptz default now()
);
create index if not exists assignments_class_idx on public.assignments (class_id);

-- A quiz attempt made for an assignment points at it. Deleting an assignment
-- keeps the student's own attempt (it just stops being linked).
alter table public.quiz_attempts
  add column if not exists assignment_id uuid references public.assignments (id) on delete set null;
create index if not exists quiz_attempts_assignment_idx on public.quiz_attempts (assignment_id);

-- ============================================================
-- 3. HELPERS used by the policies
-- ============================================================
-- security definer so a policy on one table can look at another without
-- tripping over that table's own policies (which would loop forever).
create or replace function public.owns_class(cid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.classes where id = cid and teacher_id = auth.uid());
$$;

create or replace function public.in_class(cid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.class_members where class_id = cid and user_id = auth.uid());
$$;

-- Is this assignment one of my class's (as the teacher)?
create or replace function public.owns_assignment(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assignments a
    join public.classes c on c.id = a.class_id
    where a.id = aid and c.teacher_id = auth.uid()
  );
$$;

-- Is this assignment one for a class I'm in (as a student)?
create or replace function public.in_assignment_class(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assignments a
    join public.class_members m on m.class_id = a.class_id
    where a.id = aid and m.user_id = auth.uid()
  );
$$;

-- ============================================================
-- 4. CREATE / JOIN  (the only ways rows get into classes / class_members)
-- ============================================================
-- Codes look like  K7QM-2XPA  — 8 characters from 32 with no 0/O/1/I, drawn
-- from gen_random_uuid() (cryptographically random), so they can't be guessed.
create or replace function public.create_class(class_name text)
returns public.classes
language plpgsql
security definer set search_path = public
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- 32 characters
  bytes    bytea;
  code     text;
  made     public.classes;
  tries    integer := 0;
begin
  if auth.uid() is null or not public.is_teacher() then
    raise exception 'Only teachers can create classes.' using errcode = '42501';
  end if;
  loop
    bytes := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
    code := '';
    for i in 0..7 loop
      code := code || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
    end loop;
    code := substr(code, 1, 4) || '-' || substr(code, 5, 4);
    begin
      insert into public.classes (teacher_id, name, join_code)
      values (auth.uid(), btrim(class_name), code)
      returning * into made;
      return made;
    exception when unique_violation then
      tries := tries + 1;
      if tries > 10 then raise; end if;
    end;
  end loop;
end;
$$;

-- Joins (or renames yourself in) the class with this code. Returns the class id.
create or replace function public.join_class(code text, nick text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  cid uuid;
begin
  if auth.uid() is null then
    raise exception 'Not logged in.' using errcode = '42501';
  end if;
  select id into cid from public.classes
   where join_code = upper(btrim(code)) and not archived;
  if cid is null then
    raise exception 'No class has that code.' using errcode = 'P0002';
  end if;
  insert into public.class_members (class_id, user_id, nickname)
  values (cid, auth.uid(), btrim(nick))
  on conflict (class_id, user_id) do update set nickname = excluded.nickname;
  return cid;
end;
$$;

-- Lets the join page check a code BEFORE creating a class account, so a typo
-- doesn't leave an unused anonymous account behind. It only says yes/no, and
-- codes are 8 random characters from 32, so it doesn't help anyone guess one.
create or replace function public.class_code_exists(code text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.classes where join_code = upper(btrim(code)) and not archived
  );
$$;

revoke all on function public.class_code_exists(text) from public;
grant execute on function public.class_code_exists(text) to anon, authenticated;

revoke all on function public.create_class(text) from public, anon;
revoke all on function public.join_class(text, text) from public, anon;
grant execute on function public.create_class(text) to authenticated;
grant execute on function public.join_class(text, text) to authenticated;
grant execute on function public.is_teacher() to authenticated;
grant execute on function public.owns_class(uuid) to authenticated;
grant execute on function public.in_class(uuid) to authenticated;
grant execute on function public.owns_assignment(uuid) to authenticated;
grant execute on function public.in_assignment_class(uuid) to authenticated;

-- ============================================================
-- 5. ROW-LEVEL SECURITY
-- ============================================================
alter table public.classes       enable row level security;
alter table public.class_members enable row level security;
alter table public.assignments   enable row level security;

-- classes: teachers see/edit their own; students see the ones they're in.
-- (No insert policy: create_class() is the only way in.)
drop policy if exists "Read my classes" on public.classes;
create policy "Read my classes" on public.classes for select
  using (teacher_id = auth.uid() or public.in_class(id));

drop policy if exists "Teachers edit own classes" on public.classes;
create policy "Teachers edit own classes" on public.classes for update
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

drop policy if exists "Teachers delete own classes" on public.classes;
create policy "Teachers delete own classes" on public.classes for delete
  using (teacher_id = auth.uid());

-- Only the name and archived flag can be edited from the API (not the code
-- or the owner).
revoke update on public.classes from anon, authenticated;
grant update (name, archived) on public.classes to authenticated;

-- class_members: you see yourself; a teacher sees their classes' rosters.
-- (No insert policy: join_class() is the only way in.)
drop policy if exists "Read class members" on public.class_members;
create policy "Read class members" on public.class_members for select
  using (user_id = auth.uid() or public.owns_class(class_id));

drop policy if exists "Rename myself" on public.class_members;
create policy "Rename myself" on public.class_members for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Leave or remove from class" on public.class_members;
create policy "Leave or remove from class" on public.class_members for delete
  using (user_id = auth.uid() or public.owns_class(class_id));

-- A student can change their nickname and nothing else (not which class).
revoke update on public.class_members from anon, authenticated;
grant update (nickname) on public.class_members to authenticated;

-- assignments: the teacher manages them; the class's students can read them.
drop policy if exists "Read class assignments" on public.assignments;
create policy "Read class assignments" on public.assignments for select
  using (public.owns_class(class_id) or public.in_class(class_id));

drop policy if exists "Teachers add assignments" on public.assignments;
create policy "Teachers add assignments" on public.assignments for insert
  with check (public.owns_class(class_id));

drop policy if exists "Teachers edit assignments" on public.assignments;
create policy "Teachers edit assignments" on public.assignments for update
  using (public.owns_class(class_id)) with check (public.owns_class(class_id));

drop policy if exists "Teachers delete assignments" on public.assignments;
create policy "Teachers delete assignments" on public.assignments for delete
  using (public.owns_class(class_id));

-- quiz_attempts: a teacher may read ONLY attempts tied to their assignments.
drop policy if exists "Teachers read assignment results" on public.quiz_attempts;
create policy "Teachers read assignment results" on public.quiz_attempts for select
  using (assignment_id is not null and public.owns_assignment(assignment_id));

-- ...and a student may only tag an attempt with an assignment of their own class.
drop policy if exists "Users insert own attempts" on public.quiz_attempts;
create policy "Users insert own attempts" on public.quiz_attempts for insert
  with check (
    auth.uid() = user_id
    and (assignment_id is null or public.in_assignment_class(assignment_id))
  );

-- ============================================================
-- 6. NO QUESTION SUGGESTIONS FROM ANONYMOUS (CLASS-CODE) ACCOUNTS
-- ============================================================
-- Suggesting a question needs a real email (we email people when theirs is
-- published), so anonymous students are turned away. A "restrictive" policy
-- is AND-ed with the existing ones instead of replacing them.
drop policy if exists "No suggestions from anonymous accounts" on public.question_submissions;
create policy "No suggestions from anonymous accounts" on public.question_submissions
  as restrictive for insert to authenticated
  with check (coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false);

-- ============================================================
-- 7. ASSIGNMENT OPTIONS
-- ============================================================
-- chapters: perakim like '12-15, 20' (single-book quizzes, or the chosen book
-- of a multi-book quiz). book: one book id for multi-book quizzes
-- (src/data/books.js QUIZ_BOOKS). mode: null = the student picks.
alter table public.assignments add column if not exists question_count integer not null default 10;
alter table public.assignments add column if not exists chapters text;
alter table public.assignments add column if not exists book text;
alter table public.assignments add column if not exists mode text;
alter table public.assignments add column if not exists allow_retries boolean not null default true;

alter table public.assignments drop constraint if exists assignments_question_count_check;
alter table public.assignments add constraint assignments_question_count_check
  check (question_count between 1 and 50);
alter table public.assignments drop constraint if exists assignments_mode_check;
alter table public.assignments add constraint assignments_mode_check
  check (mode is null or mode in ('choice', 'free'));

-- A student may save an attempt for an assignment of their own class — and
-- only once when the teacher turned retries off.
create or replace function public.can_submit_assignment(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assignments a
    join public.class_members m on m.class_id = a.class_id
    where a.id = aid and m.user_id = auth.uid()
      and (a.allow_retries or not exists (
        select 1 from public.quiz_attempts q where q.assignment_id = aid and q.user_id = auth.uid()
      ))
  );
$$;
grant execute on function public.can_submit_assignment(uuid) to authenticated;

drop policy if exists "Users insert own attempts" on public.quiz_attempts;
create policy "Users insert own attempts" on public.quiz_attempts for insert
  with check (
    auth.uid() = user_id
    and (assignment_id is null or public.can_submit_assignment(assignment_id))
  );

-- ============================================================
-- 8. ONE NICKNAME PER STUDENT IN A CLASS
-- ============================================================
-- Existing duplicates get " (2)", " (3)"… so the unique index can be built.
with dupes as (
  select class_id, user_id,
         row_number() over (partition by class_id, lower(btrim(nickname)) order by joined_at) as n
    from public.class_members
)
update public.class_members m
   set nickname = left(btrim(m.nickname), 34) || ' (' || d.n || ')'
  from dupes d
 where d.class_id = m.class_id and d.user_id = m.user_id and d.n > 1;

create unique index if not exists class_members_nickname_unique
  on public.class_members (class_id, lower(btrim(nickname)));

-- Same as section 4, plus a clear message when someone else in the class
-- already uses that nickname (usually the same student on a new device: the
-- teacher removes the old entry, then they join again).
create or replace function public.join_class(code text, nick text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  cid uuid;
begin
  if auth.uid() is null then
    raise exception 'Not logged in.' using errcode = '42501';
  end if;
  select id into cid from public.classes
   where join_code = upper(btrim(code)) and not archived;
  if cid is null then
    raise exception 'No class has that code.' using errcode = 'P0002';
  end if;
  if exists (
    select 1 from public.class_members
     where class_id = cid and user_id <> auth.uid()
       and lower(btrim(nickname)) = lower(btrim(nick))
  ) then
    raise exception 'That nickname is taken in this class.' using errcode = '23505';
  end if;
  insert into public.class_members (class_id, user_id, nickname)
  values (cid, auth.uid(), btrim(nick))
  on conflict (class_id, user_id) do update set nickname = excluded.nickname;
  return cid;
end;
$$;

-- ============================================================
-- 9. DELETE CLASS ACCOUNTS UNUSED FOR 12 MONTHS
-- ============================================================
-- Anonymous (class-code) accounts nobody has used for a year: no sign-in,
-- no token refresh, no quiz. Deleting the user removes their memberships and
-- attempts too (on delete cascade).
create or replace function public.delete_stale_class_accounts()
returns integer
language plpgsql security definer set search_path = public, auth
as $$
declare
  n integer;
begin
  delete from auth.users u
   where u.is_anonymous
     and greatest(
           u.created_at,
           coalesce(u.last_sign_in_at, u.created_at),
           coalesce((select max(s.updated_at) from auth.sessions s where s.user_id = u.id), u.created_at),
           coalesce((select max(q.created_at) from public.quiz_attempts q where q.user_id = u.id), u.created_at)
         ) < now() - interval '12 months';
  get diagnostics n = row_count;
  return n;
end;
$$;
revoke all on function public.delete_stale_class_accounts() from public, anon, authenticated;

-- Runs every Sunday at 04:00 UTC — once pg_cron is switched on in
-- Database → Extensions. Re-run this file after switching it on.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('delete-stale-class-accounts', '0 4 * * 0',
                          'select public.delete_stale_class_accounts()');
  end if;
end;
$$;

-- ============================================================
-- 10. READING AND DISCUSSION ASSIGNMENTS
-- ============================================================
-- kind = 'quiz'       → quiz_key (+ the options in section 7)
--        'reading'    → book + chapters ("Read Bereshit 12-15"); students mark it done
--        'discussion' → prompt (+ optional book/chapters); students write an answer
alter table public.assignments add column if not exists kind text not null default 'quiz';
alter table public.assignments add column if not exists prompt text;
alter table public.assignments alter column quiz_key drop not null;

alter table public.assignments drop constraint if exists assignments_kind_check;
alter table public.assignments add constraint assignments_kind_check check (
  (kind = 'quiz' and quiz_key is not null)
  or (kind = 'reading' and book is not null)
  or (kind = 'discussion' and length(btrim(coalesce(prompt, ''))) between 1 and 1000)
);

-- One row per student per reading/discussion assignment: "done", plus the
-- written answer for discussions. The student and their teacher can read it.
create table if not exists public.assignment_responses (
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  answer        text check (answer is null or length(answer) <= 4000),
  done_at       timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (assignment_id, user_id)
);
alter table public.assignment_responses enable row level security;

drop policy if exists "Read responses" on public.assignment_responses;
create policy "Read responses" on public.assignment_responses for select
  using (user_id = auth.uid() or public.owns_assignment(assignment_id));

drop policy if exists "Students respond" on public.assignment_responses;
create policy "Students respond" on public.assignment_responses for insert
  with check (user_id = auth.uid() and public.in_assignment_class(assignment_id));

drop policy if exists "Students edit their response" on public.assignment_responses;
create policy "Students edit their response" on public.assignment_responses for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.in_assignment_class(assignment_id));

drop policy if exists "Students remove their response" on public.assignment_responses;
create policy "Students remove their response" on public.assignment_responses for delete
  using (user_id = auth.uid());

drop trigger if exists assignment_responses_touch on public.assignment_responses;
create trigger assignment_responses_touch before update on public.assignment_responses
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 11. ANNOUNCEMENTS
-- ============================================================
create table if not exists public.class_posts (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references public.classes (id) on delete cascade,
  body        text not null check (length(btrim(body)) between 1 and 2000),
  created_at  timestamptz default now()
);
create index if not exists class_posts_class_idx on public.class_posts (class_id, created_at desc);
alter table public.class_posts enable row level security;

drop policy if exists "Read class posts" on public.class_posts;
create policy "Read class posts" on public.class_posts for select
  using (public.owns_class(class_id) or public.in_class(class_id));
drop policy if exists "Teachers post" on public.class_posts;
create policy "Teachers post" on public.class_posts for insert
  with check (public.owns_class(class_id));
drop policy if exists "Teachers delete posts" on public.class_posts;
create policy "Teachers delete posts" on public.class_posts for delete
  using (public.owns_class(class_id));

-- ============================================================
-- 12. CLASS NOTES ON PESUKIM
-- ============================================================
-- A teacher's note on a pasuk (verse) or a whole perek (verse null). Students
-- in that class see it in the reader's commentary panel.
create table if not exists public.class_notes (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references public.classes (id) on delete cascade,
  book_id     text not null,
  chapter     smallint not null check (chapter >= 1),
  verse       smallint check (verse >= 1),
  body        text not null check (length(btrim(body)) between 1 and 2000),
  created_at  timestamptz default now()
);
create index if not exists class_notes_place_idx on public.class_notes (book_id, chapter);
alter table public.class_notes enable row level security;

drop policy if exists "Read class notes" on public.class_notes;
create policy "Read class notes" on public.class_notes for select
  using (public.owns_class(class_id) or public.in_class(class_id));
drop policy if exists "Teachers add class notes" on public.class_notes;
create policy "Teachers add class notes" on public.class_notes for insert
  with check (public.owns_class(class_id));
drop policy if exists "Teachers delete class notes" on public.class_notes;
create policy "Teachers delete class notes" on public.class_notes for delete
  using (public.owns_class(class_id));

-- ============================================================
-- 13. CLASS QUESTIONS  (a teacher's own questions, for their class only)
-- ============================================================
-- Assigned with kind = 'custom': students get `question_count` random
-- questions from their class's bank.
create table if not exists public.class_questions (
  id             uuid primary key default gen_random_uuid(),
  class_id       uuid not null references public.classes (id) on delete cascade,
  question       text not null check (length(btrim(question)) between 1 and 500),
  options        text[] not null check (cardinality(options) between 2 and 6),
  correct_index  smallint not null,
  created_at     timestamptz default now(),
  constraint class_questions_correct_in_range check (correct_index >= 0 and correct_index < cardinality(options))
);
create index if not exists class_questions_class_idx on public.class_questions (class_id);
alter table public.class_questions enable row level security;

drop policy if exists "Read class questions" on public.class_questions;
create policy "Read class questions" on public.class_questions for select
  using (public.owns_class(class_id) or public.in_class(class_id));
drop policy if exists "Teachers add class questions" on public.class_questions;
create policy "Teachers add class questions" on public.class_questions for insert
  with check (public.owns_class(class_id));
drop policy if exists "Teachers delete class questions" on public.class_questions;
create policy "Teachers delete class questions" on public.class_questions for delete
  using (public.owns_class(class_id));

-- ============================================================
-- 14. MAP ACTIVITIES
-- ============================================================
-- kind = 'map': "find these places" — place_ids are public.places ids; the
-- student clicks each pin on the map, then the activity counts as done
-- (an assignment_responses row, like a reading). prompt = optional instructions.
alter table public.assignments add column if not exists place_ids text[];

alter table public.assignments drop constraint if exists assignments_kind_check;
alter table public.assignments add constraint assignments_kind_check check (
  (kind = 'quiz' and quiz_key is not null)
  or kind = 'custom'
  or (kind = 'reading' and book is not null)
  or (kind = 'discussion' and length(btrim(coalesce(prompt, ''))) between 1 and 1000)
  or (kind = 'map' and cardinality(place_ids) between 1 and 20
      and (prompt is null or length(prompt) <= 1000))
);

-- ============================================================
-- 15. CO-TEACHERS
-- ============================================================
-- The class's creator (classes.teacher_id) can add other teachers. A
-- co-teacher can do everything with the class except archive it or manage
-- the teacher list. owns_class() now counts co-teachers, so every policy
-- above that uses it (students, assignments, results, notes…) covers them.
create table if not exists public.class_teachers (
  class_id  uuid not null references public.classes (id) on delete cascade,
  user_id   uuid not null references auth.users (id) on delete cascade,
  added_at  timestamptz default now(),
  primary key (class_id, user_id)
);
alter table public.class_teachers enable row level security;

create or replace function public.owns_class(cid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.classes where id = cid and teacher_id = auth.uid())
      or exists (select 1 from public.class_teachers where class_id = cid and user_id = auth.uid());
$$;

create or replace function public.owns_assignment(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.assignments a where a.id = aid and public.owns_class(a.class_id));
$$;

drop policy if exists "Read co-teachers" on public.class_teachers;
create policy "Read co-teachers" on public.class_teachers for select
  using (user_id = auth.uid() or public.owns_class(class_id));

drop policy if exists "Read my classes" on public.classes;
create policy "Read my classes" on public.classes for select
  using (public.owns_class(id) or public.in_class(id));

-- Co-teachers can rename and change settings; archiving stays with the creator.
drop policy if exists "Teachers edit own classes" on public.classes;
create policy "Teachers edit own classes" on public.classes for update
  using (public.owns_class(id)) with check (public.owns_class(id));

create or replace function public.add_co_teacher(cid uuid, teacher_email text)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid;
begin
  if not exists (select 1 from public.classes where id = cid and teacher_id = auth.uid()) then
    raise exception 'Only the teacher who created the class can add teachers.' using errcode = '42501';
  end if;
  select u.id into uid from auth.users u
   where lower(u.email) = lower(btrim(teacher_email)) and u.email_confirmed_at is not null;
  if uid is null or not (
       exists (select 1 from public.teacher_emails e where e.email = lower(btrim(teacher_email)))
       or exists (select 1 from public.teachers t where t.user_id = uid)
     ) then
    raise exception 'No teacher account uses that email.' using errcode = 'P0002';
  end if;
  if uid = auth.uid() then
    return;
  end if;
  insert into public.class_teachers (class_id, user_id) values (cid, uid)
  on conflict do nothing;
end;
$$;

-- The creator removes anyone; a co-teacher can remove themselves.
create or replace function public.remove_co_teacher(cid uuid, uid uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not (uid = auth.uid()
          or exists (select 1 from public.classes where id = cid and teacher_id = auth.uid())) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  delete from public.class_teachers where class_id = cid and user_id = uid;
end;
$$;

-- Everyone teaching the class, for the Teach page.
create or replace function public.list_class_teachers(cid uuid)
returns table (user_id uuid, email text, name text, is_creator boolean)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.owns_class(cid) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  return query
    select u.id, u.email::text, (u.raw_user_meta_data ->> 'name'), true
      from public.classes c join auth.users u on u.id = c.teacher_id
     where c.id = cid
    union all
    select u.id, u.email::text, (u.raw_user_meta_data ->> 'name'), false
      from public.class_teachers ct join auth.users u on u.id = ct.user_id
     where ct.class_id = cid;
end;
$$;

revoke all on function public.add_co_teacher(uuid, text) from public, anon;
revoke all on function public.remove_co_teacher(uuid, uuid) from public, anon;
revoke all on function public.list_class_teachers(uuid) from public, anon;
grant execute on function public.add_co_teacher(uuid, text) to authenticated;
grant execute on function public.remove_co_teacher(uuid, uuid) to authenticated;
grant execute on function public.list_class_teachers(uuid) to authenticated;

-- ============================================================
-- 16. CLASS LANGUAGE AND POINTS
-- ============================================================
-- language: the site language students start in when they join (and the
-- language of printed instructions). show_leaderboard: students see the
-- class's points table (off unless the teacher turns it on).
alter table public.classes add column if not exists language text;
alter table public.classes drop constraint if exists classes_language_check;
alter table public.classes add constraint classes_language_check
  check (language is null or language in ('english', 'spanish', 'hebrew'));
alter table public.classes add column if not exists show_leaderboard boolean not null default false;

revoke update on public.classes from anon, authenticated;
grant update (name, archived, language, show_leaderboard) on public.classes to authenticated;

-- Archiving is for the class's creator only (the update policy above lets
-- co-teachers edit, so this trigger guards the one column).
create or replace function public.guard_class_archive()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.archived is distinct from old.archived and old.teacher_id <> auth.uid() then
    raise exception 'Only the teacher who created the class can archive it.' using errcode = '42501';
  end if;
  return new;
end;
$$;
drop trigger if exists classes_guard_archive on public.classes;
create trigger classes_guard_archive before update on public.classes
  for each row execute function public.guard_class_archive();

-- Points per student: 5 for finishing a quiz assignment + up to 10 for the
-- best score on it, and 10 for each reading / discussion / map done.
-- Teachers always see it; students only when show_leaderboard is on.
create or replace function public.class_leaderboard(cid uuid)
returns table (nickname text, points integer, is_me boolean)
language sql stable security definer set search_path = public
as $$
  select m.nickname,
         (coalesce((
            select sum(5 + round(10 * coalesce(b.best, 0)))
              from (select max(q.score::numeric / nullif(q.total, 0)) as best
                      from public.quiz_attempts q
                      join public.assignments a on a.id = q.assignment_id
                     where a.class_id = cid and q.user_id = m.user_id
                     group by q.assignment_id) b
          ), 0)
          + 10 * (select count(*) from public.assignment_responses r
                    join public.assignments a on a.id = r.assignment_id
                   where a.class_id = cid and r.user_id = m.user_id))::integer as points,
         m.user_id = auth.uid() as is_me
    from public.class_members m
   where m.class_id = cid
     and (public.owns_class(cid)
          or (public.in_class(cid)
              and exists (select 1 from public.classes c where c.id = cid and c.show_leaderboard)))
   order by points desc, m.nickname;
$$;
revoke all on function public.class_leaderboard(uuid) from public, anon;
grant execute on function public.class_leaderboard(uuid) to authenticated;

-- ============================================================
-- 17. LIVE GAME MODE
-- ============================================================
-- The teacher shows questions on the board; students answer on their own
-- devices. Screens ask live_game_state() every ~1.5 s. Students never read
-- these tables directly: the functions below hide the correct answer until
-- the teacher reveals it, and time + score answers on the server.
--
-- questions: a snapshot made when the game starts, one object per question:
--   { id, question_en, question_es, question_he, options_en, options_es,
--     options_he, correct_index }
create table if not exists public.live_games (
  id                   uuid primary key default gen_random_uuid(),
  class_id             uuid not null references public.classes (id) on delete cascade,
  host_id              uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title                text not null default '',
  questions            jsonb not null check (jsonb_typeof(questions) = 'array' and jsonb_array_length(questions) between 1 and 50),
  seconds              smallint not null default 20 check (seconds between 5 and 120),
  phase                text not null default 'lobby' check (phase in ('lobby', 'question', 'reveal', 'ended')),
  current_index        integer not null default -1,
  question_started_at  timestamptz,
  created_at           timestamptz default now()
);
create index if not exists live_games_class_idx on public.live_games (class_id, created_at desc);

create table if not exists public.live_players (
  game_id    uuid not null references public.live_games (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  joined_at  timestamptz default now(),
  primary key (game_id, user_id)
);

create table if not exists public.live_answers (
  game_id         uuid not null references public.live_games (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  question_index  integer not null,
  option_index    integer not null,
  correct         boolean not null,
  points          integer not null,
  answered_at     timestamptz default now(),
  primary key (game_id, user_id, question_index)
);

-- No direct access for students; teachers may list their classes' games.
alter table public.live_games   enable row level security;
alter table public.live_players enable row level security;
alter table public.live_answers enable row level security;
drop policy if exists "Teachers read live games" on public.live_games;
create policy "Teachers read live games" on public.live_games for select
  using (public.owns_class(class_id));

-- The class's game in progress (started in the last 6 hours), or null.
create or replace function public.active_live_game(cid uuid)
returns uuid
language sql stable security definer set search_path = public
as $$
  select g.id from public.live_games g
   where g.class_id = cid and g.phase <> 'ended' and g.created_at > now() - interval '6 hours'
     and (public.owns_class(cid) or public.in_class(cid))
   order by g.created_at desc
   limit 1;
$$;

create or replace function public.live_start(cid uuid, game_title text, qs jsonb, secs integer)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  gid uuid;
begin
  if not public.owns_class(cid) then
    raise exception 'Only the class''s teachers can start a game.' using errcode = '42501';
  end if;
  if jsonb_typeof(qs) <> 'array' or exists (
    select 1 from jsonb_array_elements(qs) e
     where jsonb_typeof(e -> 'options_en') <> 'array'
        or jsonb_array_length(e -> 'options_en') < 2
        or (e ->> 'correct_index')::integer not between 0 and jsonb_array_length(e -> 'options_en') - 1
  ) then
    raise exception 'Bad questions.' using errcode = '22023';
  end if;
  -- One game at a time per class.
  update public.live_games set phase = 'ended' where class_id = cid and phase <> 'ended';
  insert into public.live_games (class_id, host_id, title, questions, seconds)
  values (cid, auth.uid(), coalesce(game_title, ''), qs, secs)
  returning id into gid;
  return gid;
end;
$$;

-- Host controls: lobby/reveal → next question (or the end); question → reveal.
create or replace function public.live_next(gid uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  g public.live_games;
begin
  select * into g from public.live_games where id = gid;
  if g.id is null or not public.owns_class(g.class_id) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  if g.phase not in ('lobby', 'reveal') then
    return;
  end if;
  if g.current_index + 1 >= jsonb_array_length(g.questions) then
    update public.live_games set phase = 'ended' where id = gid;
  else
    update public.live_games
       set phase = 'question', current_index = g.current_index + 1, question_started_at = now()
     where id = gid;
  end if;
end;
$$;

create or replace function public.live_reveal(gid uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.live_games where id = gid and public.owns_class(class_id)) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  update public.live_games set phase = 'reveal' where id = gid and phase = 'question';
end;
$$;

create or replace function public.live_end(gid uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.live_games where id = gid and public.owns_class(class_id)) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  update public.live_games set phase = 'ended' where id = gid;
end;
$$;

-- A student joins the lobby (or a game already running).
create or replace function public.live_join(gid uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.live_games where id = gid and public.in_class(class_id)) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  insert into public.live_players (game_id, user_id) values (gid, auth.uid()) on conflict do nothing;
end;
$$;

-- One answer per question. Right answers score 500–1000 (faster = more);
-- wrong answers 0. A 2-second grace covers slow connections.
create or replace function public.live_answer(gid uuid, opt integer)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  g public.live_games;
  q jsonb;
  ok boolean;
  elapsed double precision;
  pts integer;
begin
  select * into g from public.live_games where id = gid;
  if g.id is null or not public.in_class(g.class_id) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  if g.phase <> 'question' then
    raise exception 'Not accepting answers now.' using errcode = 'P0001';
  end if;
  elapsed := extract(epoch from now() - g.question_started_at);
  if elapsed > g.seconds + 2 then
    raise exception 'Time is up.' using errcode = 'P0001';
  end if;
  q := g.questions -> g.current_index;
  if opt < 0 or opt >= jsonb_array_length(q -> 'options_en') then
    raise exception 'Bad option.' using errcode = '22023';
  end if;
  ok := opt = (q ->> 'correct_index')::integer;
  pts := case when ok then round(500 + 500 * greatest(0, 1 - elapsed / g.seconds))::integer else 0 end;
  insert into public.live_players (game_id, user_id) values (gid, auth.uid()) on conflict do nothing;
  insert into public.live_answers (game_id, user_id, question_index, option_index, correct, points)
  values (gid, auth.uid(), g.current_index, opt, ok, pts)
  on conflict do nothing;
end;
$$;

-- Everything a screen needs, as JSON. The correct answer, per-option counts,
-- each player's result and the leaderboard only appear once revealed.
create or replace function public.live_game_state(gid uuid)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  g public.live_games;
  host boolean;
  shown boolean;
  q jsonb;
  mine public.live_answers;
  my_score integer;
  my_rank integer;
  result jsonb;
begin
  select * into g from public.live_games where id = gid;
  if g.id is null then
    raise exception 'No such game.' using errcode = 'P0002';
  end if;
  host := public.owns_class(g.class_id);
  if not host and not public.in_class(g.class_id) then
    raise exception 'Not allowed.' using errcode = '42501';
  end if;
  shown := g.phase in ('reveal', 'ended');
  if g.current_index >= 0 then
    q := g.questions -> g.current_index;
    if not shown then
      q := q - 'correct_index';
    end if;
  end if;

  select * into mine from public.live_answers
   where game_id = gid and user_id = auth.uid() and question_index = g.current_index;
  select coalesce(sum(points), 0)::integer into my_score
    from public.live_answers where game_id = gid and user_id = auth.uid();
  select x.r into my_rank from (
    select p.user_id, rank() over (order by coalesce(sum(a.points), 0) desc) as r
      from public.live_players p
      left join public.live_answers a on a.game_id = p.game_id and a.user_id = p.user_id
     where p.game_id = gid
     group by p.user_id
  ) x where x.user_id = auth.uid();

  result := jsonb_build_object(
    'id', g.id,
    'title', g.title,
    'phase', g.phase,
    'index', g.current_index,
    'total', jsonb_array_length(g.questions),
    'seconds', g.seconds,
    'started_at', g.question_started_at,
    'now', now(),
    'is_host', host,
    'question', q,
    'players', (select count(*) from public.live_players where game_id = gid),
    'answered', (select count(*) from public.live_answers where game_id = gid and question_index = g.current_index),
    'me', jsonb_build_object(
      'joined', exists (select 1 from public.live_players where game_id = gid and user_id = auth.uid()),
      'answered', mine.user_id is not null,
      'option', mine.option_index,
      'correct', case when shown then mine.correct end,
      'points', case when shown then mine.points end,
      'score', my_score,
      'rank', case when shown then my_rank end
    )
  );

  if g.phase = 'lobby' then
    result := result || jsonb_build_object('nicknames', coalesce((
      select jsonb_agg(m.nickname order by p.joined_at)
        from public.live_players p
        join public.class_members m on m.class_id = g.class_id and m.user_id = p.user_id
       where p.game_id = gid), '[]'::jsonb));
  end if;

  if shown then
    result := result || jsonb_build_object(
      'counts', (
        select coalesce(jsonb_agg(c.n order by c.i), '[]'::jsonb)
          from (select i, (select count(*) from public.live_answers a
                            where a.game_id = gid and a.question_index = g.current_index and a.option_index = i) as n
                  from generate_series(0, jsonb_array_length(q -> 'options_en') - 1) as i) c),
      'leaders', (
        select coalesce(jsonb_agg(jsonb_build_object('nickname', t.nickname, 'score', t.score) order by t.score desc, t.nickname), '[]'::jsonb)
          from (select m.nickname, coalesce(sum(a.points), 0)::integer as score
                  from public.live_players p
                  join public.class_members m on m.class_id = g.class_id and m.user_id = p.user_id
                  left join public.live_answers a on a.game_id = p.game_id and a.user_id = p.user_id
                 where p.game_id = gid
                 group by m.nickname
                 order by score desc, m.nickname
                 limit case when g.phase = 'ended' then 10 else 5 end) t)
    );
  end if;
  return result;
end;
$$;

revoke all on function public.active_live_game(uuid) from public, anon;
revoke all on function public.live_start(uuid, text, jsonb, integer) from public, anon;
revoke all on function public.live_next(uuid) from public, anon;
revoke all on function public.live_reveal(uuid) from public, anon;
revoke all on function public.live_end(uuid) from public, anon;
revoke all on function public.live_join(uuid) from public, anon;
revoke all on function public.live_answer(uuid, integer) from public, anon;
revoke all on function public.live_game_state(uuid) from public, anon;
grant execute on function public.active_live_game(uuid) to authenticated;
grant execute on function public.live_start(uuid, text, jsonb, integer) to authenticated;
grant execute on function public.live_next(uuid) to authenticated;
grant execute on function public.live_reveal(uuid) to authenticated;
grant execute on function public.live_end(uuid) to authenticated;
grant execute on function public.live_join(uuid) to authenticated;
grant execute on function public.live_answer(uuid, integer) to authenticated;
grant execute on function public.live_game_state(uuid) to authenticated;
