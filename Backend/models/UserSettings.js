// backend/models/UserSettings.js
const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
    username: { // Link to User model's username
        type: String,
        required: true,
        index: true,
        unique: true,
        ref: 'User'
    },
    account: {
        allowUsernameChanges: { type: Boolean, default: true }, // Example setting
        // Add other account-related settings if needed
    },
    security: {
        passwordLastChanged: { type: Date, default: null },
        twoFactorEnabled: { type: Boolean, default: false }, // Example setting
        // Add other security settings
    },
    privacy: {
        profileVisibility: {
            type: String,
            enum: ['Public', 'ConnectionsOnly', 'Private'],
            default: 'Public'
        },
        showOnlineStatus: { type: Boolean, default: true },
        allowConnectionRequests: { type: Boolean, default: true },
        // Add other privacy settings
    },
    notifications: {
        emailNotificationsEnabled: { type: Boolean, default: true }, // General toggle
        notifyNewConnections: { type: Boolean, default: true },
        notifyPostLikes: { type: Boolean, default: false },
        notifyPostComments: { type: Boolean, default: true },
        // Add more specific notification settings
    },
    theme: {
        mode: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        }
        // Add other theme settings like accent color if needed
    }
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('UserSettings', userSettingsSchema, 'User_Settings'); // Collection name: 'User_Settings'