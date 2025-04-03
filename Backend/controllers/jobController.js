// backend/controllers/jobController.js
const Job = require('../models/Job');

// Get all job listings
exports.getAllJobs = async (req, res) => {
    try {
        // Fetch all jobs. Select specific fields if needed later for optimization.
        const jobs = await Job.find({}).sort({ createdAt: -1 }); // Sort by newest first
        console.log(`Fetched ${jobs.length} jobs.`);
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server error while fetching jobs.', error: error.message });
    }
};

// Add other controller functions later (createJob, getJobById, etc.)