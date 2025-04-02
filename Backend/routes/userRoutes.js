// --- START OF userRoutes.js addition ---
// userRoutes.js
// Backend/routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// Route to get logged-in user's basic info (like username) - Protected
router.get('/me', authMiddleware.requireAuth, userController.getMe);

// Route to get all other user profiles (for connection suggestions etc.) - Protected
router.get('/all-profiles', authMiddleware.requireAuth, userController.getAllOtherProfiles); // Add this line

module.exports = router;
// --- END OF userRoutes.js addition ---