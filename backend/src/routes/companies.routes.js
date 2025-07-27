const router = require('express').Router();
const comp = require('../controllers/company.controller');
const authJWT = require('../middlewares/authJWT');
router.get('/:id', authJWT, comp.getById);
module.exports = router;
