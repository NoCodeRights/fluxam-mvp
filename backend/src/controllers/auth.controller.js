const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });
  const token = jwt.sign({
    id: user.id,
    company_id: user.company_id,
    site_id: user.site_id,
    role: user.role
  }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
};
