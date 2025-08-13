// backend/src/routes/products.routes.js
const router = require('express').Router();
const {
  listProducts,
  createProduct,
  deleteProduct,
} = require('../controllers/products.controller');

const { requireAuth, allowRoles } = require('../middlewares/authJWT');

// Todas requieren estar autenticado
router.use(requireAuth);

// Listar
router.get('/', listProducts);

// Crear (solo roles permitidos)
router.post('/', allowRoles('jefe_bodega', 'super_admin'), createProduct);

// Eliminar (solo roles permitidos)
router.delete('/:id', allowRoles('jefe_bodega', 'super_admin'), deleteProduct);

module.exports = router;
