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