#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = 8000;

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'localhost';
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

const localIP = getLocalIP();

console.log('='.repeat(60));
console.log('MCDO Website Server Started!');
console.log('='.repeat(60));
console.log(`Local access: http://localhost:${PORT}`);
console.log(`Phone access: http://${localIP}:${PORT}`);
console.log('='.repeat(60));
console.log('Instructions for phone access:');
console.log('1. Make sure your phone and computer are on the same WiFi network');
console.log('2. On your phone, open Chrome and go to the address above');
console.log('3. If it doesn\'t work, try these troubleshooting steps:');
console.log('   - Check firewall settings on your computer');
console.log('   - Make sure both devices are on the same network');
console.log('   - Try using the computer\'s IP address instead of hostname');
console.log('='.repeat(60));
console.log('Press Ctrl+C to stop the server');
console.log('='.repeat(60));

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
    
    // Automatically open the browser
    const url = `http://localhost:${PORT}`;
    const startCommand = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${startCommand} ${url}`);
});

process.on('SIGINT', () => {
    console.log('\nServer stopped by user');
    process.exit(0);
});
