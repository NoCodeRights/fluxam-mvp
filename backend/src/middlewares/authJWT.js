// backend/src/middlewares/authJWT.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'change-me';

function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, SECRET);
    // Esperamos payload como { id, company_id, site_id, role, ... }
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function isSuperAdmin(req, res, next) {
  if (req.user && req.user.role === 'super_admin') return next();
  return res.status(403).json({ message: 'No autorizado' });
}

module.exports = { verifyToken, isSuperAdmin };
