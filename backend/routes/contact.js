const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contact_info LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', auth, async (req, res) => {
    try {
        const { email, phone, location, github, linkedin } = req.body;
        const [existing] = await pool.query('SELECT * FROM contact_info LIMIT 1');
        
        if (existing[0]) {
            await pool.query(
                'UPDATE contact_info SET email=?, phone=?, location=?, github=?, linkedin=? WHERE id=?',
                [email, phone, location, github, linkedin, existing[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO contact_info (email, phone, location, github, linkedin) VALUES (?, ?, ?, ?, ?)',
                [email, phone, location, github, linkedin]
            );
        }
        
        res.json({ message: 'Contact info updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;