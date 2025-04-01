// --- START OF REGENERATED FILE authRoutes.js ---
// authRoutes.js
// Backend/routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

router.post('/send-verification-code', authController.sendVerificationCode);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Route to check authentication status - useful for frontend logic
router.get('/check-auth', authMiddleware.requireAuth, authController.checkAuth);

module.exports = router;