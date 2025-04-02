// --- START OF REGENERATED FILE User.js ---
// User.js
// Backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true }, // Added index
    email: { type: String, required: true, unique: true, index: true }, // Added index
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true }); // Added timestamps for user creation date etc.

module.exports = mongoose.model('User', userSchema, 'Username_Pass');