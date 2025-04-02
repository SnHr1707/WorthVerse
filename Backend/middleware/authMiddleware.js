// --- START OF REGENERATED FILE authMiddleware.js ---
// authMiddleware.js
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to require authentication
exports.requireAuth = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.jwt;
    // console.log("requireAuth: Checking for token in cookies:", req.cookies); // Debugging

    // Check if JWT exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => { // Make callback async
            if (err) {
                console.error("JWT Verification Error in requireAuth:", err.message);
                 // Clear potentially invalid cookie? Maybe not, let frontend handle login redirect.
                // res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
                return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' }); // Invalid/Expired token
            } else {
                // console.log("Decoded JWT Token in requireAuth:", decodedToken);
                try {
                    // Check if user still exists in DB
                    const user = await User.findById(decodedToken.id).select('username'); // Only select username
                    if (!user) {
                        console.warn(`User ${decodedToken.id} from valid token not found in DB.`);
                        // Clear the invalid cookie?
                        // res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
                        return res.status(401).json({ message: 'Unauthorized - User not found' }); // User from token not found
                    }
                    // Attach user info (id and username) to request object
                    req.user = { id: decodedToken.id, username: user.username }; // Use username from DB check
                    // console.log("User attached to request:", req.user); // Debugging
                    next(); // Proceed to the next middleware/controller
                } catch (dbError) {
                    console.error("Database error during user check in requireAuth:", dbError);
                    return res.status(500).json({ message: 'Internal server error during authentication' });
                }
            }
        });
    } else {
        console.log("No token found in requireAuth");
        return res.status(401).json({ message: 'Unauthorized - No token provided' }); // No token
    }
};