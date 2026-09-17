// controllers/notes.controller.js
//
// Would hold the same logic getUserNotes()/createUserNote()/
// updateUserNote()/deleteUserNote() in src/lib/supabaseClient.js perform
// against Supabase directly today, called from src/pages/Notes.jsx:
//   - list(req, res, next)    -> notes for req.user.id, newest-updated first
//   - create(req, res, next)  -> { title, body }
//   - update(req, res, next)  -> { title, body } for :id, checking it belongs
//                                 to req.user.id (Supabase RLS does this for
//                                 free today; a plain pg query would not)
//   - remove(req, res, next)  -> delete :id, same ownership check
