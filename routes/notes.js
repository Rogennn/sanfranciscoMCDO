const express = require('express');
const router = express.Router();
const { query } = require('../lib/db');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const result = await query("SELECT note_date, note_text, note_type FROM calendar_notes");
    const notesMap = {};
    result.rows.forEach(row => {
      notesMap[row.note_date] = { text: row.note_text, type: row.note_type };
    });
    res.json(notesMap);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// SAVE or UPDATE a note
router.post('/', async (req, res) => {
  const { date, text, type } = req.body;
  
  try {
    await query(
      `INSERT INTO calendar_notes (note_date, note_text, note_type, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT(note_date) DO UPDATE SET note_text=EXCLUDED.note_text, note_type=EXCLUDED.note_type, updated_at=CURRENT_TIMESTAMP`,
      [date, text, type]
    );
    res.json({ message: 'Note saved successfully' });
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE a note
router.delete('/:date', async (req, res) => {
  try {
    await query("DELETE FROM calendar_notes WHERE note_date = $1", [req.params.date]);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
