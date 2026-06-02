require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com");
    next();
});

// Simple request logger for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Secret key for JWT - In production, use an environment variable (process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// PostgreSQL Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL pool error:', err);
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL Database connected successfully.');
    initializeDatabase();
});

// Initialize database tables
async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS calendar_notes (
                note_date TEXT PRIMARY KEY,
                note_text TEXT NOT NULL,
                note_type TEXT DEFAULT 'general',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
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

        await pool.query(`
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

        await pool.query(`
            CREATE TABLE IF NOT EXISTS about_content (
                id SERIAL PRIMARY KEY,
                description TEXT,
                vision TEXT,
                mission TEXT
            )
        `);

        // Ensure at least one row exists
        const result = await pool.query('SELECT id FROM about_content WHERE id = 1');
        if (result.rows.length === 0) {
            await pool.query(
                'INSERT INTO about_content (id, description, vision, mission) VALUES ($1, $2, $3, $4)',
                [1, '', '', '']
            );
        }

        console.log('📋 Database tables initialized.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// Helper functions for database queries (using promises)
async function runAsync(sql, params = []) {
    return pool.query(sql, params);
}

async function allAsync(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows;
}

async function getAsync(sql, params = []) {
    const result = await pool.query(sql, params);
    return result.rows[0];
}

// Middleware to verify JWT Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied. Please login.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Session expired. Please login again.' });
        req.user = user;
        next();
    });
};

// GET all notes
app.get('/api/notes', async (req, res) => {
    try {
        const rows = await allAsync("SELECT note_date, note_text, note_type FROM calendar_notes");
        const notesMap = {};
        rows.forEach(row => {
            notesMap[row.note_date] = { text: row.note_text, type: row.note_type };
        });
        res.json(notesMap);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// SAVE or UPDATE a note
app.post('/api/notes', authenticateToken, async (req, res) => {
    const { date, text, type } = req.body;
    
    try {
        await runAsync(
            `INSERT INTO calendar_notes (note_date, note_text, note_type, updated_at) 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
             ON CONFLICT(note_date) DO UPDATE SET note_text=excluded.note_text, note_type=excluded.note_type, updated_at=CURRENT_TIMESTAMP`,
            [date, text, type]
        );
        res.json({ message: 'Note saved successfully' });
    } catch (err) {
        console.error('Error saving note:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE a note
app.delete('/api/notes/:date', authenticateToken, async (req, res) => {
    try {
        await runAsync("DELETE FROM calendar_notes WHERE note_date = $1", [req.params.date]);
        res.json({ message: 'Note deleted' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- ABOUT CONTENT API ---
app.get('/api/about', async (req, res) => {
    try {
        const row = await getAsync("SELECT * FROM about_content WHERE id = 1");
        res.json(row || { id: 1, description: '', vision: '', mission: '' });
    } catch (err) {
        console.error('Error fetching about:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/about', authenticateToken, async (req, res) => {
    const { description, vision, mission } = req.body;
    
    try {
        await runAsync(
            `INSERT INTO about_content (id, description, vision, mission) 
             VALUES (1, $1, $2, $3)
             ON CONFLICT(id) DO UPDATE SET description=excluded.description, vision=excluded.vision, mission=excluded.mission`,
            [description, vision, mission]
        );
        res.json({ message: 'About content updated' });
    } catch (err) {
        console.error('Error updating about:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- COOPERATIVES API ---
app.get('/api/cooperatives', async (req, res) => {
    try {
        const rows = await allAsync("SELECT * FROM cooperatives");
        const processed = rows.map(c => ({
            ...c,
            boardRows: JSON.parse(c.boardRows || '[]'),
            staffRows: JSON.parse(c.staffRows || '[]'),
            committeeRows: JSON.parse(c.committeeRows || '[]')
        }));
        res.json(processed);
    } catch (err) {
        console.error('Error fetching cooperatives:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/cooperatives', authenticateToken, async (req, res) => {
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
            await runAsync(sql, [...data, c.id]);
            res.json({ message: 'Updated successfully' });
        } else {
            const sql = "INSERT INTO cooperatives (name, type, status, members, businessActivity, products, numberMembers, dateEstablished, businessAddress, contactNumber, email, trainingGeneral, boardRows, staffRows, committeeRows, createdBy) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id";
            const result = await runAsync(sql, data);
            res.json({ id: result.rows[0].id, message: 'Created successfully' });
        }
    } catch (err) {
        console.error('Error saving cooperative:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/cooperatives/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        await runAsync("DELETE FROM cooperatives WHERE id = $1", [id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('Error deleting cooperative:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- ANNOUNCEMENTS API ---
app.get('/api/announcements', async (req, res) => {
    try {
        const rows = await allAsync("SELECT * FROM announcements ORDER BY date DESC");
        res.json(rows);
    } catch (err) {
        console.error('Error fetching announcements:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/announcements', authenticateToken, async (req, res) => {
    const a = req.body;
    const data = [a.title, a.date || null, a.content, a.image, a.status, a.createdBy];
    
    try {
        if (a.id) {
            const sql = "UPDATE announcements SET title=$1, date=$2, content=$3, image=$4, status=$5, createdBy=$6 WHERE id=$7";
            await runAsync(sql, [...data, a.id]);
            res.json({ message: 'Updated successfully' });
        } else {
            const sql = "INSERT INTO announcements (title, date, content, image, status, createdBy) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id";
            const result = await runAsync(sql, data);
            res.json({ id: result.rows[0].id, message: 'Created' });
        }
    } catch (err) {
        console.error('Error saving announcement:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        await runAsync("DELETE FROM announcements WHERE id = $1", [id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('Error deleting announcement:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE all announcements
app.delete('/api/announcements', authenticateToken, async (req, res) => {
    try {
        await runAsync("DELETE FROM announcements");
        res.json({ message: 'All announcements deleted' });
    } catch (err) {
        console.error('Error deleting announcements:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Simple Auth (matching your current logic)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log(`Login attempt for: ${username}`); // Helpful for debugging

    // Check credentials
    if (username === 'mcdoadmin' && password === 'macdo2026') {
        const token = jwt.sign({ username: 'mcdoadmin' }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ success: true, token, username: 'mcdoadmin' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Serve Static Files from the current directory
app.use(express.static(path.join(__dirname, '.')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 PostgreSQL Database: Connected via DATABASE_URL`);
});

/**
 * Instructions:
 * 1. Run 'npm install'
 * 2. Set DATABASE_URL environment variable (from Supabase/PostgreSQL)
 * 3. Run 'node server.js'
 * 
 * Data Persistence:
 * - All data is stored in PostgreSQL database
 * - Data persists across server restarts
 */