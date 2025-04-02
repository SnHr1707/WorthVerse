// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },
    locations: [{ type: String }],
    country: { type: String, required: true, index: true },
    level: { type: String, index: true }, // e.g., Intern, Early, Mid, Senior, Director+
    qualifications: [{ type: String }],
    skills: [{ type: String, index: true }],
    duration: { type: String }, // e.g., Full-time, Internship
    lastDate: { type: String }, // Store as string or Date, depending on needs
    roles: [{ type: String }],
    vision: { type: String },
}, { timestamps: true }); // Add timestamps for created/updated times

// Use text index for searching multiple fields easily if needed later
// jobSchema.index({ title: 'text', company: 'text', skills: 'text', country: 'text' });

module.exports = mongoose.model('Job', jobSchema, 'Jobs'); // Collection name 'Jobs'