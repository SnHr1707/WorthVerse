// --- START OF REGENERATED FILE userRoutes.js ---
// userRoutes.js
// Backend/routes/userRoutes.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController'); // Import user controller

const router = express.Router();

// Route to get logged-in user's basic info (like username) - Protected
router.get('/me', authMiddleware.requireAuth, userController.getMe);

// Route to get basic info of all other users (for suggestions, etc.) - Protected
router.get('/all', authMiddleware.requireAuth, userController.getAllUsers); // <-- ADD THIS LINE

module.exports = router;
// --- END OF REGENERATED FILE userRoutes.js ---