// --- START OF REGENERATED FILE userController.js ---
// userController.js
// Backend/controllers/userController.js

const User = require('../models/User');
const Profile = require('../models/Profile'); // Import Profile model
const mongoose = require('mongoose');

// Get basic info about the currently authenticated user
exports.getMe = (req, res) => {
    // The requireAuth middleware already attached user info to req.user
    if (req.user && req.user.username) {
        console.log("Returning logged in user info:", { username: req.user.username });
        res.status(200).json({ username: req.user.username });
    } else {
        // This case should ideally not be reached if requireAuth is working correctly
        console.error("Error in getMe: req.user not found or username missing after requireAuth.");
        res.status(401).json({ message: 'Unauthorized - User data not found in token' });
    }
};

// Get basic info (username, name, title, image) for ALL users EXCEPT the logged-in one
exports.getAllUsers = async (req, res) => {
    const loggedInUsername = req.user.username;

    try {
        // Use aggregation pipeline to fetch users and lookup their profiles efficiently
        const usersWithProfiles = await User.aggregate([
            // 1. Match all users EXCEPT the logged-in one
            {
                $match: {
                    username: { $ne: loggedInUsername }
                }
            },
            // 2. Perform a left outer join with the 'profiles' collection
            {
                $lookup: {
                    from: 'Profile_Info', // The actual name of the profile collection in MongoDB
                    localField: 'username', // Field from the User collection
                    foreignField: 'username', // Field from the Profile collection
                    as: 'profileInfo' // Output array field name
                }
            },
            // 3. Deconstruct the profileInfo array (it will have 0 or 1 element)
            {
                $unwind: {
                    path: '$profileInfo',
                    preserveNullAndEmptyArrays: true // Keep users even if they don't have a profile yet
                }
            },
            // 4. Project the desired fields
            {
                $project: {
                    _id: 0, // Exclude the default _id
                    username: 1,
                    fullname: '$fullname', // Keep fullname from User schema
                    name: { $ifNull: ['$profileInfo.name', '$fullname'] }, // Use profile name, fallback to fullname
                    title: { $ifNull: ['$profileInfo.title', ''] }, // Use profile title, fallback to empty string
                    image: { $ifNull: ['$profileInfo.image', ''] } // Use profile image, fallback to empty string
                    // You could add other minimal fields if needed for cards, like location maybe
                }
            }
        ]);

        console.log(`Fetched basic info for ${usersWithProfiles.length} other users for ${loggedInUsername}`);
        res.status(200).json(usersWithProfiles);

    } catch (error) {
        console.error(`Error fetching all users for ${loggedInUsername}:`, error);
        res.status(500).json({ message: 'Server error while fetching users.', error: error.message });
    }
};
// --- END OF REGENERATED FILE userController.js ---