const fs = require('fs').promises;
const path = require('path');

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, '../logs');
        this.ensureLogsDirectory();
    }

    async ensureLogsDirectory() {
        try {
            await fs.access(this.logsDir);
        } catch {
            await fs.mkdir(this.logsDir, { recursive: true });
        }
    }

    async log(filename, data) {
        try {
            const logPath = path.join(this.logsDir, filename);
            const logEntry = {
                timestamp: new Date().toISOString(),
                ...data
            };
            await fs.appendFile(logPath, JSON.stringify(logEntry) + '\n');
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    async info(message, meta = {}) {
        await this.log('info.log', { level: 'info', message, ...meta });
    }

    async error(message, error = null, meta = {}) {
        await this.log('error.log', { 
            level: 'error', 
            message, 
            error: error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : null,
            ...meta 
        });
    }

    async contact(data) {
        await this.log('contacts.log', { type: 'contact', ...data });
    }

    async analytics(data) {
        await this.log('analytics.log', { type: 'analytics', ...data });
    }

    async newsletter(data) {
        await this.log('newsletter.log', { type: 'newsletter', ...data });
    }
}

module.exports = new Logger();
