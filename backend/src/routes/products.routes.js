// Si usas CommonJS:
const express = require('express');
const {
  getAllProducts,
  createProduct,
  deleteProductById
} = require('../controllers/products.controller');
const { verifyToken } = require('../middlewares/authJWT');

const router = express.Router();

// Obtener todos los productos
router.get('/', verifyToken, getAllProducts);

// Crear un producto
router.post('/', verifyToken, createProduct);

// Eliminar un producto por ID
router.delete('/:id', verifyToken, deleteProductById);

module.exports = router;
