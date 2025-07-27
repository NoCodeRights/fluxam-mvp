const db = require('../config/database');
module.exports = {
  async findById(id) {
    const res = await db.query(
      `SELECT id, legal_name, display_name, primary_color, logo_url
       FROM companies WHERE id=$1`, [id]
    );
    return res.rows[0];
  }
};
