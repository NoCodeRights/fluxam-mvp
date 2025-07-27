const router = require('express').Router();
const cost = require('../controllers/cost.controller');
const authJWT = require('../middlewares/authJWT');
const roleCheck = require('../middlewares/roleCheck');

// Ahora super_admin también puede listar y crear
router.get(
  '/lot/:lot_id',
  authJWT,
  roleCheck(['super_admin','finanzas','director_nacional']),
  cost.list
);
router.post(
  '/lot/:lot_id',
  authJWT,
  roleCheck(['super_admin','finanzas']),
  cost.create
);

module.exports = router;
