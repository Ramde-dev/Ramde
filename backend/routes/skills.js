const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET all skills (public)
router.get('/', async (req, res) => {
    try {
        const [bars] = await pool.query(
            "SELECT * FROM skills WHERE category='bar' ORDER BY display_order, id"
        );
        const [tech] = await pool.query(
            "SELECT * FROM skills WHERE category='tech' ORDER BY display_order, id"
        );
        res.json({ bars, tech });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new skill (admin)
router.post('/', auth, async (req, res) => {
    try {
        const { name, percentage, category, icon, display_order } = req.body;
        const [result] = await pool.query(
            'INSERT INTO skills (name, percentage, category, icon, display_order) VALUES (?, ?, ?, ?, ?)',
            [name, percentage || 0, category || 'bar', icon, display_order || 0]
        );
        res.json({ id: result.insertId, message: 'Skill added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update skill (admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, percentage, category, icon, display_order } = req.body;
        await pool.query(
            'UPDATE skills SET name=?, percentage=?, category=?, icon=?, display_order=? WHERE id=?',
            [name, percentage, category, icon, display_order, req.params.id]
        );
        res.json({ message: 'Skill updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE skill (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM skills WHERE id=?', [req.params.id]);
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;