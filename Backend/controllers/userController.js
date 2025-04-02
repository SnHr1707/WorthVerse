// --- START OF NEW FILE userController.js ---
// userController.js
// Backend/controllers/userController.js

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

exports.getAllOtherProfiles = async (req, res) => {
    const loggedInUsername = req.user.username;
    try {
        const profiles = await Profile.find({ username: { $ne: loggedInUsername } })
                                      .select('username name title image');

        console.log(`Fetched ${profiles.length} other profiles for suggestions/connections view.`);
        res.status(200).json(profiles);

    } catch (error) {
        console.error(`Error fetching other profiles for ${loggedInUsername}:`, error);
        res.status(500).json({ message: 'Server error while fetching user profiles.', error: error.message });
    }
};