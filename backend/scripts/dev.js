#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔧 Starting Farhan Ali Peerzada Portfolio Backend in Development Mode...\n');

// Start the server with nodemon
const server = spawn('npx', ['nodemon', 'server.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
});

server.on('error', (error) => {
    console.error('❌ Failed to start development server:', error);
    process.exit(1);
});

server.on('close', (code) => {
    console.log(`\n📤 Development server process exited with code ${code}`);
    process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    server.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development server...');
    server.kill('SIGTERM');
});
