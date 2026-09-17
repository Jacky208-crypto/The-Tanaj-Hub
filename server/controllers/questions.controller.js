// controllers/questions.controller.js
//
// The logic behind routes/questions.routes.js. index.js currently has this
// inlined directly in the route handler:
//   const result = await pool.query('SELECT * FROM questions WHERE book = $1', [book])
//   res.json(result.rows)
//
// Would hold, once routes/controllers/models are split apart:
//   - getByBook(req, res, next)  -> calls models/questions.model.js,
//                                   404 when a book has no rows
//   - getAll(req, res, next)     -> backs the future GET /api/questions
//   - create(req, res, next)     -> validates body against the shape
//                                   seed.js inserts (see quizData.js)
