// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage location and filename strategy
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'uploads'); // Store in backend/uploads/
        // Create the directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (optional: accept only image types)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { // Accept images only
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// Configure multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit per image
    },
    fileFilter: fileFilter
});

// Middleware function to handle multiple image uploads (e.g., up to 5)
// The field name 'postImages' must match the name used in the FormData on the frontend
exports.uploadPostImages = upload.array('postImages', 5); // Allows up to 5 files with the name 'postImages'