const Transfer = require('../models/Transfer');
exports.create = async (req, res) => {
  const data = {
    from_site_id: req.user.site_id,
    to_site_id: req.body.to_site_id,
    requested_by: req.user.id
  };
  const t = await Transfer.create(data);
  res.status(201).json(t);
};
exports.list = async (req, res) => {
  const list = await Transfer.list(req.user.company_id);
  res.json(list);
};
exports.approve = async (req, res) => {
  const { action } = req.body; // 'approved' or 'rejected'
  const t = await Transfer.approve(req.params.id, req.user.id, action);
  res.json(t);
};
