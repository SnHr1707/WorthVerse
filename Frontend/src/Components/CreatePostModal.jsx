// frontend/src/components/CreatePostModal.jsx
import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios'; // Using axios for easier FormData handling

// Important for accessibility: Set the app element for react-modal
Modal.setAppElement('#root'); // Or your main app container ID

const API_URL = 'http://localhost:5000/api'; // Your backend API URL

function CreatePostModal({ isOpen, onRequestClose, onPostCreated, currentUserProfile }) {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]); // Store File objects
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        if (error) setError(''); // Clear error on input change
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            setError('You can upload a maximum of 5 images.');
            return;
        }

        setImages(prevImages => [...prevImages, ...files]);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        if (error) setError(''); // Clear error on successful selection
    };

    const removeImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prevPreviews => {
            const previewToRemove = prevPreviews[indexToRemove];
            URL.revokeObjectURL(previewToRemove); // Clean up blob URL
            return prevPreviews.filter((_, index) => index !== indexToRemove);
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) {
            setError('Please write something or add an image.');
            return;
        }
        if (error) setError(''); // Clear previous errors

        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('content', content);
        images.forEach(imageFile => {
            formData.append('postImages', imageFile); // Must match multer field name 'postImages'
        });

        try {
            const response = await axios.post(`${API_URL}/posts/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // Send cookies
            });

            console.log('Post created:', response.data);
            onPostCreated(response.data); // Pass the new post data back to Home
            // Reset form and close modal
            setContent('');
            setImages([]);
            setImagePreviews([]);
            onRequestClose();

        } catch (err) {
            console.error('Error creating post:', err);
            const message = err.response?.data?.message || 'Failed to create post. Please try again.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

     // Clean up previews when modal closes or component unmounts
     const cleanupPreviews = () => {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };

    const handleClose = () => {
        cleanupPreviews();
        // Reset state if desired when closing without submitting
        // setContent('');
        // setImages([]);
        // setImagePreviews([]);
        // setError('');
        onRequestClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            onAfterClose={cleanupPreviews} // Ensure cleanup even if closed unexpectedly
            contentLabel="Create Post Modal"
            className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-70 z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40" // Ensure overlay is behind modal
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Create Post</h2>
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                    aria-label="Close modal"
                >
                    ×
                </button>

                {/* User Info Header */}
                {currentUserProfile && (
                    <div className="flex items-center mb-4">
                        <img
                            src={currentUserProfile.image || 'https://via.placeholder.com/50'}
                            alt={currentUserProfile.name || 'User'}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{currentUserProfile.name || 'Your Name'}</p>
                            {/* Optional: Add privacy settings */}
                             <p className="text-sm text-gray-500">Post visibility: Public</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="What do you want to talk about?"
                        className="w-full border border-gray-300 p-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-3 min-h-[100px]"
                        rows="4"
                        value={content}
                        onChange={handleContentChange}
                        aria-label="Post content"
                    ></textarea>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {imagePreviews.map((previewUrl, index) => (
                                <div key={index} className="relative">
                                    <img src={previewUrl} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 focus:outline-none"
                                        aria-label={`Remove image ${index + 1}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t pt-3">
                        <div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="hidden" // Hide the default input
                                id="imageUpload"
                            />
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="text-blue-500 hover:bg-gray-100 p-2 rounded-md text-sm flex items-center"
                                aria-label="Add photo"
                                disabled={images.length >= 5}
                            >
                                <i className="fas fa-photo-video mr-1"></i> Photo
                            </button>
                             {/* Add buttons for Video, Event, Article if needed later */}
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || (!content.trim() && images.length === 0)}
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>

                     {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
                    )}
                </form>
            </div>
        </Modal>
    );
}

export default CreatePostModal;