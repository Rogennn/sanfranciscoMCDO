const { query } = require('../lib/db');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const result = await query("SELECT note_date, note_text, note_type FROM calendar_notes");
      const notesMap = {};
      result.rows.forEach(row => {
        notesMap[row.note_date] = { text: row.note_text, type: row.note_type };
      });
      res.json(notesMap);
    } else if (req.method === 'POST') {
      const { date, text, type } = req.body;
      await query(
        `INSERT INTO calendar_notes (note_date, note_text, note_type, updated_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT(note_date) DO UPDATE SET note_text=EXCLUDED.note_text, note_type=EXCLUDED.note_type, updated_at=CURRENT_TIMESTAMP`,
        [date, text, type]
      );
      res.json({ message: 'Note saved successfully' });
    } else if (req.method === 'DELETE') {
      const { date } = req.query;
      await query("DELETE FROM calendar_notes WHERE note_date = $1", [date]);
      res.json({ message: 'Note deleted' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
