// backend/src/routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { authRequired } = require('../middlewares/authJWT');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = (req.body || {});
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    const { rows } = await pool.query(
      'SELECT id, company_id, site_id, email, password, role FROM users WHERE email=$1 LIMIT 1',
      [email]
    );
    if (rows.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Credenciales inválidas' });

    const payload = { id: user.id, company_id: user.company_id, site_id: user.site_id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.json({ token, user: payload });
  } catch (e) {
    next(e);
  }
});

router.get('/me', authRequired, (req, res) => res.json({ user: req.user }));

module.exports = router;
