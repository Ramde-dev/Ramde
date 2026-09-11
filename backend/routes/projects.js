const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects ORDER BY display_order, id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, icon, project_url, tags, display_order } = req.body;
        const thumbnail = req.file ? req.file.filename : null;
        const [result] = await pool.query(
            'INSERT INTO projects (title, description, thumbnail, icon, project_url, tags, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, thumbnail, icon, project_url, tags, display_order || 0]
        );
        res.json({ id: result.insertId, message: 'Project added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', auth, upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, icon, project_url, tags, display_order } = req.body;
        const [existing] = await pool.query('SELECT * FROM projects WHERE id=?', [req.params.id]);
        let thumbnail = existing[0]?.thumbnail;
        if (req.file) thumbnail = req.file.filename;
        
        await pool.query(
            'UPDATE projects SET title=?, description=?, thumbnail=?, icon=?, project_url=?, tags=?, display_order=? WHERE id=?',
            [title, description, thumbnail, icon, project_url, tags, display_order, req.params.id]
        );
        res.json({ message: 'Project updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id=?', [req.params.id]);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;