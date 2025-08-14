// backend/src/db.js
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ ERROR: falta DATABASE_URL en variables de entorno');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  // Neon/Railway friendly
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
