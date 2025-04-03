// backend/routes/postRoutes.js
const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadPostImages } = require('../middleware/uploadMiddleware'); // Import the upload middleware

const router = express.Router();

// Get posts for the feed - Requires authentication
router.get('/feed', authMiddleware.requireAuth, postController.getFeedPosts);

// Create a new post - Requires authentication and handles image uploads
router.post(
    '/create',
    authMiddleware.requireAuth,
    uploadPostImages, // Use multer middleware to handle 'postImages' field
    postController.createPost
);

// Add other routes later (e.g., liking, commenting, deleting)
// router.post('/:postId/like', authMiddleware.requireAuth, postController.likePost);
// router.delete('/:postId/unlike', authMiddleware.requireAuth, postController.unlikePost);
// router.post('/:postId/comment', authMiddleware.requireAuth, postController.addComment);
// router.delete('/:postId', authMiddleware.requireAuth, postController.deletePost); // Ensure user owns the post

module.exports = router;