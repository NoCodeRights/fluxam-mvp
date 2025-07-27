const db = require('../config/database');

exports.autocomplete = async (req, res) => {
  const q = req.query.q || '';
  const products = await db.query(
    `SELECT id, code, name, unit_weight, has_expiry
     FROM products
     WHERE company_id=$1 AND LOWER(name) LIKE LOWER($2)
     ORDER BY name`,
    [req.user.company_id, `%${q}%`]
  );
  res.json(products.rows);
};

exports.create = async (req, res) => {
  const { code, name, unit_weight, has_expiry } = req.body;
  const result = await db.query(
    `INSERT INTO products 
      (company_id, code, name, unit_weight, has_expiry)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [req.user.company_id, code, name, unit_weight, has_expiry]
  );
  res.status(201).json(result.rows[0]);
};
