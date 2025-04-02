// --- START OF REGENERATED FILE Profile.js ---
// Profile.js
// backend/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true, unique: true }, // Link to User model's username
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    image: { type: String, default: '' }, // URL to profile image
    about: { type: String, default: '' },
    skills: [{ type: String }],
    experience: [{
        position: { type: String },
        company: { type: String },
        duration: { type: String },
        description: { type: String }
    }],
    education: [{
        degree: { type: String },
        institution: { type: String },
        year: { type: String }
    }],
    links: {
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' }
        // Add other links like LinkedIn if needed
    },
    certifications: [{
        title: { type: String },
        authority: { type: String },
        link: { type: String }
    }],
    profileViewers: { type: Number, default: 0 }, // Consider implementing later
    postImpressions: { type: Number, default: 0 }, // Consider implementing later

    // --- NEW CONNECTION FIELDS ---
    connections: [{ type: String }], // Array of usernames this user is connected with
    connectionRequestsSent: [{ type: String }], // Array of usernames this user sent requests to
    connectionRequestsReceived: [{ type: String }]

}, { timestamps: true }); 


module.exports = mongoose.model('Profile', profileSchema, 'Profile_Info');