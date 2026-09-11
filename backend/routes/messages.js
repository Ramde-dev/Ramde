const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const resend = require('../config/mailer');

// POST message (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'Name, email, phone and message are required' });
        }

        // Save to database
        await pool.query(
            'INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone, message]
        );

        // Send email via Resend HTTP API
        try {
            await resend.emails.send({
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: process.env.EMAIL_TO || 'ramadhani123ally@gmail.com',
                replyTo: email,
                subject: `📬 New Message from ${name}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
                            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                            .header { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #ffffff; padding: 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 1.4rem; }
                            .header p { margin: 8px 0 0; opacity: 0.9; font-size: 0.9rem; }
                            .body { padding: 30px; }
                            .field { margin-bottom: 20px; }
                            .field-label { font-size: 0.78rem; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 6px; }
                            .field-value { font-size: 1rem; color: #0f172a; padding: 12px 15px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #8b5cf6; }
                            .message-box { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 3px solid #8b5cf6; color: #334155; line-height: 1.6; }
                            .cta { text-align: center; margin: 25px 0 10px; }
                            .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 5px; }
                            .btn-outline { background: transparent; border: 2px solid #8b5cf6; color: #8b5cf6; }
                            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 0.8rem; color: #94a3b8; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>New Contact Message</h1>
                                <p>Someone contacted you from your portfolio</p>
                            </div>
                            <div class="body">
                                <div class="field">
                                    <div class="field-label">Name</div>
                                    <div class="field-value">${name}</div>
                                </div>
                                <div class="field">
                                    <div class="field-label">Email</div>
                                    <div class="field-value"><a href="mailto:${email}" style="color:#8b5cf6;">${email}</a></div>
                                </div>
                                <div class="field">
                                    <div class="field-label">Phone</div>
                                    <div class="field-value"><a href="tel:${phone}" style="color:#8b5cf6;">${phone}</a></div>
                                </div>
                                <div class="field">
                                    <div class="field-label">Message</div>
                                    <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                                </div>
                                <div class="cta">
                                    <a href="mailto:${email}?subject=Re: Your message" class="btn">Reply via Email</a>
                                    <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" class="btn btn-outline">WhatsApp</a>
                                </div>
                            </div>
                            <div class="footer">
                                © 2026 Ramadhani Ally — Portfolio Contact System
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            });
            console.log(`📧 Email sent via Resend for message from ${name}`);
        } catch (emailErr) {
            console.error('❌ Resend error:', emailErr.message);
            // Don't fail the request if email fails
        }

        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all messages (admin)
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT mark as read (admin)
router.put('/:id/read', auth, async (req, res) => {
    try {
        await pool.query('UPDATE messages SET is_read=TRUE WHERE id=?', [req.params.id]);
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE message (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM messages WHERE id=?', [req.params.id]);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;