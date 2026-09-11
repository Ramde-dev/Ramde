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

// GET /api/about
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM about LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/about
router.put('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { heading, subheading, description1, description2,
                stat1_number, stat1_label, stat2_number, stat2_label,
                stat3_number, stat3_label, stat4_number, stat4_label } = req.body;
        
        const [existing] = await pool.query('SELECT * FROM about LIMIT 1');
        const oldData = existing[0] || {};
        let image = oldData.image;
        if (req.file) image = req.file.filename;
        
        if (oldData.id) {
            await pool.query(
                `UPDATE about SET heading=?, subheading=?, description1=?, description2=?, image=?,
                 stat1_number=?, stat1_label=?, stat2_number=?, stat2_label=?,
                 stat3_number=?, stat3_label=?, stat4_number=?, stat4_label=? WHERE id=?`,
                [heading, subheading, description1, description2, image,
                 stat1_number, stat1_label, stat2_number, stat2_label,
                 stat3_number, stat3_label, stat4_number, stat4_label, oldData.id]
            );
        } else {
            await pool.query(
                `INSERT INTO about (heading, subheading, description1, description2, image,
                 stat1_number, stat1_label, stat2_number, stat2_label,
                 stat3_number, stat3_label, stat4_number, stat4_label) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [heading, subheading, description1, description2, image,
                 stat1_number, stat1_label, stat2_number, stat2_label,
                 stat3_number, stat3_label, stat4_number, stat4_label]
            );
        }
        
        res.json({ message: 'About updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;