const { Pool } = require('pg')
const { quizzes } = require('./quizData')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tanaj_hub',
  password: 'jackyf',
  port: 5432,
})

async function seed() {
  for (const [book, data] of Object.entries(quizzes)) {
    for (const q of data.questions) {
      await pool.query(
        `INSERT INTO questions 
        (book, question, question_sp, question_he, options, options_sp, options_he, correct, correct_sp, correct_he)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          book,
          q.question,
          q.questionSp,
          q.questionHe,
          q.options,
          q.optionsSp,
          q.optionsHe,
          q.correct,
          q.correctSp,
          q.correctHe,
        ]
      )
    }
    console.log(`✅ Inserted questions for ${book}`)
  }

  console.log('🎉 All questions seeded!')
  pool.end()
}

seed()