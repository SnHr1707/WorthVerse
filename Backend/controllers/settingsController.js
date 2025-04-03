// backend/controllers/settingsController.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const UserSettings = require("../models/UserSettings");
const Post = require('../models/Post'); 

// --- JWT Configuration (duplicate from authController - consider centralizing) ---
const JWT_EXPIRY_SECONDS = 2 * 60 * 60; // 2 hours
const JWT_EXPIRY_MILLISECONDS = JWT_EXPIRY_SECONDS * 1000;

// Function to create JWT token (duplicate from authController - consider centralizing)
const createToken = (id, username) => {
    console.log(`Creating token for user: ${username}, id: ${id}`);
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRY_SECONDS
    });
};

// Helper to get or create settings
const getOrCreateSettings = async (username) => {
    let settings = await UserSettings.findOne({ username });
    if (!settings) {
        console.log(`No settings found for ${username}. Creating default settings.`);
        settings = new UserSettings({ username });
        await settings.save();
    }
    return settings;
};

// 1. Get User Settings
exports.getUserSettings = async (req, res) => {
    const username = req.user.username;
    try {
        const settings = await getOrCreateSettings(username);
        res.status(200).json(settings);
    } catch (error) {
        console.error(`Error fetching settings for ${username}:`, error);
        res.status(500).json({ message: 'Failed to fetch settings.', error: error.message });
    }
};

// 2. Update General User Settings (Privacy, Notifications, Theme, etc.)
exports.updateUserSettings = async (req, res) => {
    const username = req.user.username;
    // Exclude sensitive fields like username, passwordLastChanged from direct update via this route
    const { account, security, ...allowedUpdates } = req.body;

    try {
        const settings = await UserSettings.findOneAndUpdate(
            { username },
            { $set: allowedUpdates }, // Use $set to update only provided fields in privacy, notifications, theme etc.
            { new: true, runValidators: true, upsert: false } // Don't create here, should exist
        );

        if (!settings) {
            // This shouldn't happen if getOrCreateSettings is used on fetch, but handle defensively
             return res.status(404).json({ message: 'Settings not found for this user.' });
        }

        console.log(`General settings updated for ${username}`);
        res.status(200).json({ message: 'Settings updated successfully', settings });

    } catch (error) {
        console.error(`Error updating general settings for ${username}:`, error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Failed to update settings.', error: error.message });
    }
};


// 3. Change Username
exports.changeUsername = async (req, res) => {
    const currentUsername = req.user.username;
    const userId = req.user.id;
    const { newUsername, currentPassword } = req.body;

    // Basic Validation
    if (!newUsername || !currentPassword) {
        return res.status(400).json({ message: 'New username and current password are required.' });
    }
    if (newUsername === currentUsername) {
        return res.status(400).json({ message: 'New username cannot be the same as the current username.' });
    }
    // Add username format validation if needed (e.g., regex)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Example: 3-20 alphanumeric chars or underscores
    if (!usernameRegex.test(newUsername)) {
         return res.status(400).json({ message: 'Invalid username format. Use 3-20 alphanumeric characters or underscores.' });
    }

    // --- Database Transaction (Highly Recommended for multi-document updates) ---
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Verify Current Password
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'User not found.' });
        }
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // 2. Check if New Username is Taken
        const existingUser = await User.findOne({ username: newUsername }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: 'Username already taken. Please choose another.' });
        }

        // --- Perform Updates within the Transaction ---
        // 3. Update User document
        await User.updateOne({ _id: userId }, { $set: { username: newUsername } }).session(session);

        // 4. Update Profile document
        await Profile.updateOne({ username: currentUsername }, { $set: { username: newUsername } }).session(session);

        // 5. Update UserSettings document
        await UserSettings.updateOne({ username: currentUsername }, { $set: { username: newUsername } }).session(session);

        // 6. Update Posts authored by the user
        await Post.updateMany({ username: currentUsername }, { $set: { username: newUsername } }).session(session);

        // 7. **CRITICAL & COMPLEX**: Update connections/requests arrays in OTHER users' profiles
        // This is very resource-intensive. Consider if this is truly necessary or if using user IDs is better.
        // --- Option A: Update references (SLOW, potentially locks many documents) ---
        await Profile.updateMany(
            { connections: currentUsername },
            { $set: { "connections.$": newUsername } } // Update specific element if possible (might need specific MongoDB version/syntax)
            // Safer but slower: { $pull: { connections: currentUsername } } then { $addToSet: { connections: newUsername } } (needs careful testing)
        ).session(session);
        await Profile.updateMany(
            { connectionRequestsSent: currentUsername },
            { $set: { "connectionRequestsSent.$": newUsername } }
        ).session(session);
        await Profile.updateMany(
            { connectionRequestsReceived: currentUsername },
             { $set: { "connectionRequestsReceived.$": newUsername } }
        ).session(session);
        // TODO: Thoroughly test the array updates or reconsider data model (using IDs).
        // For simplicity in this example, let's assume the above works or accept the limitation.

        // --- Commit Transaction ---
        await session.commitTransaction();
        console.log(`Username changed successfully from ${currentUsername} to ${newUsername}`);

        // --- Update JWT ---
        const token = createToken(userId, newUsername); // Create new token with updated username
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: JWT_EXPIRY_MILLISECONDS,
            path: '/'
        });
        console.log(`JWT cookie updated for renamed user: ${newUsername}`);

        res.status(200).json({ message: 'Username changed successfully.', newUsername: newUsername });

    } catch (error) {
        console.error(`Error changing username for ${currentUsername}:`, error);
        await session.abortTransaction(); // Rollback on error
        res.status(500).json({ message: 'Failed to change username due to server error.', error: error.message });
    } finally {
        session.endSession(); // Always end the session
    }
};


// 4. Change Password
exports.changePassword = async (req, res) => {
    const username = req.user.username;
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'All password fields are required.' });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'New passwords do not match.' });
    }
    if (newPassword.length < 6) { // Example minimum length
         return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }
    if (newPassword === currentPassword) {
        return res.status(400).json({ message: 'New password must be different from the current password.' });
    }

    try {
        // 1. Find User and Verify Current Password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // 2. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update User Password
        user.password = hashedNewPassword;
        await user.save();

        // 4. Update Password Last Changed Date in Settings
        const now = new Date();
        await UserSettings.updateOne(
            { username: username },
            { $set: { 'security.passwordLastChanged': now } },
            { upsert: true } // Create settings if they don't exist yet
        );

        console.log(`Password changed successfully for user ${username}`);

        // Optionally: Log out other sessions by invalidating old tokens (more advanced)

        res.status(200).json({ message: 'Password changed successfully.' });

    } catch (error) {
        console.error(`Error changing password for ${username}:`, error);
        res.status(500).json({ message: 'Failed to change password due to server error.', error: error.message });
    }
};