// backend/src/middlewares/authJWT.js
const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, company_id, site_id, role }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function mustRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No auth' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { authRequired, mustRoles };
