// middleware/auth.js
//
// Would verify the Supabase access_token the frontend already holds
// (see loadSession()/saveSession() in src/lib/supabaseClient.js) when it's
// sent as `Authorization: Bearer <token>`, and attach the resolved user to
// req.user.
//
// Needed by any route that has to know WHO is asking — notes.routes.js and
// quizAttempts.routes.js, specifically. Right now that check happens for
// free via Supabase's Row-Level Security instead of custom middleware, since
// the client talks to Supabase directly.
//
// Would hold:
//   - pull the bearer token off req.headers.authorization
//   - verify it (Supabase JWT secret locally, or call GET /auth/v1/user like
//     supabaseClient.js's getUser() does)
//   - 401 if missing/invalid
//   - req.user = { id, email, ... }; next()
