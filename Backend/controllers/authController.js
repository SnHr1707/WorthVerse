// --- START OF FILE authController.js ---
// authController.js
// Backend/controllers/authController.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Import JWT
const User = require('../models/User');

// In-memory storage for verification codes (TEMPORARY)
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
const createToken = (id, username) => { // Include username in token payload
    return jwt.sign({ id, username }, process.env.JWT_SECRET, { // Use JWT_SECRET from .env
        expiresIn: '1h' // Token expiration time - you can adjust this
    });
};

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    verificationCodes[email] = {
        code: verificationCode,
        expiry: Date.now() + 600000 // 10 minutes expiry
    };

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'WorthVerse - Email Verification Code',
        text: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending error:', error);
            return res.status(500).json({ message: 'Failed to send verification code', error: error });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Verification code sent to your email' });
        }
    });
};

exports.checkAuth = (req, res) => {
    // If requireAuth middleware passed, it means the user is authenticated.
    // Just send a 200 OK response.
    res.status(200).json({ message: 'Authenticated' });
};

exports.signup = async (req, res) => {
    try {
        const { fullname, username, email, password, confirmpassword, verificationCode } = req.body;

        if (!fullname || !username || !email || !password || !confirmpassword || !verificationCode) {
            return res.status(400).json({ message: 'All fields are required, including verification code' });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const storedVerification = verificationCodes[email];
        if (!storedVerification || storedVerification.code !== verificationCode || storedVerification.expiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }
        delete verificationCodes[email];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
            isEmailVerified: true
        });

        await newUser.save();

        // Create JWT token
        const token = createToken(newUser._id, newUser.username); // Include username in token

        // Send token in HTTP-only cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600 * 2000 });

        res.status(201).json({ message: 'User registered and email verified successfully', username: newUser.username });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Signup failed', error: error });
    }
};

exports.login = async (req, res) => {
    try {
        const { emailorusername, password } = req.body;

        if (!emailorusername || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        const user = await User.findOne({ $or: [{ username: emailorusername }, { email: emailorusername }] });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = createToken(user._id, user.username); // Include username in token

        // Send token in HTTP-only cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600 * 1000 }); // 1 hour maxAge

        if (user) {
            return res.status(200).json({ message: "Login successful", username: user.username }); // Include username
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error });
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true }); // Clear the jwt cookie
    res.status(200).json({ message: 'Logged out successfully' });
};