// models/questions.model.js
//
// Data-access layer for the `questions` table (book, question, question_sp,
// question_he, options, options_sp, options_he, correct, correct_sp,
// correct_he) — the same table seed.js fills from server/quizData.js.
//
// Would hold:
//   - findByBook(book)
//   - findAll()
//   - insert(question)  -> used by a rewritten seed.js, and/or an admin POST route
