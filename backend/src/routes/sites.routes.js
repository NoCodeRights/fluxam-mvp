const router = require('express').Router();
const site = require('../controllers/site.controller');
const authJWT = require('../middlewares/authJWT');
router.get('/', authJWT, site.list);
module.exports = router;
