// --- START OF FILE User.js ---
// User.js
// Backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema, 'Username_Pass');