const express = require('express');
const router = express.Router();
const { query } = require('../lib/db');

// GET all cooperatives
router.get('/', async (req, res) => {
  try {
    const result = await query("SELECT * FROM cooperatives");
    const processed = result.rows.map(c => ({
      ...c,
      boardRows: JSON.parse(c.boardrows || '[]'),
      staffRows: JSON.parse(c.staffrows || '[]'),
      committeeRows: JSON.parse(c.committeerows || '[]')
    }));
    res.json(processed);
  } catch (err) {
    console.error('Error fetching cooperatives:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST/UPDATE cooperative
router.post('/', async (req, res) => {
  const c = req.body;
  const data = [
    c.name, c.type, c.status, c.members, c.businessActivity, c.products,
    c.numberMembers, c.dateEstablished || null, c.businessAddress, c.contactNumber,
    c.email, c.trainingGeneral, JSON.stringify(c.boardRows || []),
    JSON.stringify(c.staffRows || []), JSON.stringify(c.committeeRows || []), c.createdBy
  ];

  try {
    if (c.id) {
      const sql = "UPDATE cooperatives SET name=$1, type=$2, status=$3, members=$4, businessActivity=$5, products=$6, numberMembers=$7, dateEstablished=$8, businessAddress=$9, contactNumber=$10, email=$11, trainingGeneral=$12, boardRows=$13, staffRows=$14, committeeRows=$15, createdBy=$16 WHERE id=$17";
      await query(sql, [...data, c.id]);
      res.json({ message: 'Updated successfully' });
    } else {
      const sql = "INSERT INTO cooperatives (name, type, status, members, businessActivity, products, numberMembers, dateEstablished, businessAddress, contactNumber, email, trainingGeneral, boardRows, staffRows, committeeRows, createdBy) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)";
      const result = await query(sql, data);
      res.json({ id: result.rows[0].id, message: 'Created successfully' });
    }
  } catch (err) {
    console.error('Error saving cooperative:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE cooperative
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    await query("DELETE FROM cooperatives WHERE id = $1", [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting cooperative:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
