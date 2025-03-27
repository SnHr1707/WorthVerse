// backend/controllers/profileController.js
const Profile = require('../models/Profile');
const User = require('../models/User'); // Import User model if you need user info

// Get user profile by username (Protected route)
exports.getProfile = async (req, res) => {
    const { username } = req.params;

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

// Create/Update Profile (Protected route)
exports.createOrUpdateProfile = async (req, res) => {
    const { username } = req.params; // Get username from URL
    const { name, title, image, about, skills, experience, education, links, certifications } = req.body;

    try {
        let profile = await Profile.findOne({ username });

        if (!profile) {
            // Create a new profile
            profile = new Profile({
                username,
                name,
                title,
                image,
                about,
                skills,
                experience,
                education,
                links,
                certifications
            });
        } else {
            // Update existing profile
            profile.name = name;
            profile.title = title;
            profile.image = image;
            profile.about = about;
            profile.skills = skills;
            profile.experience = experience;
            profile.education = education;
            profile.links = links;
            profile.certifications = certifications;
        }

        await profile.save();
        res.status(200).json({ message: 'Profile created/updated successfully' });
    } catch (error) {
        console.error('Error creating/updating profile:', error);
        res.status(500).json({ message: 'Server error creating/updating profile' });
    }
};