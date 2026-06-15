const { Pool } = require('pg');

// PostgreSQL connection for Vercel deployment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS calendar_notes (
        note_date TEXT PRIMARY KEY,
        note_text TEXT NOT NULL,
        note_type TEXT DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS cooperatives (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        status TEXT,
        members TEXT,
        businessActivity TEXT,
        products TEXT,
        numberMembers TEXT,
        dateEstablished DATE,
        businessAddress TEXT,
        contactNumber TEXT,
        email TEXT,
        trainingGeneral TEXT,
        boardRows TEXT,
        staffRows TEXT,
        committeeRows TEXT,
        createdBy TEXT
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        date DATE,
        content TEXT,
        image TEXT,
        status TEXT DEFAULT 'Active',
        createdBy TEXT
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS about_content (
        id INTEGER PRIMARY KEY,
        description TEXT,
        vision TEXT,
        mission TEXT
      )
    `);

    // Ensure at least one row exists in about_content
    const result = await client.query('SELECT id FROM about_content WHERE id = 1');
    if (result.rows.length === 0) {
      await client.query(
        'INSERT INTO about_content (id, description, vision, mission) VALUES (1, "", "", "")'
      );
    }

    console.log('📋 Database tables initialized.');
  } finally {
    client.release();
  }
}

// Helper functions for database queries
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

async function getClient() {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);
  
  client.release = () => {
    clearTimeout(timeout);
    client.release = release;
    return release();
  };
  
  return { client, query, release };
}

module.exports = {
  query,
  getClient,
  initializeDatabase,
  pool
};
