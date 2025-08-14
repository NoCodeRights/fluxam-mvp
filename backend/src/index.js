// backend/src/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://fluxam-mvp.vercel.app',
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origen no permitido por CORS: ${origin}`), false);
    },
    credentials: true,
  })
);

app.use(morgan('dev'));

// Conexión
const db = require('./db');
db.query('SELECT now() as now')
  .then(({ rows }) => console.log('🗄️ Conexión OK, hora:', rows[0].now))
  .catch((err) => console.error('❌ Error de conexión:', err));

// Prefijo /api
app.use('/api', (req, _res, next) => {
  req.url = req.url.replace(/^\/api/, '');
  next();
});

// Health
app.get('/health', (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));
app.get('/api/health', (_req, res) => res.json({ ok: true, now: new Date().toISOString() }));

// Helper para montar rutas con logs bonitos
function mount(path, modPath) {
  try {
    const r = require(modPath);
    app.use(path, r);
    console.log(`➡️  Mounted ${'/api' + path} from ${modPath}`);
  } catch (e) {
    if (String(e).includes('Cannot find module')) {
      console.log(`(info) Ruta ${path} omitida: no se encontró ${modPath}`);
    } else {
      console.log(`(error) Cargando ${modPath}: ${e}`);
    }
  }
}

mount('/auth', './routes/auth.routes');
mount('/users', './routes/users.routes');
mount('/products', './routes/products.routes');
mount('/lots', './routes/lots.routes');
mount('/costs', './routes/costs.routes');

// 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

const PORT = process.env.PORT || 4000;
console.log('📡 API prefix = /api');
console.log('🌐 CORS origin = https://fluxam-mvp.vercel.app');
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Backend en puerto ${PORT}`));
