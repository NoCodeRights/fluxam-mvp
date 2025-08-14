// backend/src/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// === Middlewares base ===
app.use(express.json());

// CORS: aquí se pueden ajustar los orígenes permitidos si se quiere ser más estricto
const allowedOrigins = [
  'http://localhost:5173',
  'https://fluxam-mvp.vercel.app',
];
app.use(
  cors({
    origin: (origin, cb) => {
      // Permitir requests de herramientas/SSR sin origin
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      // Si se quiere permitir todo, descomentar lo siguiente y comentar el error:
      // return cb(null, true);
      const msg = `Origen no permitido por CORS: ${origin}`;
      return cb(new Error(msg), false);
    },
    credentials: true,
  })
);

app.use(morgan('dev'));

// === Conexión a DB (opcional: log de verificación) ===
const db = require('./db'); // debe exportar db.query(...)
db.query('SELECT now() as now')
  .then(({ rows }) => {
    console.log('🗄️ Conexión OK, hora:', rows[0].now);
  })
  .catch((err) => {
    console.error('❌ Error de conexión:', err);
  });

// === Adaptador de prefijo /api ===
// Esto permite que el frontend use /api/... y que internamente
// el backend resuelva las rutas existentes sin /api (p.ej. /products)
app.use('/api', (req, _res, next) => {
  req.url = req.url.replace(/^\/api/, '');
  next();
});

// === Healthchecks (con y sin /api) ===
app.get('/health', (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// === Router existentes ===

try {
  app.use('/auth', require('./routes/auth.routes'));
} catch (_) {
  console.warn('⚠️  /routes/auth.routes no encontrado (ignorado)');
}
try {
  app.use('/users', require('./routes/users.routes'));
} catch (_) {
  console.warn('⚠️  /routes/users.routes no encontrado (ignorado)');
}
try {
  app.use('/products', require('./routes/products.routes'));
} catch (_) {
  console.warn('⚠️  /routes/products.routes no encontrado (ignorado)');
}
try {
  app.use('/lots', require('./routes/lots.routes'));
} catch (_) {
  console.warn('⚠️  /routes/lots.routes no encontrado (ignorado)');
}
// Agregar aquí otros routers que ya se tengan montados sin /api,
// por ejemplo:
// try { app.use('/costs', require('./routes/costs.routes')); } catch (_) { console.warn('⚠️ /routes/costs.routes no encontrado (ignorado)'); }

// === 404 final (con JSON) ===
app.use((req, res) => {
  res.status(404).json({ message: `Not Found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend en puerto ${PORT}`);
});
