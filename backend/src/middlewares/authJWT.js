// backend/src/middlewares/authJWT.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'cambia_esto_en_prod';

function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token requerido' });
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload; // { id, company_id, site_id, role, ... }
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function isSuperAdmin(req, res, next) {
  if (req.user && req.user.role === 'super_admin') return next();
  return res.status(403).json({ message: 'No autorizado' });
}

module.exports = { verifyToken, isSuperAdmin };
