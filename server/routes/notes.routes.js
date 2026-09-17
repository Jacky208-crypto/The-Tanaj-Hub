// routes/notes.routes.js
//
// Mirrors getUserNotes() / createUserNote() / updateUserNote() /
// deleteUserNote() in src/lib/supabaseClient.js, used by src/pages/Notes.jsx
// for full CRUD on the user_notes table (title, body, updated_at) —
// currently all client -> Supabase PostgREST directly, protected by
// Row-Level Security.
//
// Would hold, only if this ever moves off direct-to-Supabase:
//   GET    /      -> this user's notes, newest-updated first
//   POST   /      -> create { title, body }
//   PATCH  /:id   -> update { title, body }
//   DELETE /:id   -> delete a note
//
// Needs middleware/auth.js to identify req.user.id the way Supabase's JWT +
// RLS does automatically today.
