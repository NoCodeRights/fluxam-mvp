const CostItem = require('../models/CostItem');
exports.list = async (req, res) => {
  const items = await CostItem.listByLot(req.params.lot_id);
  res.json(items);
};
exports.create = async (req, res) => {
  const data = { lot_id: req.params.lot_id, ...req.body };
  const item = await CostItem.create(data);
  res.status(201).json(item);
};
