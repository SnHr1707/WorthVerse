// --- START OF REGENERATED FILE profileRoutes.js ---
// profileRoutes.js
// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Route to get profile by username - PUBLIC
// Fetches profile data including connection arrays, but frontend decides what to show.
router.get('/:username', profileController.getProfile); //  /api/profile/:username

// Route to get logged in user's *own* full profile (redundant if /:username is public, but could be used for specific "my profile" fetches)
// Kept for potential future use where /me might return more sensitive data than the public route
router.get('/me', authMiddleware.requireAuth, profileController.getMyProfile); // /api/profile/me

// Route to create or update profile - PROTECTED
router.put('/:username', authMiddleware.requireAuth, profileController.updateProfile); // Changed POST to PUT for update, and protected

module.exports = router;