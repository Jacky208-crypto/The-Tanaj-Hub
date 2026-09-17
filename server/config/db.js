// config/db.js
//
// Centralized Postgres connection pool.
//
// Right now this exact setup is duplicated in both index.js and seed.js —
// each file builds its own `new Pool({...})` from the same DB_* env vars.
// Pulling it out here would let every controller/model just do:
//   const pool = require('../config/db')
// instead of re-reading process.env and re-creating a pool per file.
//
// Would hold:
//   - const { Pool } = require('pg')
//   - require('dotenv').config()
//   - const pool = new Pool({
//       user: process.env.DB_USER,
//       host: process.env.DB_HOST,
//       database: process.env.DB_NAME,
//       password: process.env.DB_PASSWORD,
//       port: process.env.DB_PORT,
//     })
//   - the one-time `pool.query('SELECT NOW()', ...)` connection check index.js
//     already does, moved here so it only runs once
//   - module.exports = pool
//
// NOTE: this is a *separate* Postgres connection from Supabase's REST API
// (PostgREST) that src/lib/supabaseClient.js talks to for auth/notes/quiz
// attempts. If DB_HOST here points at the same Supabase project, both paths
// end up hitting the same database through two different doors — worth
// knowing before adding more tables on this side.
