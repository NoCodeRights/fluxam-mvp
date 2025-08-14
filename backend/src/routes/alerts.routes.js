// backend/src/routes/alerts.routes.js
const express = require('express');
const { pool } = require('../db');
const { authRequired } = require('../middlewares/authJWT');

const router = express.Router();

// Alertas básicas: stock negativo y vencimiento próximo (7 días)
router.get('/', authRequired, async (req, res, next) => {
  try {
    const { company_id } = req.user;

    const { rows: neg } = await pool.query(
      `SELECT l.id, p.name, l.quantity
       FROM lots l JOIN products p ON p.id=l.product_id
       WHERE p.company_id=$1 AND l.quantity < 0`,
      [company_id]
    );

    const { rows: exp } = await pool.query(
      `SELECT l.id, p.name, l.expiry_date
       FROM lots l JOIN products p ON p.id=l.product_id
       WHERE p.company_id=$1
         AND l.expiry_date IS NOT NULL
         AND l.expiry_date <= (NOW() + INTERVAL '7 days')`,
      [company_id]
    );

    const alerts = [
      ...neg.map(n => ({
        type: 'stock_negative',
        message: `Stock negativo en ${n.name} (lote #${n.id}): ${n.quantity}`,
      })),
      ...exp.map(e => ({
        type: 'expiry_soon',
        message: `Lote por vencer de ${e.name}: ${new Date(e.expiry_date).toISOString().slice(0, 10)}`,
      })),
    ];

    res.json(alerts);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
