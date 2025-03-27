// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to require authentication
exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if JWT exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(401).json({ message: 'Unauthorized - Invalid token' }); // Invalid token
            } else {
                console.log("Decoded JWT Token:", decodedToken);
                req.user = decodedToken; // Attach user info to request object
                next(); // Proceed to the next middleware/controller
            }
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized - No token provided' }); // No token
    }
};