// backend/controllers/profileController.js
const Profile = require('../models/Profile');

// Get user profile by username
exports.getProfile = async (req, res) => {
    const { username } = req.params; // Get username from parameters

    try {
        const profile = await Profile.findOne({ username });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};