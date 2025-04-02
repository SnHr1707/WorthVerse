// --- START OF REGENERATED FILE profileController.js ---
// profileController.js
// backend/controllers/profileController.js
const Profile = require('../models/Profile');
const User = require('../models/User'); // Import User model

// Get user profile by username (Public route)
// Fetches the complete profile document, including connection arrays.
// Frontend logic will determine what to display based on login status.
exports.getProfile = async (req, res) => {
    const { username } = req.params;

    try {
        // Find the profile based on the username
        const profile = await Profile.findOne({ username: username });

        if (!profile) {
            // Also check if a user exists with this username but has no profile yet
            const userExists = await User.findOne({ username: username });
            if (userExists) {
                // You could return a minimal response or signal that the profile needs creation
                return res.status(404).json({ message: 'Profile not created yet for this user.' });
                 // Or potentially auto-create a basic profile here if desired:
                 // const newProfile = new Profile({ username: username, name: userExists.fullname });
                 // await newProfile.save();
                 // return res.status(200).json({ profile: newProfile });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        // Optional: Increment profile view counter if needed (consider performance implications)
        // await Profile.updateOne({ username: username }, { $inc: { profileViewers: 1 } });

        console.log(`Fetched profile for ${username}`);
        res.status(200).json({ profile }); // Send back the full profile document

    } catch (error) {
        console.error(`Error fetching profile for ${username}:`, error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// Get logged in user's own profile (Protected)
// This primarily ensures the user is authenticated before fetching their *own* profile.
// The data fetched might be identical to the public route, but it guarantees ownership.
exports.getMyProfile = async (req, res) => {
    try {
        const username = req.user.username; // Username from authenticated token
        const profile = await Profile.findOne({ username: username });

        if (!profile) {
             // Check if user exists but profile doesn't
            const userExists = await User.findOne({ username: username });
            if (userExists) {
                 return res.status(404).json({ message: 'Profile not created yet. Please update your profile.' });
                 // Or potentially return a default structure
                 // return res.status(200).json({ profile: { username: username, name: userExists.fullname, ...defaultFields } });
            } else {
                 // Should not happen if requireAuth worked, but good practice
                 return res.status(404).json({ message: 'Authenticated user not found.' });
            }
        }

        console.log(`Fetched own profile for ${username}`);
        res.status(200).json({ profile });
    } catch (error) {
        console.error('Error fetching logged in user profile:', error);
        res.status(500).json({ message: 'Server error while fetching logged in user profile' });
    }
};


// Update Profile (Protected route)
exports.updateProfile = async (req, res) => {
    const { username } = req.params; // Username from URL (profile being edited)
    const loggedInUsername = req.user.username; // Username from JWT

    // Authorization Check: Ensure the logged-in user matches the profile username
    if (loggedInUsername !== username) {
        console.warn(`Auth mismatch: User ${loggedInUsername} attempted to update profile of ${username}`);
        return res.status(403).json({ message: "Forbidden - You can only update your own profile" });
    }

    // Exclude connection-related fields from direct update via this route
    const { connections, connectionRequestsSent, connectionRequestsReceived, ...updateData } = req.body;
    // const updateData = req.body; // Or manually pick fields: { name, title, image, about, skills, experience, education, links, certifications }

    try {
        // Find the profile and update it. Use findOneAndUpdate.
        // { new: true } returns the updated document.
        // { upsert: true } creates the document if it doesn't exist (useful for first-time profile creation via update).
        // { runValidators: true } ensures schema validation rules are applied to the update.
        const updatedProfile = await Profile.findOneAndUpdate(
            { username: username }, // Filter: find profile by username
            { $set: updateData }, // Use $set to update only provided fields
            { new: true, upsert: true, runValidators: true } // Options
        );

        if (!updatedProfile) {
             // This case should ideally be handled by upsert=true, but catch just in case.
            console.error(`Profile update failed for ${username}, findOneAndUpdate returned null.`);
             return res.status(404).json({ message: 'Profile not found or could not be updated/created.' });
        }

        console.log(`Profile updated successfully for ${username}`);
        res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });

    } catch (error) {
        console.error(`Error updating profile for ${username}:`, error);
        // Handle potential validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};