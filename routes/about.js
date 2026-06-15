const express = require('express');
const router = express.Router();
const { query } = require('../lib/db');

// GET about content
router.get('/', async (req, res) => {
  try {
    const result = await query("SELECT * FROM about_content WHERE id = 1");
    res.json(result.rows[0] || { id: 1, description: '', vision: '', mission: '' });
  } catch (err) {
    console.error('Error fetching about:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST/UPDATE about content
router.post('/', async (req, res) => {
  const { description, vision, mission } = req.body;
  
  try {
    await query(
      `INSERT INTO about_content (id, description, vision, mission) 
       VALUES (1, $1, $2, $3)
       ON CONFLICT(id) DO UPDATE SET description=EXCLUDED.description, vision=EXCLUDED.vision, mission=EXCLUDED.mission`,
      [description, vision, mission]
    );
    res.json({ message: 'About content updated' });
  } catch (err) {
    console.error('Error updating about:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
