const db = require('../config/database');
module.exports = {
  async create(data) {
    const { product_id, site_id, quantity, unit_type, manufacture_at, expiry_at, position } = data;
    const res = await db.query(
      `INSERT INTO lots
        (product_id, site_id, quantity, unit_type, manufacture_at, expiry_at, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [product_id, site_id, quantity, unit_type, manufacture_at, expiry_at, position]
    );
    return res.rows[0];
  },
  async list(company_id) {
    const res = await db.query(
      `SELECT l.*, p.code, p.name
       FROM lots l
       JOIN products p ON l.product_id = p.id
       WHERE p.company_id = $1 AND l.status='active'
       ORDER BY l.created_at DESC`,
      [company_id]
    );
    return res.rows;
  },
  async use(id, qty) {
    await db.query(
      `UPDATE lots SET quantity = quantity - $1
       WHERE id=$2`,
      [qty, id]
    );
    const res = await db.query(`SELECT * FROM lots WHERE id=$1`, [id]);
    return res.rows[0];
  },
  async update(id, fields) {
    const sets = [], vals = [], idx = 1;
    for (const [k, v] of Object.entries(fields)) {
      sets.push(`${k}=$${idx}`);
      vals.push(v);
      idx++;
    }
    vals.push(id);
    const res = await db.query(
      `UPDATE lots SET ${sets.join(',')}
       WHERE id=$${idx} RETURNING *`,
      vals
    );
    return res.rows[0];
  }
};
