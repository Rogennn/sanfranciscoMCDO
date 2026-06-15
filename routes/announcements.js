const express = require('express');
const router = express.Router();
const { query } = require('../lib/db');

// GET all announcements
router.get('/', async (req, res) => {
  try {
    const result = await query("SELECT * FROM announcements ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST/UPDATE announcement
router.post('/', async (req, res) => {
  const a = req.body;
  const data = [a.title, a.date || null, a.content, a.image, a.status, a.createdBy];
  
  try {
    if (a.id) {
      const sql = "UPDATE announcements SET title=$1, date=$2, content=$3, image=$4, status=$5, createdBy=$6 WHERE id=$7";
      await query(sql, [...data, a.id]);
      res.json({ message: 'Updated successfully' });
    } else {
      const sql = "INSERT INTO announcements (title, date, content, image, status, createdBy) VALUES ($1,$2,$3,$4,$5,$6)";
      const result = await query(sql, data);
      res.json({ id: result.rows[0].id, message: 'Created' });
    }
  } catch (err) {
    console.error('Error saving announcement:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE announcement
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    await query("DELETE FROM announcements WHERE id = $1", [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE all announcements
router.delete('/', async (req, res) => {
  try {
    await query("DELETE FROM announcements");
    res.json({ message: 'All announcements deleted' });
  } catch (err) {
    console.error('Error deleting announcements:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
