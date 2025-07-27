const Lot = require('../models/Lot');
exports.create = async (req, res) => {
  const data = { ...req.body, site_id: req.user.site_id };
  const lot = await Lot.create(data);
  res.status(201).json(lot);
};
exports.list = async (req, res) => {
  const lots = await Lot.list(req.user.company_id);
  res.json(lots);
};
exports.use = async (req, res) => {
  const { quantity } = req.body;
  const lot = await Lot.use(req.params.id, quantity);
  res.json(lot);
};
exports.update = async (req, res) => {
  const lot = await Lot.update(req.params.id, req.body);
  res.json(lot);
};
