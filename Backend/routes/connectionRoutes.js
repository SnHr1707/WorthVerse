// --- START OF NEW FILE connectionRoutes.js ---
// connectionRoutes.js
// Backend/routes/connectionRoutes.js

const express = require('express');
const connectionController = require('../controllers/connectionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All connection routes require authentication
router.use(authMiddleware.requireAuth);

// Send a connection request to targetUsername
router.post('/request/:targetUsername', connectionController.sendConnectionRequest);

// Accept a connection request from requesterUsername
router.post('/accept/:requesterUsername', connectionController.acceptConnectionRequest);

// Reject/Decline a connection request from requesterUsername
router.post('/reject/:requesterUsername', connectionController.rejectConnectionRequest);

// Withdraw a connection request sent to targetUsername
router.delete('/withdraw/:targetUsername', connectionController.withdrawConnectionRequest);

// Remove/Disconnect an existing connection with connectionUsername
router.delete('/remove/:connectionUsername', connectionController.removeConnection);

module.exports = router;