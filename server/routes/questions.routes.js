// routes/questions.routes.js
//
// Already half-live: index.js has GET /api/questions/:book written inline.
// This is where that route (and any siblings) would move to once the server
// outgrows a single file.
//
// Matches the `questions` Postgres table seed.js fills from
// server/quizData.js — columns: book, question, question_sp, question_he,
// options, options_sp, options_he, correct, correct_sp, correct_he.
//
// Would hold:
//   GET  /:book  -> all questions for one book (the existing route, moved here)
//   GET  /       -> every question, grouped by book — Quiz.jsx currently gets
//                   this by importing src/data/quizData.js directly into the
//                   bundle instead; this route would let it fetch from the
//                   DB on demand instead of shipping every question in the JS bundle
//   POST /       -> add a question — would need some notion of "admin", which
//                   nothing in the app has yet (no roles/permissions anywhere)
