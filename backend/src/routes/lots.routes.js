const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middlewares/authJWT');

router.get('/', verifyToken, async (req, res) => {
  try {
    const company_id = req.user?.company_id;
    const { rows } = await db.query(
      `SELECT l.id, l.product_id, l.quantity, l.expiry_date, p.name as product_name
       FROM lots l JOIN products p ON p.id = l.product_id
       WHERE l.company_id = $1 ORDER BY l.id DESC`, [company_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /lots error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const company_id = req.user?.company_id;
    const { product_id, quantity, expiry_date } = req.body;
    if (!product_id || quantity == null) return res.status(400).json({ message: 'product_id y quantity requeridos' });

    const { rows } = await db.query(
      `INSERT INTO lots (company_id, product_id, quantity, expiry_date)
       VALUES ($1,$2,$3,$4) RETURNING id, product_id, quantity, expiry_date`,
      [company_id, product_id, quantity, expiry_date ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST /lots error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
