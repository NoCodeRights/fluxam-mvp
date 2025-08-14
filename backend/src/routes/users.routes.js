// backend/src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isSuperAdmin } = require('../middlewares/authJWT');
const bcrypt = require('bcryptjs');

// Crear usuario (solo super_admin)
router.post('/', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { company_id, site_id } = req.user;
    const { email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (company_id, site_id, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role`,
      [company_id, site_id, email, hash, role]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST /users error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Listar usuarios (solo super_admin)
router.get('/', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { company_id } = req.user;
    const { rows } = await db.query(
      `SELECT id, email, role
       FROM users
       WHERE company_id = $1
       ORDER BY id DESC`,
      [company_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('GET /users error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
