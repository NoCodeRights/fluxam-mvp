const db = require('../config/database');
module.exports = {
  async findAllByCompany(company_id) {
    const res = await db.query(
      `SELECT * FROM sites WHERE company_id=$1`, [company_id]
    );
    return res.rows;
  }
};
