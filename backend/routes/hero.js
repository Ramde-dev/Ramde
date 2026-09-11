const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hero LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT
router.put('/', auth, upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'cv_file', maxCount: 1 }
]), async (req, res) => {
    try {
        const { badge, title, subtitle, description, github_url, linkedin_url, email } = req.body;

        const [existing] = await pool.query('SELECT * FROM hero LIMIT 1');
        const oldData = existing[0] || {};

        let profileImage = oldData.profile_image;
        let cvFile = oldData.cv_file;

        // Cloudinary inarudisha full URL kwenye file.path
        if (req.files?.profile_image) {
            profileImage = req.files.profile_image[0].path;
        }
        if (req.files?.cv_file) {
            cvFile = req.files.cv_file[0].path;
        }

        if (oldData.id) {
            await pool.query(
                `UPDATE hero SET badge=?, title=?, subtitle=?, description=?, 
                 profile_image=?, cv_file=?, github_url=?, linkedin_url=?, email=? 
                 WHERE id=?`,
                [badge, title, subtitle, description, profileImage, cvFile,
                 github_url, linkedin_url, email, oldData.id]
            );
        } else {
            await pool.query(
                `INSERT INTO hero (badge, title, subtitle, description, profile_image, 
                 cv_file, github_url, linkedin_url, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [badge, title, subtitle, description, profileImage, cvFile,
                 github_url, linkedin_url, email]
            );
        }

        res.json({ 
            message: 'Hero updated successfully', 
            profile_image: profileImage 
        });
    } catch (err) {
        console.error('Hero update error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;