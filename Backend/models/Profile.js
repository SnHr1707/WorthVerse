// backend/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true, unique: true }, // Assuming username is unique for each profile
    name: { type: String },
    title: { type: String },
    image: { type: String },
    about: { type: String },
    skills: [{ type: String }], // Array of strings
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
        github: { type: String },
        portfolio: { type: String }
    },
    certifications: [{
        title: { type: String },
        authority: { type: String },
        link: { type: String }
    }],
    profileViewers: { type: Number, default: 0 }, // Keeping these from previous model
    postImpressions: { type: Number, default: 0 }  // Keeping these from previous model
});

module.exports = mongoose.model('Profile', profileSchema, 'Profile_Info');