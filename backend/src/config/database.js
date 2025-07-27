// Conexión y helper para consultas
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/fluxam_dev'
});
module.exports = {
  query: (text, params) => pool.query(text, params),
};
