# server/ — backend notes

## What's actually running today
- `index.js` — Express + pg, one route: `GET /api/questions/:book`. It is
  **not currently called by the React app** — Quiz.jsx imports questions
  straight from `src/data/quizData.js` instead, and the `getQuizAttempts()`
  call in Quiz.jsx is commented out.
- `quizData.js` / `seed.js` — a one-time script that loads those same
  questions into the `questions` Postgres table this server queries.

## What the React app actually talks to right now
- **Auth, quiz attempts, notes** → Supabase directly, from the browser
  (`src/lib/supabaseClient.js`: GoTrue Auth REST + PostgREST), protected by
  Supabase Row-Level Security. No Node server involved.
- **Bible text + search** → Sefaria's and Bolls' public APIs, fetched
  straight from the browser (`ChapterReader.jsx`, `src/lib/tanajSearch.js`).
- **Map** → static local data (`src/data/places.js`), no network calls.

## The stub files added in this folder
`config/`, `middleware/`, `routes/`, `controllers/`, `models/` — every file
in them is empty except a comment block describing what it would contain,
tied to the specific React feature it would back. Nothing here is wired
into `index.js`; it's a map of where things *would* go if any of the above
ever moves off direct-Supabase/direct-Sefaria calls and onto this server —
for example to hide API keys, to cache the Tanakh text once instead of every
visitor re-downloading it, or to give the `questions` route some siblings
now that there's an obvious pattern for it.
