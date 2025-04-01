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

// Function to create JWT token
const JWT_EXPIRY_SECONDS = 2 * 60 * 60; // 2 hours in seconds
const JWT_EXPIRY_MILLISECONDS = JWT_EXPIRY_SECONDS * 1000; // 2 hours in milliseconds

const createToken = (id, username) => { // Include username in token payload
    console.log(`Creating token for user: ${username}, id: ${id}`);
    return jwt.sign({ id, username }, process.env.JWT_SECRET, { // Use JWT_SECRET from .env
        expiresIn: JWT_EXPIRY_SECONDS // Use the constant for expiry
    });
};

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
         return res.status(400).json({ message: 'Invalid email format' });
    }

    // Optional: Check if email is already registered and verified? Depends on desired flow.
    // const existingUser = await User.findOne({ email: email });
    // if (existingUser && existingUser.isEmailVerified) {
    //     return res.status(409).json({ message: 'Email already registered and verified.' });
    // }

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    verificationCodes[email] = {
        code: verificationCode,
        expiry: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };
    console.log(`Generated verification code ${verificationCode} for ${email}`);

    const mailOptions = {
        from: `"WorthVerse" <${process.env.EMAIL_USER}>`, // Add a sender name
        to: email,
        subject: 'WorthVerse - Email Verification Code',
        text: `Your WorthVerse verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes. If you did not request this, please ignore this email.`,
        html: `<p>Your WorthVerse verification code is: <strong>${verificationCode}</strong></p><p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>` // Add HTML version
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully to ${email}`);
        return res.status(200).json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error(`Email sending error to ${email}:`, error);
        // Clean up code if sending failed? Maybe not needed immediately.
        // delete verificationCodes[email];
        return res.status(500).json({ message: 'Failed to send verification code. Please try again later.', error: error.message });
    }
};

// Check if the current user (based on cookie) is authenticated
exports.checkAuth = (req, res) => {
    // If requireAuth middleware passed, it means the user is authenticated.
    // req.user should contain { id, username }
    console.log(`Check Auth successful for user: ${req.user.username}`);
    res.status(200).json({
        isAuthenticated: true,
        message: 'Authenticated',
        user: { // Send back username for frontend state if needed
            username: req.user.username,
            id: req.user.id
        }
     });
};

exports.signup = async (req, res) => {
    try {
        const { fullname, username, email, password, confirmpassword, verificationCode } = req.body;

        // --- Input Validation ---
        if (!fullname || !username || !email || !password || !confirmpassword || !verificationCode) {
            return res.status(400).json({ message: 'All fields are required, including verification code' });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        // Add basic validation for username (e.g., length, characters)
        if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
             return res.status(400).json({ message: 'Username must be at least 3 characters long and contain only letters, numbers, and underscores.' });
        }
        if (password.length < 6) { // Example: Minimum password length
             return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
             return res.status(400).json({ message: 'Invalid email format' });
        }

        // --- Check Existing User ---
        const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (existingUser) {
            let conflictField = existingUser.username === username ? 'Username' : 'Email';
            console.warn(`Signup conflict: ${conflictField} '${existingUser.username === username ? username : email}' already exists.`);
            return res.status(409).json({ message: `${conflictField} already exists. Please choose another.` });
        }

        // --- Verify Code ---
        const storedVerification = verificationCodes[email];
        if (!storedVerification || storedVerification.expiry < Date.now()) {
             console.warn(`Signup attempt with missing/expired code for email: ${email}`);
            return res.status(400).json({ message: 'Verification code expired or not found. Please request a new one.' });
        }
         if (storedVerification.code !== verificationCode.toUpperCase()) { // Compare against uppercase
            console.warn(`Signup attempt with invalid code for email: ${email}`);
            return res.status(400).json({ message: 'Invalid verification code.' });
        }
        // Verification successful, remove code
        delete verificationCodes[email];
        console.log(`Verification code validated for ${email}`);

        // --- Hash Password ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Create New User ---
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
            isEmailVerified: true // Mark as verified since code was checked
        });
        await newUser.save();
        console.log(`New user created successfully: ${username}, ID: ${newUser._id}`);

        // --- Create Basic Profile (Important!) ---
        // Create a corresponding profile document upon successful user registration.
        const newProfile = new Profile({
            username: newUser.username,
            name: newUser.fullname, // Initialize name from fullname
            // Add other default fields if necessary
        });
        await newProfile.save();
        console.log(`Basic profile created for user: ${username}`);


        // --- Create JWT Token ---
        const token = createToken(newUser._id, newUser.username); // Include username in token

        // --- Send Token in HTTP-only Cookie ---
        res.cookie('jwt', token, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
            sameSite: 'Lax', // Mitigates CSRF attacks
            maxAge: JWT_EXPIRY_MILLISECONDS // Use constant for expiry (in milliseconds)
        });
        console.log(`JWT cookie set for user: ${username}`);

        // --- Send Success Response ---
        res.status(201).json({
            message: 'User registered and email verified successfully',
            user: { // Send back user info
                 id: newUser._id,
                 username: newUser.username,
                 fullname: newUser.fullname,
                 email: newUser.email
            }
         });

    } catch (error) {
        console.error('Signup error:', error);
        // Handle potential DB errors (e.g., duplicate key if check failed somehow)
        if (error.code === 11000) { // Duplicate key error code
             return res.status(409).json({ message: 'Username or email conflict during save.', error: error.message });
        }
        res.status(500).json({ message: 'Signup failed due to server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { emailorusername, password } = req.body;

        if (!emailorusername || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        // Find user by email or username
        const user = await User.findOne({
             $or: [{ username: emailorusername }, { email: emailorusername }]
        });

        if (!user) {
            console.warn(`Login attempt failed: User not found - ${emailorusername}`);
            return res.status(401).json({ message: 'Invalid credentials' }); // Generic message for security
        }

        // Compare provided password with hashed password in DB
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.warn(`Login attempt failed: Incorrect password for user - ${user.username}`);
            return res.status(401).json({ message: 'Invalid credentials' }); // Generic message
        }

        // Optional: Check if email is verified before allowing login?
        // if (!user.isEmailVerified) {
        //     console.warn(`Login attempt blocked: Email not verified for user - ${user.username}`);
        //     return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
        // }

        // --- Login Successful ---
        console.log(`Login successful for user: ${user.username}, ID: ${user._id}`);

        // --- Create JWT Token ---
        const token = createToken(user._id, user.username);

        // --- Send Token in HTTP-only Cookie ---
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: JWT_EXPIRY_MILLISECONDS // Use constant
        });
        console.log(`JWT cookie set for user: ${user.username}`);

        // --- Send Success Response ---
        return res.status(200).json({
            message: "Login successful",
            user: { // Send back user info
                 id: user._id,
                 username: user.username,
                 fullname: user.fullname,
                 email: user.email
             }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed due to server error', error: error.message });
    }
};

exports.logout = (req, res) => {
    // Clear the JWT cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        expires: new Date(0) // Set expiry date to the past
     });
    console.log("User logged out, JWT cookie cleared.");
    res.status(200).json({ message: 'Logged out successfully' });
};