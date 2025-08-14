// backend/src/db.js
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ Falta DATABASE_URL en las variables de entorno');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Neon/Railway
});

module.exports = { pool };
