// Backend/controllers/authController.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User'); // Import User model

// In-memory storage for verification codes (TEMPORARY)
const verificationCodes = {};

// Nodemailer transporter setup (Make sure EMAIL_USER and EMAIL_PASS are in your .env and loaded in server.js)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendVerificationCode = async (req, res) => { // Export functions
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

exports.signup = async (req, res) => {
    try {
        const { fullname, username, email, password, confirmpassword, verificationCode } = req.body;

        // Basic validation
        if (!fullname || !username || !email || !password || !confirmpassword || !verificationCode) {
            return res.status(400).json({ message: 'All fields are required, including verification code' });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Verify verification code
        const storedVerification = verificationCodes[email];
        if (!storedVerification || storedVerification.code !== verificationCode || storedVerification.expiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }
        delete verificationCodes[email]; // Remove code after successful verification

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
            isEmailVerified: true // Mark email as verified
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: 'User registered and email verified successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Signup failed', error: error });
    }
};

exports.login = async (req, res) => { // Implement login controller
    try {
        const { emailorusername, password } = req.body;

        if (!emailorusername || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required' });
        }

        const user = await User.findOne({ $or: [{ username: emailorusername }, { email: emailorusername }] });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' }); // 200 OK
        // In a real app, you would generate and send a JWT here for session management
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error }); // 500 Internal Server Error
    }
};