const router = require('express').Router();
const tf = require('../controllers/transfer.controller');
const authJWT = require('../middlewares/authJWT');
const roleCheck = require('../middlewares/roleCheck');
router.post('/', authJWT, roleCheck(['operario','jefe_bodega']), tf.create);
router.get('/', authJWT, tf.list);
router.patch('/:id/approve', authJWT, roleCheck(['finanzas','director_nacional']), tf.approve);
module.exports = router;
