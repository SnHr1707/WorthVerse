// Backend (server.js) - Modifications to include email verification

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // For sending emails
const crypto = require('crypto'); // For generating verification codes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'User_Info'
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema and Model (same as before)
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false } // Add email verification status
});

const User = mongoose.model('Username_Pass', userSchema, 'Username_Pass');

// In-memory storage for verification codes (TEMPORARY - for production use a database like Redis)
const verificationCodes = {};

// Nodemailer transporter setup (configure your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

// Send Verification Code Route
app.post('/api/send-verification-code', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generate a 6-character code

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
});


// Signup Route (modified to verify code)
app.post('/api/signup', async (req, res) => {
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
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});