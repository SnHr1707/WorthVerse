// Backend/routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

router.post('/send-verification-code', authController.sendVerificationCode);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/check-auth', authMiddleware.requireAuth, authController.checkAuth); // New route to check authentication status

module.exports = router;