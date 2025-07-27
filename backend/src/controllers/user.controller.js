const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.create = async (req, res) => {
  const { company_id, site_id, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ company_id, site_id, email, password: hash, role });
  res.status(201).json(newUser);
};
