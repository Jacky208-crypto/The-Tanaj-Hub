// routes/auth.routes.js
//
// Mirrors src/lib/supabaseClient.js's signUp/signIn/signInWithGoogle/
// refresh/signOut, which call Supabase's GoTrue Auth REST API directly from
// the browser (see AuthContext.jsx). There's no real need to duplicate that
// here unless the goal becomes hiding the Supabase anon key from the client,
// rate-limiting login attempts, or adding app-specific logic around signup
// (e.g. a welcome email).
//
// Would hold, only if proxying auth server-side becomes worth it:
//   POST /signup
//   POST /signin
//   POST /refresh
//   POST /signout
//   GET  /google  -> redirect into Supabase's OAuth flow
