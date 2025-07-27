const db = require('../config/database');
module.exports = {
  async autocomplete(company_id, q) {
    const res = await db.query(
      `SELECT id, code, name
       FROM products
       WHERE company_id=$1 AND LOWER(unaccent(name)) LIKE LOWER(unaccent($2))`,
      [company_id, `%${q}%`]
    );
    return res.rows;
  }
};
