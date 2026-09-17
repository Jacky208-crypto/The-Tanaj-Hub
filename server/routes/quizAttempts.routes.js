// routes/quizAttempts.routes.js
//
// Mirrors saveQuizAttempt() / getQuizAttempts() in src/lib/supabaseClient.js,
// which QuizPlayer.jsx / Quiz.jsx call directly against Supabase's
// PostgREST API today (POST/GET on the quiz_attempts table, scoped to the
// signed-in user by Supabase Row-Level Security). Note Quiz.jsx's
// useEffect that loads attempt history is currently commented out.
//
// Would hold, only if this ever moves off direct-to-Supabase:
//   POST /   -> save { quizLabel, score, total } for req.user.id
//   GET  /   -> this user's attempts, newest first
//
// Needs middleware/auth.js first, to know which user is asking — Supabase's
// JWT + RLS does that job automatically today.
