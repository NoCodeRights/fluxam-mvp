const router = require('express').Router();
const lot = require('../controllers/lot.controller');
const authJWT = require('../middlewares/authJWT');
const roleCheck = require('../middlewares/roleCheck');

// Ahora super_admin también tiene permiso
router.post(
  '/',
  authJWT,
  roleCheck(['super_admin', 'operario', 'jefe_bodega']),
  lot.create
);

router.get(
  '/',
  authJWT,
  lot.list
);

router.patch(
  '/:id/use',
  authJWT,
  roleCheck(['super_admin', 'operario', 'jefe_bodega']),
  lot.use
);

router.patch(
  '/:id',
  authJWT,
  roleCheck(['super_admin', 'jefe_bodega', 'finanzas']),
  lot.update
);

module.exports = router;
