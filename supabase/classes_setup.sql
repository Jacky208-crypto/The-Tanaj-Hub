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
