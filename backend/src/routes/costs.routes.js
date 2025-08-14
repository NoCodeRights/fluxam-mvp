// backend/src/routes/costs.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middlewares/authJWT');

// Ejemplo: desglose de costos por lote
router.get('/lot/:id', verifyToken, async (req, res) => {
  try {
    const { company_id } = req.user;
    const { id } = req.params;

    // Ajustar de ser necesario. Esto es un ejemplo simple
    const { rows } = await db.query(
      `SELECT id, lot_id, concept, amount, created_at
       FROM costs
       WHERE lot_id = $1 AND company_id = $2
       ORDER BY id DESC`,
      [id, company_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /costs/lot/:id error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
