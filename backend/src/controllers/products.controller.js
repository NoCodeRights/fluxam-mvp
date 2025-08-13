// backend/src/controllers/products.controller.js
const pool = require('../db');

// GET /api/products
exports.listProducts = async (req, res) => {
  try {
    const companyId = req.user?.company_id;
    // Si no se usa multi-tenant, se puede omitir el WHERE
    const { rows } = await pool.query(
      `SELECT id, code, name, unit_weight, has_expiry
         FROM products
        WHERE ($1::int IS NULL OR company_id = $1)
        ORDER BY id DESC`,
      [companyId || null]
    );
    res.json(rows);
  } catch (e) {
    console.error('listProducts error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const companyId = req.user?.company_id || null;
    const siteId = req.user?.site_id || null;

    const { code, name, unit_weight, has_expiry } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO products (company_id, site_id, code, name, unit_weight, has_expiry)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, code, name, unit_weight, has_expiry`,
      [companyId, siteId, code, name, unit_weight, !!has_expiry]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('createProduct error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const companyId = req.user?.company_id || null;
    const id = parseInt(req.params.id, 10);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const { rows } = await pool.query(
      `DELETE FROM products
        WHERE id = $1
          AND ($2::int IS NULL OR company_id = $2)
       RETURNING id`,
      [id, companyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ ok: true, id: rows[0].id });
  } catch (e) {
    console.error('deleteProduct error:', e);
    res.status(500).json({ message: 'Error interno' });
  }
};
