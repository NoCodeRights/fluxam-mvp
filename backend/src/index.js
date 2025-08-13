// backend/src/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// ====== ENV ======
const PORT = process.env.PORT || 4000;
const API_PREFIX = (process.env.API_PREFIX || '/api').replace(/\/?$/, ''); // asegura sin / final
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
const DATABASE_URL = process.env.DATABASE_URL;

// ====== CORS ======
app.use(cors({
  origin: FRONTEND_ORIGIN === '*' ? true : FRONTEND_ORIGIN,
  credentials: true,
}));

// ====== JSON ======
app.use(express.json());

// ====== DB (PG) ======
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL && DATABASE_URL.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : undefined,
});

(async () => {
  try {
    const { rows } = await pool.query('SELECT now() AS now');
    console.log('🗄️ Conexión OK, hora:', rows[0].now);
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  }
})();

// En caso de ser necesario, hacer el pool accesible
app.set('db', pool);

// ====== HEALTH ======
app.get('/', (_req, res) => res.send('OK'));
app.get(`${API_PREFIX}/healthz`, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT 1');
    return res.json({ ok: true, db: rows[0]['?column?'] === 1 });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

// ====== helper para montar rutas sin romper si no existen ======
function safeMount(relPath, mountPath) {
  try {
    const router = require(relPath);
    app.use(`${API_PREFIX}${mountPath}`, router);
    console.log(`➡️  Mounted ${API_PREFIX}${mountPath} from ${relPath}`);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.warn(`(info) Ruta ${mountPath} omitida: no se encontró ${relPath}`);
    } else {
      console.error(`(error) Cargando ${relPath}:`, e);
    }
  }
}

// ====== MONTAJE DE RUTAS BAJO /api ======
safeMount('./routes/auth.routes',     '/auth');
safeMount('./routes/users.routes',    '/users');
safeMount('./routes/products.routes', '/products');
safeMount('./routes/lots.routes',     '/lots');
safeMount('./routes/costs.routes',    '/costs');

// ====== /api/alerts (stub) ======
// Evita 404 en el widget de alertas. Luego lo reemplazamos por lógica real.
app.get(`${API_PREFIX}/alerts`, (_req, res) => {
  res.json([]); // por ahora, sin alertas
});

// ====== 404 JSON ======
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
  });
});

// ====== ERROR HANDLER ======
app.use((err, _req, res, _next) => {
  console.error('💥 Error:', err);
  res.status(500).json({ message: 'Error interno' });
});

// ====== LISTEN ======
app.listen(PORT, () => {
  console.log(`🚀 Backend en puerto ${PORT}`);
  console.log(`📡 API prefix = ${API_PREFIX}`);
  console.log(`🌐 CORS origin = ${FRONTEND_ORIGIN}`);
});
