// backend/routes/jobRoutes.js
const express = require('express');
const jobController = require('../controllers/jobController');
// No auth needed for basic job listing view usually
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get all job listings
router.get('/all', jobController.getAllJobs);

// Add more routes later if needed (e.g., get job by ID, create job - potentially protected)

module.exports = router;