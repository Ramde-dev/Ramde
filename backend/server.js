const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/about', require('./routes/about'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/services', require('./routes/services'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/contact', require('./routes/contact'));

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Portfolio API is running 🚀',
        status: 'success',
        endpoints: {
            auth: '/api/auth',
            hero: '/api/hero',
            about: '/api/about',
            skills: '/api/skills',
            experience: '/api/experience',
            services: '/api/services',
            projects: '/api/projects',
            testimonials: '/api/testimonials',
            messages: '/api/messages',
            contact: '/api/contact'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});