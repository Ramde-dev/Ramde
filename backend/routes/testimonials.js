const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY display_order, id');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, upload.single('client_image'), async (req, res) => {
    try {
        const { message, client_name, client_role, rating, display_order } = req.body;
        const client_image = req.file ? req.file.path : null;
        const [result] = await pool.query(
            'INSERT INTO testimonials (message, client_name, client_role, client_image, rating, display_order) VALUES (?, ?, ?, ?, ?, ?)',
            [message, client_name, client_role, client_image, rating || 5, display_order || 0]
        );
        res.json({ id: result.insertId, message: 'Testimonial added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', auth, upload.single('client_image'), async (req, res) => {
    try {
        const { message, client_name, client_role, rating, display_order } = req.body;
        const [existing] = await pool.query('SELECT * FROM testimonials WHERE id=?', [req.params.id]);
        let client_image = existing[0]?.client_image;
        if (req.file) client_image = req.file.path;

        await pool.query(
            'UPDATE testimonials SET message=?, client_name=?, client_role=?, client_image=?, rating=?, display_order=? WHERE id=?',
            [message, client_name, client_role, client_image, rating, display_order, req.params.id]
        );
        res.json({ message: 'Testimonial updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM testimonials WHERE id=?', [req.params.id]);
        res.json({ message: 'Testimonial deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;