const db = require('../config/database');
module.exports = {
  async create({ from_site_id, to_site_id, requested_by }) {
    const res = await db.query(
      `INSERT INTO transfers
        (from_site_id, to_site_id, requested_by)
       VALUES ($1,$2,$3) RETURNING *`,
      [from_site_id, to_site_id, requested_by]
    );
    return res.rows[0];
  },
  async list(company_id) {
    const res = await db.query(
      `SELECT t.*, u.email as requester
       FROM transfers t
       JOIN users u ON t.requested_by=u.id
       JOIN sites s ON t.from_site_id=s.id
       WHERE s.company_id=$1
       ORDER BY t.requested_at DESC`,
      [company_id]
    );
    return res.rows;
  },
  async approve(id, approved_by, status) {
    const res = await db.query(
      `UPDATE transfers
       SET approved_by=$1, status=$2, approved_at=NOW()
       WHERE id=$3 RETURNING *`,
      [approved_by, status, id]
    );
    return res.rows[0];
  }
};
