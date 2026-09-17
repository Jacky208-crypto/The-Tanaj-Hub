// models/notes.model.js
//
// Data-access layer for the user_notes table (id, user_id, title, body,
// created_at, updated_at) — the same table Notes.jsx reads/writes via
// Supabase's PostgREST API today.
//
// Would hold:
//   - findByUser(userId)
//   - create(userId, { title, body })
//   - update(id, userId, { title, body })
//   - remove(id, userId)
