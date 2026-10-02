# supabase/ — database setup and site content

## SQL files (run in the dashboard: SQL Editor → New query → Run)

Run them in this order. Each is safe to run again.

1. `profiles_setup.sql` — a row per account.
2. `user_data_setup.sql` — per-user quiz scores and personal notes.
3. `content_setup.sql` — site content: `quizzes`, `quiz_questions`,
   `note_topics`, `note_entries`, `midrashim`, `places`, plus the `admins`
   table. Anyone can read published content; only admins can change it.
4. `submissions_setup.sql` — quiz questions suggested by visitors (see
   *Suggested questions* below).

## Site content

`content/*.json` holds every content table, one file per table, in the same
shape as the database rows. It's how content gets *into* the database and the
backup of what's in it.

**First time:**

1. Run `content_setup.sql`.
2. Add your secret key to `.env` (Dashboard → Project Settings → API Keys →
   secret key; older projects call it `service_role`):
   ```
   SUPABASE_SECRET_KEY=sb_secret_...
   ```
   Never give this key a `VITE_` prefix — that would publish it in the site.
3. `npm run import:content`
4. Make yourself admin (SQL Editor, with your email):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

**Editing:** log in to the site with an admin account and use the **Admin**
button on the home page (`/admin`) — forms for quiz questions, map places,
midrashim and study notes, with checks that catch mistakes before saving.
The Table Editor works too. Either way, changes are live immediately. Then run
`npm run export:content` and commit `supabase/content/` so git keeps a
history of every edit.

**Things to know while editing:**

- Every text field has `_en`, `_es` and `_he` columns. An empty `_es` / `_he`
  falls back to English.
- `quiz_questions.correct_index` is the position of the right answer
  (0 = first) in *all* three `options_*` lists, so keep the options in the
  same order in each language.
- `quiz_questions.chapter` is the perek a question is about. It's required
  for quizzes that cover one book (`QUIZ_CHAPTERS` in `src/data/books.js`) —
  players can pick perakim in "Create Custom Quiz" — and left empty for
  multi-book quizzes (Neviim Ajaronim, Ketuvim Poetry, Divre Hayamim).
- `published = false` hides a quiz, question, note or place from visitors
  (admins still see it). Midrashim use `status` (`draft` / `reviewed`) instead;
  run `npm run validate:midrash` before switching one to `reviewed`.
- New quiz questions can come in as drafts: `npm run add:questions -- file.json`
  (see the top of `scripts/add-quiz-drafts.mjs` for the file shape). They're
  added with `published = false` and listed under **Drafts to review** in
  /admin → Quiz questions; tick *Published* to make one live.
- `note_entries.table_*` is JSON: `{"headers": [...], "rows": [[...], ...]}`.
- `places.type` and `places.periods` must use the values in
  `src/data/places.js`; `places.books` uses the ids in `src/data/books.js`.

## Suggested questions

Signed-in visitors suggest questions on `/suggest` (the "Suggest a question"
button on the quiz page). They land in `question_submissions` as *pending*.

**Review:** /admin → **Suggestions**. *Accept → create question* opens the
question editor pre-filled with their text (add the other languages; English
is required). *Reject* sends nothing. Or run `npm run suggestions` and let
Claude write translated drafts linked to them (`submission_id` in the
`npm run add:questions` file).

**The email:** the database emails the visitor, in the language they used on
the site, the moment their accepted question is **published** — from the
editor, "Publish all", or the Table Editor. Each person is emailed once.

**Email setup (once), with Resend:**

1. Sign up at resend.com → *Domains* → add your domain and add the DNS
   records it shows at your domain registrar. Wait until it says *Verified*.
2. *API Keys* → create a key with "Sending access".
3. In the SQL Editor, run (with your values):
   ```sql
   select vault.create_secret('re_your_api_key', 'resend_api_key');
   select vault.create_secret('Tanaj Hub <noreply@yourdomain.com>', 'email_from');
   select vault.create_secret('https://yourdomain.com', 'site_url');
   ```
   To change one later: `select vault.update_secret(id, 'new value') from
   vault.secrets where name = 'email_from';`
4. Anything published before step 3 is emailed by running
   `select public.send_pending_submission_emails();`

Sends are queued through `pg_net`; if an email doesn't arrive, check
Resend's *Logs* page, or `select * from net._http_response order by created desc limit 5;`
