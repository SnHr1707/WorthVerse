// --- START OF REGENERATED FILE authController.js ---
// authController.js
// Backend/controllers/authController.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Import JWT
const User = require('../models/User');
const Profile = require('../models/Profile'); // Import Profile model

// In-memory storage for verification codes (TEMPORARY - Consider Redis or DB for production)
const verificationCodes = {};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- JWT Configuration ---
const JWT_EXPIRY_SECONDS = 2 * 60 * 60; // 2 hours in seconds
const JWT_EXPIRY_MILLISECONDS = JWT_EXPIRY_SECONDS * 1000; // 2 hours in milliseconds

// Function to create JWT token
const createToken = (id, username) => {
    console.log(`Creating token for user: ${username}, id: ${id}`);
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRY_SECONDS
    });
};

// --- Controller Functions ---

// Send Verification Code
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
         return res.status(400).json({ message: 'Invalid email format' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    verificationCodes[email] = {
        code: verificationCode,
        expiry: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };
    console.log(`Generated verification code ${verificationCode} for ${email}`);

    const mailOptions = {
        from: `"WorthVerse" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'WorthVerse - Email Verification Code',
        text: `Your WorthVerse verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.`,
        html: `<p>Your WorthVerse verification code is: <strong>${verificationCode}</strong></p><p>This code will expire in 10 minutes.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully to ${email}`);
        return res.status(200).json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error(`Email sending error to ${email}:`, error);
        return res.status(500).json({ message: 'Failed to send verification code.', error: error.message });
    }
};

// Check Authentication Status
exports.checkAuth = (req, res) => {
    // requireAuth middleware populates req.user if token is valid
    console.log(`Check Auth successful for user: ${req.user.username}`);
    res.status(200).json({
        isAuthenticated: true,
        message: 'Authenticated',
        user: {
            username: req.user.username,
            id: req.user.id
        }
     });
    // If middleware failed, it would have sent a 401 response already
};

// Signup
exports.signup = async (req, res) => {
    try {
        const { fullname, username, email, password, confirmpassword, verificationCode } = req.body;

        // Input Validation (Simplified for brevity, keep your original detailed checks)
        if (!fullname || !username || !email || !password || !confirmpassword || !verificationCode) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        // Add other validations (email format, password length, username format) here...

        // Check Existing User
        const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (existingUser) {
            let conflictField = existingUser.username === username ? 'Username' : 'Email';
            console.warn(`Signup conflict: ${conflictField} '${existingUser.username === username ? username : email}' already exists.`);
            return res.status(409).json({ message: `${conflictField} already exists.` });
        }

        // Verify Code
        const storedVerification = verificationCodes[email];
        if (!storedVerification || storedVerification.expiry < Date.now() || storedVerification.code !== verificationCode.toUpperCase()) {
            delete verificationCodes[email]; // Clean up invalid/expired code attempt
             console.warn(`Signup attempt with invalid/expired code for email: ${email}`);
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }
        delete verificationCodes[email]; // Verification successful, remove code
        console.log(`Verification code validated for ${email}`);

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
        const newUser = new User({
            fullname, username, email,
            password: hashedPassword,
            isEmailVerified: true
        });
        await newUser.save();
        console.log(`New user created: ${username}, ID: ${newUser._id}`);

        // Create Basic Profile
        const newProfile = new Profile({ username: newUser.username, name: newUser.fullname });
        await newProfile.save();
        console.log(`Basic profile created for user: ${username}`);

        // Create JWT Token
        const token = createToken(newUser._id, newUser.username);

        // Send Token in HTTP-only Cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax', // Or 'Strict' or 'None' (if needed for cross-site, requires secure=true)
            maxAge: JWT_EXPIRY_MILLISECONDS,
            path: '/' // **** ADDED: Ensure cookie is accessible site-wide ****
        });
        console.log(`JWT cookie set for user: ${username} with path=/`);

        // Send Success Response
        res.status(201).json({
            message: 'User registered and email verified successfully',
            user: { id: newUser._id, username: newUser.username, fullname: newUser.fullname, email: newUser.email }
         });

    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 11000) {
             return res.status(409).json({ message: 'Username or email conflict during save.', error: error.message });
        }
        res.status(500).json({ message: 'Signup failed due to server error', error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { emailorusername, password } = req.body;

        if (!emailorusername || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ $or: [{ username: emailorusername }, { email: emailorusername }] });
        if (!user) {
            console.warn(`Login failed: User not found - ${emailorusername}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.warn(`Login failed: Incorrect password for user - ${user.username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Login Successful
        console.log(`Login successful for user: ${user.username}, ID: ${user._id}`);

        // Create JWT Token
        const token = createToken(user._id, user.username);

        // --- Send Token in HTTP-only Cookie ---
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure matches logout setting
            sameSite: 'Lax', // Ensure matches logout setting ('Strict'/'None' also possible)
            maxAge: JWT_EXPIRY_MILLISECONDS, // Max age in milliseconds
            path: '/' // **** ADDED: Crucial for ensuring logout can clear it ****
        });
        console.log(`JWT cookie set for user: ${user.username} with path=/`);

        // Send Success Response
        return res.status(200).json({
            message: "Login successful",
            user: { id: user._id, username: user.username, fullname: user.fullname, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed due to server error', error: error.message });
    }
};

// Logout
exports.logout = (req, res) => {
    console.log("Logout requested. Clearing cookie...");
    // Clear the JWT cookie by setting empty value, past expiry, and MATCHING options used during login
    res.cookie('jwt', '', { // Set value to empty string
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Must match login setting
        sameSite: 'Lax', // Must match login setting ('Strict'/'None')
        expires: new Date(0), // Set expiry date to the past
        path: '/' // **** ADDED: Must match the path used during login ****
     });
    console.log("JWT cookie cleared with path=/.");
    res.status(200).json({ message: 'Logged out successfully' });
};
// --- END OF REGENERATED FILE authController.js ---