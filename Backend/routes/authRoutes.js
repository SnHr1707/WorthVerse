// Backend/routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController'); // Import controller

const router = express.Router();

router.post('/send-verification-code', authController.sendVerificationCode);
router.post('/signup', authController.signup);
router.post('/login', authController.login); // Add login route

module.exports = router;