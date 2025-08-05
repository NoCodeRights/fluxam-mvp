const pool = require('../config/database');

// Listar todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error cargando productos:', err);
    res.status(500).json({ message: 'Error interno cargando productos' });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  const { code, name, unit_weight, has_expiry } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (code, name, unit_weight, has_expiry)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [code, name, unit_weight, has_expiry]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando producto:', err);
    res.status(500).json({ message: 'Error interno creando producto' });
  }
};

// Eliminar un producto por ID
exports.deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ message: 'Error interno al eliminar producto' });
  }
};
