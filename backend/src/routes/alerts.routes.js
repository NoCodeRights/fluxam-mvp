const router = require('express').Router();
const authJWT = require('../middlewares/authJWT');
const alertCtrl = require('../controllers/alert.controller');

router.get('/', authJWT, alertCtrl.getAlerts);

module.exports = router;
