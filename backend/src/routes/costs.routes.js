const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middlewares/authJWT');

router.get('/lot/:id', verifyToken, async (req, res) => {
  try {
    const company_id = req.user?.company_id;
    const lotId = req.params.id;
    const { rows } = await db.query(
      `SELECT id, lot_id, concept, amount FROM costs WHERE lot_id=$1 AND company_id=$2 ORDER BY id DESC`,
      [lotId, company_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /costs/lot/:id error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
