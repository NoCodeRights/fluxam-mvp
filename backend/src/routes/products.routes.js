const router = require('express').Router();
const authJWT = require('../middlewares/authJWT');
const roleCheck = require('../middlewares/roleCheck');
const prod = require('../controllers/product.controller');

router.get('/', authJWT, prod.autocomplete);
// Sólo jefe_bodega y super_admin pueden crear
router.post('/', authJWT, roleCheck(['jefe_bodega','super_admin']), prod.create);

module.exports = router;
