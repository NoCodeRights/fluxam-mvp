// backend/src/routes/products.routes.js
const express = require('express');
const { pool } = require('../db');
const { authRequired, mustRoles } = require('../middlewares/authJWT');

const router = express.Router();

// Lista de productos (scoping por company_id)
router.get('/', authRequired, async (req, res, next) => {
  try {
    const { company_id } = req.user;
    const { rows } = await pool.query(
      'SELECT id, code, name, unit_weight, has_expiry FROM products WHERE company_id=$1 ORDER BY id DESC',
      [company_id]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Crear producto
router.post('/', authRequired, mustRoles('super_admin', 'jefe_bodega'), async (req, res, next) => {
  try {
    const { code, name, unit_weight, has_expiry } = req.body || {};
    const { company_id } = req.user;

    if (!code || !name) {
      return res.status(400).json({ message: 'code y name son requeridos' });
    }

    const { rows } = await pool.query(
      `INSERT INTO products (company_id, code, name, unit_weight, has_expiry)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, code, name, unit_weight, has_expiry`,
      [company_id, code, name, unit_weight ?? null, has_expiry ?? false]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Eliminar producto
router.delete('/:id', authRequired, mustRoles('super_admin', 'jefe_bodega'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_id } = req.user;

    const result = await pool.query('DELETE FROM products WHERE id=$1 AND company_id=$2', [id, company_id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
