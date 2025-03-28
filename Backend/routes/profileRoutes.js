// --- START OF FILE profileRoutes.js ---
// profileRoutes.js
// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Route to get profile by username - now public
router.get('/:username', profileController.getProfile); //  /api/profile/:username, public route

// Route to get logged in user's profile
router.get('/me', authMiddleware.requireAuth, profileController.getMyProfile); // /api/profile/me - Get logged in user profile

// Route to create or update profile - protected
router.put('/:username', authMiddleware.requireAuth, profileController.updateProfile); // Changed POST to PUT for update, and protected

module.exports = router;