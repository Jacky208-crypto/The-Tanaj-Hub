-- Tanaj Hub: speed-ups. Safe to run more than once, and after the other
-- setup files (classes_setup.sql, content_setup.sql, user_data_setup.sql).
-- Paste it into Supabase → SQL Editor and run it. Nothing here changes what
-- anyone can see or do; it only makes the same queries faster.
--
-- Already indexed by the earlier setup files (nothing to add):
--   classes.join_code        unique constraint
--   classes.teacher_id       classes_teacher_idx
--   class_members.class_id   primary key (class_id, user_id)
--   class_members.user_id    class_members_user_idx
--   assignments.class_id     assignments_class_idx
--   assignment_responses     primary key (assignment_id, user_id)
--   quiz_attempts.user_id    quiz_attempts_user_idx (user_id, created_at desc)
--   quiz_attempts.assignment_id  quiz_attempts_assignment_idx
--   class_questions.class_id class_questions_class_idx
--   class_posts.class_id     class_posts_class_idx (class_id, created_at desc)
--   class_notes (book, chapter)  class_notes_place_idx
--   live_games.class_id      live_games_class_idx (class_id, created_at desc)
--   question_submissions     status / user / question indexes

-- ============================================================
-- 1. INDEXES
-- ============================================================

-- "My responses": getMyResponses() filters assignment_responses by user_id,
-- and the primary key only helps when assignment_id comes first.
create index if not exists assignment_responses_user_idx
  on public.assignment_responses (user_id, updated_at desc);

-- A class's assignments, newest first (the teacher dashboard and My classes).
create index if not exists assignments_class_created_idx
  on public.assignments (class_id, created_at desc);

-- Student's own attempts on assignments, newest first (My classes).
create index if not exists quiz_attempts_user_assignment_idx
  on public.quiz_attempts (user_id, created_at desc)
  where assignment_id is not null;

-- Class notes: Row-Level Security looks them up by class, and deleting a
-- class has to find them.
create index if not exists class_notes_class_idx
  on public.class_notes (class_id, book_id, chapter);

-- "Which classes do I co-teach?" is asked by owns_class() on almost every
-- request; the primary key only covers lookups that start with class_id.
create index if not exists class_teachers_user_idx
  on public.class_teachers (user_id);

-- A perek's notes for one user, newest first (the reader's "My note" panel).
-- Replaces user_notes_anchor_idx, which is the same index without updated_at.
create index if not exists user_notes_chapter_idx
  on public.user_notes (user_id, book_id, chapter, updated_at desc);
drop index if exists public.user_notes_anchor_idx;

-- Live games: finding the games / answers a student took part in, and
-- deleting an account.
create index if not exists live_players_user_idx  on public.live_players (user_id);
create index if not exists live_answers_user_idx  on public.live_answers (user_id);

-- Random quiz questions: random_quiz_questions() filters published questions
-- by quiz, book and perek, then by type.
create index if not exists quiz_questions_pick_idx
  on public.quiz_questions (quiz_key, book, chapter)
  where published;
create index if not exists quiz_questions_type_idx
  on public.quiz_questions (quiz_key, question_type)
  where published;

-- Verse / book references stored in arrays: "midrashim anchored to this
-- verse" and "places mentioned in this book".
create index if not exists midrashim_anchors_idx on public.midrashim using gin (anchors);
create index if not exists places_books_idx      on public.places     using gin (books);

analyze public.assignment_responses;
analyze public.user_notes;
analyze public.quiz_questions;

-- ============================================================
-- 2. BATCH FUNCTIONS  (one request instead of one per class)
-- ============================================================
-- My classes asked for each class's points table and live game separately.
-- These return the same rows for a list of classes at once, by calling the
-- existing single-class functions, so who may see what is unchanged.

create or replace function public.class_leaderboards(cids uuid[])
returns table (class_id uuid, nickname text, points integer, is_me boolean)
language sql stable security definer set search_path = public
as $$
  select c.cid, l.nickname, l.points, l.is_me
    from unnest(cids) as c(cid)
   cross join lateral public.class_leaderboard(c.cid) as l
   order by c.cid, l.points desc, l.nickname;
$$;
revoke all on function public.class_leaderboards(uuid[]) from public, anon;
grant execute on function public.class_leaderboards(uuid[]) to authenticated;

create or replace function public.active_live_games(cids uuid[])
returns table (class_id uuid, game_id uuid)
language sql stable security definer set search_path = public
as $$
  select c.cid, public.active_live_game(c.cid)
    from unnest(cids) as c(cid)
   where public.active_live_game(c.cid) is not null;
$$;
revoke all on function public.active_live_games(uuid[]) from public, anon;
grant execute on function public.active_live_games(uuid[]) to authenticated;
