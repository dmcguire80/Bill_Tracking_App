import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const BACKUP_DIR = path.join(__dirname, 'backups');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large backup files
app.use(express.static('dist')); // Serve built frontend

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/backup', (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({ error: 'No data provided' });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.json`;
        const filepath = path.join(BACKUP_DIR, filename);

        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

        // Clean up old backups (keep last 30)
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
            .sort()
            .reverse();

        if (files.length > 30) {
            files.slice(30).forEach(f => {
                fs.unlinkSync(path.join(BACKUP_DIR, f));
            });
        }

        res.json({ success: true, filename, timestamp });
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Failed to save backup' });
    }
});

app.get('/api/backups', (req, res) => {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
            .map(f => {
                const stat = fs.statSync(path.join(BACKUP_DIR, f));
                return {
                    filename: f,
                    created: stat.birthtime,
                    size: stat.size
                };
            })
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list backups' });
    }
});

// Catch-all for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Backups directory: ${BACKUP_DIR}`);
});
