// controllers/auth.controller.js
//
// Would hold server-side equivalents of signUp/signIn/signInWithGoogle/
// refresh/signOut from src/lib/supabaseClient.js — i.e. this server calling
// Supabase's GoTrue REST API on the client's behalf instead of the browser
// calling it directly. Only worth building if there's a reason to not trust
// the browser with the Supabase anon key, or to add logic around auth
// (rate limits, welcome emails, logging signups).
