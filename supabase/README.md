# supabase/ — database setup and site content

## SQL files (run in the dashboard: SQL Editor → New query → Run)

Run them in this order. Each is safe to run again.

1. `profiles_setup.sql` — a row per account.
2. `user_data_setup.sql` — per-user quiz scores and personal notes.
3. `content_setup.sql` — site content: `quizzes`, `quiz_questions`,
   `note_topics`, `note_entries`, `midrashim`, `places`, plus the `admins`
   table. Anyone can read published content; only admins can change it.

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
- `published = false` hides a quiz, question, note or place from visitors
  (admins still see it). Midrashim use `status` (`draft` / `reviewed`) instead;
  run `npm run validate:midrash` before switching one to `reviewed`.
- `note_entries.table_*` is JSON: `{"headers": [...], "rows": [[...], ...]}`.
- `places.type` and `places.periods` must use the values in
  `src/data/places.js`; `places.books` uses the ids in `src/data/books.js`.
