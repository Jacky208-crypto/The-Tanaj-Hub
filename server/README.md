# server/ — backend notes

## What's actually running today
- `index.js` — Express + pg, one route: `GET /api/questions/:book`. It is
  **not called by the React app** — quiz questions now come from the Supabase
  `quiz_questions` table (see `supabase/README.md`), and the
  `getQuizAttempts()` call in Quiz.jsx is commented out.
- `quizData.js` / `seed.js` — an old one-time script that loaded a copy of
  the questions into a `questions` table this server queries. Superseded by
  `npm run import:content` at the repo root.

## What the React app actually talks to right now
- **Auth, quiz attempts, notes** → Supabase directly, from the browser
  (`src/lib/supabaseClient.js`: GoTrue Auth REST + PostgREST), protected by
  Supabase Row-Level Security. No Node server involved.
- **Site content** (quiz questions, study notes, midrashim, map places) →
  Supabase directly too (`src/lib/content.js`).
- **Bible text + search** → Sefaria's and Bolls' public APIs, fetched
  straight from the browser (`ChapterReader.jsx`, `src/lib/tanajSearch.js`).
- **Map** → places from Supabase; map tiles from OpenStreetMap / OpenTopoMap / Esri.

## The stub files added in this folder
`config/`, `middleware/`, `routes/`, `controllers/`, `models/` — every file
in them is empty except a comment block describing what it would contain,
tied to the specific React feature it would back. Nothing here is wired
into `index.js`; it's a map of where things *would* go if any of the above
ever moves off direct-Supabase/direct-Sefaria calls and onto this server —
for example to hide API keys, to cache the Tanakh text once instead of every
visitor re-downloading it, or to give the `questions` route some siblings
now that there's an obvious pattern for it.
