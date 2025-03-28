// --- START OF FILE userRoutes.js ---
// userRoutes.js
// Backend/routes/userRoutes.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get-username', authMiddleware.getUsername); // Route to return username - protected

module.exports = router;