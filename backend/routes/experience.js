const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM experience ORDER BY display_order, id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, organization, period, description, display_order } = req.body;
        const [result] = await pool.query(
            'INSERT INTO experience (title, organization, period, description, display_order) VALUES (?, ?, ?, ?, ?)',
            [title, organization, period, description, display_order || 0]
        );
        res.json({ id: result.insertId, message: 'Experience added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { title, organization, period, description, display_order } = req.body;
        await pool.query(
            'UPDATE experience SET title=?, organization=?, period=?, description=?, display_order=? WHERE id=?',
            [title, organization, period, description, display_order, req.params.id]
        );
        res.json({ message: 'Experience updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM experience WHERE id=?', [req.params.id]);
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;