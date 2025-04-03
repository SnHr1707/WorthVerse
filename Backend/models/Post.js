// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: { // References the User who made the post
        type: String,
        required: true,
        index: true,
        ref: 'User' // Logical reference to the User model (using username)
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrls: [{ // Array of URLs/paths for uploaded images
        type: String
    }],
    likeCount: { // Simple like counter
        type: Number,
        default: 0
    },
    // Optional: For actual 'who liked' functionality
    // likes: [{
    //     type: mongoose.Schema.Types.ObjectId, // Reference User _id
    //     ref: 'User'
    // }],
    // Optional: For comments
    // comments: [{
    //     username: { type: String, required: true, ref: 'User' },
    //     text: { type: String, required: true },
    //     createdAt: { type: Date, default: Date.now }
    // }],
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Optional: Create an index for faster querying by username and creation time
postSchema.index({ username: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema, 'Posts'); // Collection name: 'Posts'