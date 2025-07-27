const router = require('express').Router();
const userCtrl = require('../controllers/user.controller');
const authJWT = require('../middlewares/authJWT');
const roleCheck = require('../middlewares/roleCheck');
router.post('/', authJWT, roleCheck(['super_admin']), userCtrl.create);
module.exports = router;
