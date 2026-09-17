// routes/index.js
//
// Would be the single place that wires every route file into the app:
//
//   const router = require('express').Router()
//   router.use('/questions', require('./questions.routes'))
//   router.use('/quiz-attempts', require('./quizAttempts.routes'))
//   router.use('/notes', require('./notes.routes'))
//   router.use('/auth', require('./auth.routes'))
//   router.use('/search', require('./search.routes'))
//   module.exports = router
//
// index.js would then just do `app.use('/api', require('./routes'))`
// instead of defining `app.get('/api/questions/:book', ...)` inline the way
// it does today.
