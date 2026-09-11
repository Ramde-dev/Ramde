const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage mchanganyiko (images + PDF)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        if (file.mimetype === 'application/pdf') {
            return {
                folder: 'ramde-portfolio/cv',
                resource_type: 'raw',
                format: 'pdf',
            };
        }
        return {
            folder: 'ramde-portfolio/images',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            transformation: [{ width: 1200, crop: 'limit' }],
        };
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;