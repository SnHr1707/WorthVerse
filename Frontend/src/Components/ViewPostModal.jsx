// frontend/src/components/ViewPostModal.jsx
import React from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom'; // Import Link

// Modal.setAppElement('#root'); // Assuming this is already done in App.js or index.js

// Use backendUrl prop if passed, otherwise default
function ViewPostModal({ isOpen, onRequestClose, post, backendUrl = 'http://localhost:5000' }) {
    if (!post) return null;

    const calculateTimeAgo = (isoDateString) => {
        // ... (keep existing calculateTimeAgo function)
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const now = new Date();
        const secondsPast = (now.getTime() - date.getTime()) / 1000;

        if (secondsPast < 60) { return parseInt(secondsPast) + 's ago'; }
        if (secondsPast < 3600) { return parseInt(secondsPast / 60) + 'm ago'; }
        if (secondsPast <= 86400) { return parseInt(secondsPast / 3600) + 'h ago'; }
        const days = parseInt(secondsPast / 86400);
        if (days < 7) { return days + 'd ago'; }
        return date.toLocaleDateString();
    };

    const sliderSettings = {
        dots: true,
        infinite: post.imageUrls && post.imageUrls.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: post.imageUrls && post.imageUrls.length > 1,
        adaptiveHeight: true,
    };

    const getImageUrl = (url) => `${backendUrl}${url}`;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="View Post Modal"
            // *** MODAL POSITIONING CHANGE ***
            // Position fixed, STARTING below the navbar (top-16 = 64px)
            // flex items-center justify-center for centering the content box
            // bg-opacity to dim the background
            className="fixed top-16 left-0 right-0 bottom-0 flex items-center justify-center p-4 bg-black bg-opacity-75 z-50"
            // Overlay covers everything, slightly less opaque
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-40"
            shouldCloseOnOverlayClick={true} // Good user experience
        >
            {/* Content container: max-width, background, rounded, shadow */}
            {/* *** MAX HEIGHT ADJUSTMENT *** */}
            {/* max-h constrained to fit within viewport below navbar */}
            {/* flex flex-col allows header/content/footer structure if needed */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl md:max-w-2xl lg:max-w-3xl p-0 relative max-h-[calc(100vh-80px)] flex flex-col">
                {/* Close button positioned relative to this container */}
                 <button
                    onClick={onRequestClose}
                    // Adjusted position slightly for better placement within the rounded box
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl z-10"
                    aria-label="Close modal"
                 >
                    × {/* Use HTML entity for '×' */}
                </button>

                {/* Scrollable Content Area */}
                {/* Added overflow-y-auto and padding (p-5) */}
                <div className="flex-grow overflow-y-auto p-5">
                    {/* Author Info */}
                    <div className="flex items-start space-x-3 mb-4">
                         <Link to={`/profile/${post.author?.username}`} onClick={onRequestClose}> {/* Close modal on click */}
                            <img
                                src={post.author?.image ? getImageUrl(post.author.image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || post.author?.username || '?')}&background=random&size=50`}
                                alt={post.author?.name || post.author?.username || 'Author'}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || post.author?.username || '?')}&background=random&size=50`; }}
                            />
                        </Link>
                        <div className="flex-grow min-w-0"> {/* Added min-w-0 */}
                             <Link to={`/profile/${post.author?.username}`} onClick={onRequestClose} className="hover:underline">
                                 <h3 className="font-semibold text-md text-gray-900 truncate" title={post.author?.name || post.author?.username}>
                                     {post.author?.name || post.author?.username || 'Unknown Author'}
                                 </h3>
                             </Link>
                             {post.author?.title && <p className="text-gray-600 text-sm truncate" title={post.author.title}>{post.author.title}</p>}
                             <div className="flex items-center space-x-1 text-gray-500 text-xs mt-0.5">
                                <span>{calculateTimeAgo(post.createdAt)}</span>
                                <i className="fas fa-circle text-[3px] mx-1"></i>
                                <i className="fas fa-globe-asia" title="Public"></i>
                            </div>
                        </div>
                         {/* Optional: More actions button */}
                         <button className="ml-auto text-gray-500 hover:text-gray-700 p-1 flex-shrink-0">
                            <i className="fas fa-ellipsis-h"></i>
                        </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 text-sm mb-4 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </p>

                     {/* Image Carousel */}
                     {post.imageUrls && post.imageUrls.length > 0 && (
                        <div className="mb-4 bg-gray-100 rounded-md overflow-hidden">
                             {post.imageUrls.length === 1 ? (
                                <img
                                    src={getImageUrl(post.imageUrls[0])}
                                    alt="Post image 1"
                                    className="w-full h-auto max-h-[60vh] object-contain" // contain keeps aspect ratio
                                    onError={(e) => { console.error(`Error loading image: ${getImageUrl(post.imageUrls[0])}`); e.target.style.display='none'; }}
                                />
                            ) : (
                                <Slider {...sliderSettings}>
                                    {post.imageUrls.map((url, index) => (
                                        <div key={index}>
                                            <img
                                                src={getImageUrl(url)}
                                                alt={`Post image ${index + 1}`}
                                                className="w-full h-auto max-h-[60vh] object-contain mx-auto" // Center image
                                                onError={(e) => { console.error(`Error loading image: ${getImageUrl(url)}`); /* Optionally add placeholder */ }}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </div>
                    )}

                     {/* Like/Comment Count (Optional, can combine with buttons) */}
                     {(post.likeCount > 0 /* || post.commentCount > 0 */ ) && (
                         <div className="text-xs text-gray-500 mb-2 pb-2 border-b border-gray-100">
                             {post.likeCount > 0 && (
                                 <span className="hover:underline cursor-pointer mr-3">{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</span>
                             )}
                             {/* Add comment count display later */}
                             {/* {post.commentCount > 0 && (
                                <span className="hover:underline cursor-pointer">{post.commentCount} comments</span>
                             )} */}
                         </div>
                     )}

                     {/* Action Buttons Bar */}
                    <div className="border-t border-gray-200 pt-3 flex justify-around text-gray-700 text-sm">
                         {/* Like Button (Functionality needs state management within Modal or passed down) */}
                         <button className="hover:text-blue-500 flex items-center space-x-1 px-3 py-2 rounded hover:bg-gray-100">
                            <i className="far fa-thumbs-up pt-0.5"></i>
                            <span className="pl-0.5">Like</span>
                             {/* Displaying count here might be redundant if shown above */}
                             {/* {post.likeCount > 0 && <span className="text-black text-xs ml-1 pt-0.5">{post.likeCount}</span>} */}
                        </button>

                        {/* Comment Button (Disabled) */}
                        <button
                            className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-gray-100 text-gray-500 cursor-not-allowed"
                            disabled
                            title="Comment (coming soon)"
                        >
                            <i className="far fa-comment pt-0.5"></i>
                            <span className="pl-0.5">Comment</span>
                        </button>

                        {/* Share Button (Disabled) */}
                        <button
                            className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-gray-100 text-gray-500 cursor-not-allowed"
                            disabled
                            title="Share (coming soon)"
                        >
                            <i className="fas fa-share pt-0.5"></i>
                            <span className="pl-0.5">Share</span>
                        </button>

                        {/* Send Button (Disabled) */}
                         <button
                            className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-gray-100 text-gray-500 cursor-not-allowed"
                            disabled
                            title="Send (coming soon)"
                         >
                            <i className="fas fa-paper-plane pt-0.5"></i>
                            <span className="pl-0.5">Send</span>
                        </button>
                    </div>

                     {/* Comment Section Placeholder (Keep commented out) */}
                    {/* <div className="border-t border-gray-200 mt-4 pt-4">
                        <h4 className="text-md font-semibold mb-2">Comments</h4>
                        {/* Add comment input and display comments here * /}
                        <p className="text-sm text-gray-500">Comments are coming soon!</p>
                    </div> */}
                </div> {/* End Scrollable Content Area */}
            </div> {/* End Content Container */}
        </Modal>
    );
}

export default ViewPostModal;