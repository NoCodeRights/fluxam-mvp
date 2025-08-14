// backend/src/routes/lots.routes.js
const express = require('express');
const { pool } = require('../db');
const { authRequired, mustRoles } = require('../middlewares/authJWT');

const router = express.Router();

// Listar lotes (con nombre/código del producto)
router.get('/', authRequired, async (req, res, next) => {
  try {
    const { company_id } = req.user;
    const { rows } = await pool.query(
      `SELECT l.id, l.product_id, l.quantity, l.expiry_date,
              p.name as product_name, p.code
       FROM lots l
       JOIN products p ON p.id = l.product_id
       WHERE p.company_id=$1
       ORDER BY l.id DESC`,
      [company_id]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Crear lote
router.post('/', authRequired, mustRoles('super_admin', 'jefe_bodega'), async (req, res, next) => {
  try {
    const { product_id, quantity, expiry_date } = req.body || {};
    if (!product_id || quantity == null) {
      return res.status(400).json({ message: 'product_id y quantity son requeridos' });
    }

    const { rows } = await pool.query(
      `INSERT INTO lots (product_id, quantity, expiry_date)
       VALUES ($1,$2,$3)
       RETURNING id, product_id, quantity, expiry_date`,
      [product_id, quantity, expiry_date ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Usar stock de un lote (permite negativo de momento)
router.post('/:id/use', authRequired, mustRoles('super_admin', 'jefe_bodega'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body || {};
    if (!amount || amount <= 0) return res.status(400).json({ message: 'amount > 0 requerido' });

    const { rows } = await pool.query(
      `UPDATE lots SET quantity = quantity - $1 WHERE id=$2
       RETURNING id, product_id, quantity, expiry_date`,
      [amount, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Lote no encontrado' });

    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
