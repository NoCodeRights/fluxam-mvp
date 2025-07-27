const Company = require('../models/Company');
exports.getById = async (req, res) => {
  const company = await Company.findById(req.user.company_id);
  res.json(company);
};
