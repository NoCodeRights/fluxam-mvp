const db = require('../config/database');
module.exports = {
  async create({ company_id, site_id, email, password, role }) {
    const res = await db.query(
      `INSERT INTO users (company_id, site_id, email, password, role)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [company_id, site_id, email, password, role]
    );
    return res.rows[0];
  },
  async findByEmail(email) {
    const res = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    return res.rows[0];
  },
  async findById(id) {
    const res = await db.query(`SELECT id, company_id, site_id, email, role FROM users WHERE id=$1`, [id]);
    return res.rows[0];
  }
};
