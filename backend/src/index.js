// backend/src/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 4000;
const API_PREFIX = (process.env.API_PREFIX || '/api').replace(/\/$/, '');
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: FRONTEND_ORIGIN === '*' ? true : FRONTEND_ORIGIN, credentials: true }));

// DB check (safe)
const db = require('./db');
db.query('SELECT 1')
  .then(() => console.log('🗄️ DB OK'))
  .catch((e) => console.warn('⚠️ DB check failed (pero servidor seguirá arriba):', e.message || e));

// Health endpoints (expuestos con y sin API_PREFIX)
app.get('/', (_req, res) => res.send('FluxAm backend OK'));
app.get(`${API_PREFIX}/health`, (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// Helper para montar rutas y mostrar errores claros
function tryMount(mountPath, relModulePath) {
  const abs = path.join(__dirname, relModulePath);
  try {
    const router = require(abs);
    if (!router || typeof router !== 'function') {
      console.warn(`(warning) ${relModulePath} cargado pero no exporta un router (esperaba "module.exports = router"). Omitedo ${mountPath}`);
      return;
    }
    app.use(`${API_PREFIX}${mountPath}`, router);
    console.log(`➡️  Mounted ${API_PREFIX}${mountPath} from ${relModulePath}`);
  } catch (err) {
    console.warn(`(error) Cargando ${relModulePath}: ${err && err.message ? err.message : err}`);
  }
}

// Montamos rutas
tryMount('/auth', './routes/auth.routes');
tryMount('/users', './routes/users.routes');
tryMount('/products', './routes/products.routes');
tryMount('/lots', './routes/lots.routes');
tryMount('/costs', './routes/costs.routes');
tryMount('/alerts', './routes/alerts.routes'); // opcional (si no existe, se avisará y no fallará)

// Default 404 JSON (para facilitar debug)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err && err.stack ? err.stack : err);
  res.status(500).json({ message: 'Error interno' });
});

// Listen
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend en puerto ${PORT}`);
  console.log(`📡 API prefix = ${API_PREFIX}`);
  console.log(`🌐 CORS origin = ${FRONTEND_ORIGIN}`);
});
