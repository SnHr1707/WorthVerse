// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route to get profile by username
router.get('/:username', profileController.getProfile); //  /api/profile/:username

module.exports = router;