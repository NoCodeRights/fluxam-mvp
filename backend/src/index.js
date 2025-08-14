// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { pool } = require('./db');

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const lotsRoutes = require('./routes/lots.routes');
const alertsRoutes = require('./routes/alerts.routes');

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Healthchecks
app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => res.send('FluxAm API is running'));

// API prefix
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/lots', lotsRoutes);
app.use('/api/alerts', alertsRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Uncaught error:', err);
  res.status(500).json({ message: 'Error interno' });
});

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`🚀 Backend en puerto ${port}`);
  try {
    const { rows } = await pool.query('SELECT NOW() as now');
    console.log('🗄️ Conexión OK, hora:', rows[0].now);
  } catch (e) {
    console.error('❌ Error DB', e);
  }
});

module.exports = app;
