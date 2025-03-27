// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Route to get profile by username - now protected
router.get('/:username', authMiddleware.requireAuth, profileController.getProfile); //  /api/profile/:username, requireAuth middleware added

// Route to create or update profile - protected
router.post('/:username', authMiddleware.requireAuth, profileController.createOrUpdateProfile);

module.exports = router;