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
      const result = await query("SELECT * FROM announcements ORDER BY date DESC");
      res.json(result.rows);
    } else if (req.method === 'POST') {
      const a = req.body;
      const data = [a.title, a.date || null, a.content, a.image, a.status, a.createdBy];
      
      if (a.id) {
        const sql = "UPDATE announcements SET title=$1, date=$2, content=$3, image=$4, status=$5, createdBy=$6 WHERE id=$7";
        await query(sql, [...data, a.id]);
        res.json({ message: 'Updated successfully' });
      } else {
        const sql = "INSERT INTO announcements (title, date, content, image, status, createdBy) VALUES ($1,$2,$3,$4,$5,$6)";
        const result = await query(sql, data);
        res.json({ id: result.rows[0]?.id, message: 'Created' });
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (id) {
        await query("DELETE FROM announcements WHERE id = $1", [id]);
        res.json({ message: 'Deleted' });
      } else {
        await query("DELETE FROM announcements");
        res.json({ message: 'All announcements deleted' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
