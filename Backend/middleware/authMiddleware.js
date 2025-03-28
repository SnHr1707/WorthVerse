// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getUsername = (req, res) => {
    const token = req.cookies.jwt;
    console.log("getUsername middleware called...");
    console.log("Cookies in getUsername:", req.cookies); // Log cookies

    // Check if JWT exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => { // Make callback async
            if (err) {
                console.error("JWT Verification Error in getUsername:", err.message);
                return res.status(401).json({ message: 'Unauthorized - Invalid token in getUsername', error: err.message }); // Invalid token and provide error details
            } else {
                console.log("Decoded JWT Token in getUsername:", decodedToken);

                // Check if decodedToken and its username property exist
                if (decodedToken && decodedToken.username) {
                    res.status(200).json({ username: decodedToken.username });
                } else {
                    console.error("Decoded token missing username or empty.");
                    return res.status(401).json({ message: 'Unauthorized - Invalid token (missing username) in getUsername' });
                }
            }
        });
    } else {
        console.log("No token found in getUsername");
        return res.status(401).json({ message: 'Unauthorized - No token provided in getUsername' }); // No token
    }
};

// Middleware to require authentication
exports.requireAuth = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.jwt;

    // Check if JWT exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => { // Make callback async
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(401).json({ message: 'Unauthorized - Invalid token', error: err.message }); // Invalid token and provide error details
            } else {
                console.log("Decoded JWT Token:", decodedToken);
                const user = await User.findById(decodedToken.id); // Fetch user from DB using ID from token
                if (!user) {
                    console.error("User not found in database for ID:", decodedToken.id);
                    return res.status(401).json({ message: 'Unauthorized - User not found' }); // User from token not found
                }
                req.user = { id: decodedToken.id, username: decodedToken.username }; // Attach user info (including username) to request object
                next(); // Proceed to the next middleware/controller
            }
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized - No token provided' }); // No token
    }
};