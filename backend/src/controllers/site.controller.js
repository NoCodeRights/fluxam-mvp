const Site = require('../models/Site');
exports.list = async (req, res) => {
  const sites = await Site.findAllByCompany(req.user.company_id);
  res.json(sites);
};
