const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM services ORDER BY display_order, id');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, description, icon, display_order } = req.body;
        const [result] = await pool.query(
            'INSERT INTO services (title, description, icon, display_order) VALUES (?, ?, ?, ?)',
            [title, description, icon, display_order || 0]
        );
        res.json({ id: result.insertId, message: 'Service added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, icon, display_order } = req.body;
        await pool.query(
            'UPDATE services SET title=?, description=?, icon=?, display_order=? WHERE id=?',
            [title, description, icon, display_order, req.params.id]
        );
        res.json({ message: 'Service updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM services WHERE id=?', [req.params.id]);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;