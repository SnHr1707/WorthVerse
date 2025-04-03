// backend/routes/settingsRoutes.js
const express = require('express');
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All settings routes require authentication
router.use(authMiddleware.requireAuth);

// GET /api/settings - Fetch current user's settings
router.get('/', settingsController.getUserSettings);

// PUT /api/settings/general - Update general settings (privacy, notifications, theme)
router.put('/general', settingsController.updateUserSettings);

// PUT /api/settings/account/username - Change username
router.put('/account/username', settingsController.changeUsername);

// PUT /api/settings/security/password - Change password
router.put('/security/password', settingsController.changePassword);


module.exports = router;