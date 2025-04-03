// backend/controllers/postController.js
const Post = require('../models/Post');
const Profile = require('../models/Profile'); // To get user profile details
const User = require('../models/User'); // To get user fullname if needed

// Get Posts for the Feed (Populate with User Info)
exports.getFeedPosts = async (req, res) => {
    try {
        // Fetch posts, sorted by newest first
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .limit(50); // Add pagination later if needed

        // Populate user details for each post using aggregation for efficiency
        const populatedPosts = await Post.aggregate([
            { $match: { _id: { $in: posts.map(p => p._id) } } }, // Match the fetched posts
            { $sort: { createdAt: -1 } }, // Ensure order is maintained
            {
                $lookup: { // Join with Profile collection
                    from: 'Profile_Info', // The actual collection name for Profiles
                    localField: 'username', // Field from Post schema
                    foreignField: 'username', // Field from Profile schema
                    as: 'authorProfile'
                }
            },
            {
                $unwind: { // Deconstruct the authorProfile array (should have 0 or 1 element)
                    path: '$authorProfile',
                    preserveNullAndEmptyArrays: true // Keep posts even if profile doesn't exist yet
                }
            },
             {
                $lookup: { // Optionally join with User collection if profile might lack name
                    from: 'Username_Pass', // The actual collection name for Users
                    localField: 'username',
                    foreignField: 'username',
                    as: 'authorUser'
                }
            },
            {
                $unwind: { // Deconstruct the authorUser array
                    path: '$authorUser',
                    preserveNullAndEmptyArrays: true // Should always find a user if username is valid
                }
            },
            {
                $project: { // Select and shape the final output
                    _id: 1,
                    content: 1,
                    imageUrls: 1,
                    likeCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    username: 1,
                    author: { // Create a nested author object
                        username: '$username',
                        // Use profile name, fallback to user fullname, fallback to username
                        name: { $ifNull: ['$authorProfile.name', { $ifNull: ['$authorUser.fullname', '$username'] }] },
                        // Use profile title, fallback to empty string
                        title: { $ifNull: ['$authorProfile.title', ''] },
                         // Use profile image, fallback to empty string (or a default placeholder)
                        image: { $ifNull: ['$authorProfile.image', ''] }
                    }
                }
            }
        ]);

        console.log(`Fetched ${populatedPosts.length} posts for feed.`);
        res.status(200).json(populatedPosts);

    } catch (error) {
        console.error('Error fetching feed posts:', error);
        res.status(500).json({ message: 'Server error while fetching posts.', error: error.message });
    }
};


// Create a new Post
exports.createPost = async (req, res) => {
    const { content } = req.body;
    const username = req.user.username; // From requireAuth middleware

    if (!content && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ message: 'Post must have content or at least one image.' });
    }
     if (!content && req.files && req.files.length > 0) {
         // Allow image-only posts if content is made optional in model (or provide default)
         // For now, let's assume content or image is required, handled above.
         // If content IS optional, remove the !content check in the first if.
    }


    try {
        // Process uploaded files (if any)
        const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : []; // Store relative paths

        const newPost = new Post({
            username: username,
            content: content || '', // Use empty string if content is not provided but images are
            imageUrls: imageUrls,
            // likeCount will default to 0
        });

        const savedPost = await newPost.save();

         // --- Populate the newly created post with author info before sending back ---
         // This ensures the frontend immediately has the necessary display data
         const populatedPost = await Post.aggregate([
            { $match: { _id: savedPost._id } },
             // Re-use the aggregation pipeline from getFeedPosts (or simplify if needed)
             {
                $lookup: { from: 'Profile_Info', localField: 'username', foreignField: 'username', as: 'authorProfile' }
             },
             { $unwind: { path: '$authorProfile', preserveNullAndEmptyArrays: true } },
             {
                $lookup: { from: 'Username_Pass', localField: 'username', foreignField: 'username', as: 'authorUser' }
             },
             { $unwind: { path: '$authorUser', preserveNullAndEmptyArrays: true } },
             {
                $project: {
                     _id: 1, content: 1, imageUrls: 1, likeCount: 1, createdAt: 1, updatedAt: 1, username: 1,
                     author: {
                         username: '$username',
                         name: { $ifNull: ['$authorProfile.name', { $ifNull: ['$authorUser.fullname', '$username'] }] },
                         title: { $ifNull: ['$authorProfile.title', ''] },
                         image: { $ifNull: ['$authorProfile.image', ''] }
                     }
                 }
             }
         ]);
        // --- End population ---

        console.log(`New post created by ${username}, ID: ${savedPost._id}`);
        // Send back the single populated post object, not an array
        res.status(201).json(populatedPost[0] || savedPost); // Send populated post if aggregation worked

    } catch (error) {
        console.error(`Error creating post for ${username}:`, error);
        // Handle potential validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error creating post', error: error.message });
    }
};

// Add other post controllers later (like, comment, delete, get single post etc.)