const db = require('../config/database');
module.exports = {
  async listByLot(lot_id) {
    const res = await db.query(
      `SELECT * FROM cost_items WHERE lot_id=$1`,
      [lot_id]
    );
    return res.rows;
  },
  async create({ lot_id, type, description, amount }) {
    const res = await db.query(
      `INSERT INTO cost_items (lot_id, type, description, amount)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [lot_id, type, description, amount]
    );
    return res.rows[0];
  }
};
