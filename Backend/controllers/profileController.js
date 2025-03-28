// --- START OF FILE profileController.js ---
// profileController.js
// backend/controllers/profileController.js
const Profile = require('../models/Profile');
const User = require('../models/User'); // Import User model if you need user info

// Get user profile by username (Public route)
exports.getProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const profile = await Profile.findOne({ username });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ profile }); // Send back profile
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// Get logged in user profile
exports.getMyProfile = async (req, res) => {
    try {
        const username = req.user.username; // Username is available from requireAuth middleware
        const profile = await Profile.findOne({ username });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found for logged in user' });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error('Error fetching logged in user profile:', error);
        res.status(500).json({ message: 'Server error while fetching logged in user profile' });
    }
};


// Update Profile (Protected route)
exports.updateProfile = async (req, res) => {
    const { username } = req.params; // Username from URL
    if (req.user.username !== username) { // Compare with username from JWT
        return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    const { name, title, image, about, skills, experience, education, links, certifications } = req.body;

    try {
        const profile = await Profile.findOneAndUpdate(
            { username: username }, // Filter to find profile to update
            { // Update fields
                name,
                title,
                image,
                about,
                skills,
                experience,
                education,
                links,
                certifications
            },
            { new: true, runValidators: true } // Options: new:true to return updated doc, runValidators to validate updates
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', profile: profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error updating profile', error: error });
    }
};