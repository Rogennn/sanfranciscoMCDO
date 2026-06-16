require('dotenv').config();
const express = require('express');
const initSqlJs = require('sql.js');
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

// SQLite Database Connection
let db;
let SQL;

async function initDatabase() {
    SQL = await initSqlJs();
    
    // Load existing database or create new one
    const fs = require('fs');
    let dbBuffer;
    try {
        if (fs.existsSync('./mcdo_db.sqlite')) {
            dbBuffer = fs.readFileSync('./mcdo_db.sqlite');
        }
    } catch (err) {
        console.log('No existing database found, creating new one');
    }
    
    db = new SQL.Database(dbBuffer || null);
    console.log('✅ SQLite Database connected successfully.');
    initializeDatabase();
}

initDatabase();

// Initialize database tables
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS calendar_notes (
            note_date TEXT PRIMARY KEY,
            note_text TEXT NOT NULL,
            note_type TEXT DEFAULT 'general',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS cooperatives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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

    db.run(`
        CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date DATE,
            content TEXT,
            image TEXT,
            status TEXT DEFAULT 'Active',
            createdBy TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS about_content (
            id INTEGER PRIMARY KEY,
            description TEXT,
            vision TEXT,
            mission TEXT
        )
    `);

    // Ensure at least one row exists
    const stmt = db.prepare('SELECT id FROM about_content WHERE id = 1');
    const result = stmt.getAsObject();
    if (!result || result.length === 0) {
        db.run('INSERT INTO about_content (id, description, vision, mission) VALUES (1, "", "", "")');
    }

    console.log('📋 Database tables initialized.');
}

// Helper functions for database queries
function runAsync(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const result = stmt.run();
    stmt.free();
    return result;
}

function allAsync(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
}

function getAsync(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    let row = null;
    if (stmt.step()) {
        row = stmt.getAsObject();
    }
    stmt.free();
    return row;
}

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
app.post('/api/notes', async (req, res) => {
    const { date, text, type } = req.body;
    
    try {
        await runAsync(
            `INSERT INTO calendar_notes (note_date, note_text, note_type, updated_at) 
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)
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
app.delete('/api/notes/:date', async (req, res) => {
    try {
        await runAsync("DELETE FROM calendar_notes WHERE note_date = ?", [req.params.date]);
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

app.post('/api/about', async (req, res) => {
    const { description, vision, mission } = req.body;
    
    try {
        await runAsync(
            `INSERT INTO about_content (id, description, vision, mission) 
             VALUES (1, ?, ?, ?)
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

app.post('/api/cooperatives', async (req, res) => {
    const c = req.body;
    const data = [
        c.name, c.type, c.status, c.members, c.businessActivity, c.products,
        c.numberMembers, c.dateEstablished || null, c.businessAddress, c.contactNumber,
        c.email, c.trainingGeneral, JSON.stringify(c.boardRows || []),
        JSON.stringify(c.staffRows || []), JSON.stringify(c.committeeRows || []), c.createdBy
    ];

    try {
        if (c.id) {
            const sql = "UPDATE cooperatives SET name=?, type=?, status=?, members=?, businessActivity=?, products=?, numberMembers=?, dateEstablished=?, businessAddress=?, contactNumber=?, email=?, trainingGeneral=?, boardRows=?, staffRows=?, committeeRows=?, createdBy=? WHERE id=?";
            await runAsync(sql, [...data, c.id]);
            res.json({ message: 'Updated successfully' });
        } else {
            const sql = "INSERT INTO cooperatives (name, type, status, members, businessActivity, products, numberMembers, dateEstablished, businessAddress, contactNumber, email, trainingGeneral, boardRows, staffRows, committeeRows, createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            const result = await runAsync(sql, data);
            res.json({ id: result.lastID, message: 'Created successfully' });
        }
    } catch (err) {
        console.error('Error saving cooperative:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/cooperatives/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        await runAsync("DELETE FROM cooperatives WHERE id = ?", [id]);
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

app.post('/api/announcements', async (req, res) => {
    const a = req.body;
    const data = [a.title, a.date || null, a.content, a.image, a.status, a.createdBy];
    
    try {
        if (a.id) {
            const sql = "UPDATE announcements SET title=?, date=?, content=?, image=?, status=?, createdBy=? WHERE id=?";
            await runAsync(sql, [...data, a.id]);
            res.json({ message: 'Updated successfully' });
        } else {
            const sql = "INSERT INTO announcements (title, date, content, image, status, createdBy) VALUES (?,?,?,?,?,?)";
            const result = await runAsync(sql, data);
            res.json({ id: result.lastID, message: 'Created' });
        }
    } catch (err) {
        console.error('Error saving announcement:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/announcements/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    try {
        await runAsync("DELETE FROM announcements WHERE id = ?", [id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error('Error deleting announcement:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE all announcements
app.delete('/api/announcements', async (req, res) => {
    try {
        await runAsync("DELETE FROM announcements");
        res.json({ message: 'All announcements deleted' });
    } catch (err) {
        console.error('Error deleting announcements:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Simple Auth - No longer needed (only security password in frontend)
app.post('/api/auth', (req, res) => {
    // This endpoint is for future use or to maintain compatibility
    res.json({ success: true, message: 'Security verification already handled on frontend' });
});

// Serve Static Files from the current directory
app.use(express.static(path.join(__dirname, '.')));

// Catch-all route for SPA-like behavior - serve index.html for non-API routes
app.get('*', (req, res) => {
    // If it's an API route, let it 404
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    // For HTML files, try to serve them directly
    const fs = require('fs');
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        // Default to index.html for unknown routes
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Save database to file on shutdown
function saveDatabase() {
    const fs = require('fs');
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync('./mcdo_db.sqlite', buffer);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 SQLite Database: mcdo_db.sqlite`);
});

// Save database periodically (every 30 seconds)
setInterval(saveDatabase, 30000);

// Save database on process exit
process.on('SIGINT', () => {
    saveDatabase();
    process.exit(0);
});

process.on('SIGTERM', () => {
    saveDatabase();
    process.exit(0);
});

/**
 * Instructions:
 * 1. Run 'npm install'
 * 2. Run 'node server.js'
 * 
 * Data Persistence:
 * - All data is stored in SQLite database (mcdo_db.sqlite)
 * - Data persists across server restarts
 */