const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com");
    next();
});

// Simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Import database and routes
const db = require('../lib/db');
const notesRoutes = require('../routes/notes');
const aboutRoutes = require('../routes/about');
const cooperativesRoutes = require('../routes/cooperatives');
const announcementsRoutes = require('../routes/announcements');

// Use routes
app.use('/api/notes', notesRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/cooperatives', cooperativesRoutes);
app.use('/api/announcements', announcementsRoutes);

// Simple Auth
app.post('/api/auth', (req, res) => {
    res.json({ success: true, message: 'Security verification already handled on frontend' });
});

// Vercel serverless function export
module.exports = app;
