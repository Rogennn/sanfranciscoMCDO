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
      const result = await query("SELECT * FROM about_content WHERE id = 1");
      res.json(result.rows[0] || { id: 1, description: '', vision: '', mission: '' });
    } else if (req.method === 'POST') {
      const { description, vision, mission } = req.body;
      await query(
        `INSERT INTO about_content (id, description, vision, mission) 
         VALUES (1, $1, $2, $3)
         ON CONFLICT(id) DO UPDATE SET description=EXCLUDED.description, vision=EXCLUDED.vision, mission=EXCLUDED.mission`,
        [description, vision, mission]
      );
      res.json({ message: 'About content updated' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
