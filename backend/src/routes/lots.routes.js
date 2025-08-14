// backend/src/routes/lots.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middlewares/authJWT');

// Listar lotes de la empresa (un join simple para traer nombre de producto)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { company_id } = req.user;
    const { rows } = await db.query(
      `SELECT l.id, l.product_id, l.quantity, l.expiry_date, l.note,
              p.code AS product_code, p.name AS product_name
       FROM lots l
       JOIN products p ON p.id = l.product_id
       WHERE l.company_id = $1
       ORDER BY l.id DESC`,
      [company_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /lots error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Crear lote
router.post('/', verifyToken, async (req, res) => {
  try {
    const { company_id, site_id } = req.user;
    const { product_id, quantity, expiry_date, note } = req.body;

    const { rows } = await db.query(
      `INSERT INTO lots (company_id, site_id, product_id, quantity, expiry_date, note)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, product_id, quantity, expiry_date, note`,
      [company_id, site_id, product_id, quantity, expiry_date || null, note || null]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST /lots error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
