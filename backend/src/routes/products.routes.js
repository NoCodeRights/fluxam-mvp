// backend/src/routes/products.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middlewares/authJWT');

// Lista de productos de la empresa del usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    const { company_id } = req.user;
    const { rows } = await db.query(
      `SELECT id, code, name, unit_weight, has_expiry
       FROM products
       WHERE company_id = $1
       ORDER BY id DESC`,
      [company_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /products error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Crear producto
router.post('/', verifyToken, async (req, res) => {
  try {
    const { company_id, site_id } = req.user;
    const { code, name, unit_weight, has_expiry } = req.body;

    const { rows } = await db.query(
      `INSERT INTO products (company_id, site_id, code, name, unit_weight, has_expiry)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, code, name, unit_weight, has_expiry`,
      [company_id, site_id, code, name, unit_weight, !!has_expiry]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST /products error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Eliminar producto por id (scoped por company_id)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { company_id } = req.user;
    const { id } = req.params;

    const { rowCount } = await db.query(
      `DELETE FROM products
       WHERE id = $1 AND company_id = $2`,
      [id, company_id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('DELETE /products/:id error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
