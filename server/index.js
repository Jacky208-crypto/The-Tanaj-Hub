const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tanaj_hub',
  password: 'jackyf',
  port: 5432,
})

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Database connection error:', err)
  } else {
    console.log('Database connected at:', res.rows[0].now)
  }
})

// Get questions by book
app.get('/api/questions/:book', async (req, res) => {
  try {
    const { book } = req.params
    const result = await pool.query(
      'SELECT * FROM questions WHERE book = $1',
      [book]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.listen(3001, () => console.log('Server on port 3001'))