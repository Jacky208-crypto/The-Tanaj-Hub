// controllers/quizAttempts.controller.js
//
// Would hold the same logic saveQuizAttempt() / getQuizAttempts() in
// src/lib/supabaseClient.js perform against Supabase directly today:
//   - create(req, res, next)  -> insert { user_id: req.user.id, quiz_label, score, total }
//   - list(req, res, next)    -> select * where user_id = req.user.id, order by created_at desc
//
// req.user would come from middleware/auth.js.
