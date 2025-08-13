// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS: ajusta el origen del frontend en producción
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: false }));

app.use(express.json());

// Healthcheck
app.get('/healthz', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Routers
const productsRouter = require('./routes/products.routes');
// (si hay más routers, importar y montar aquí)
app.use('/api/products', productsRouter);

// Arranque
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`🚀 Backend en puerto ${PORT}`);

  // Comprobación de DB opcional
  try {
    const pool = require('./db'); // ajustar si archivo/exports difiere
    const { rows } = await pool.query('SELECT NOW() as now');
    console.log('🗄️ Conexión OK, hora:', rows[0]);
  } catch (e) {
    console.error('❌ Error de conexión:', e);
  }
});
