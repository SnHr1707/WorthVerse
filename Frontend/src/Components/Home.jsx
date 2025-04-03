// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react'; // Removed useContext
import { Link } from 'react-router-dom';
import axios from 'axios';
// Removed: import { AuthContext } from '../context/AuthContext';

// Import Modals
import CreatePostModal from './CreatePostModal'; // Ensure correct path
import ViewPostModal from './ViewPostModal';

const API_URL = 'http://localhost:5000/api';
const BACKEND_URL = 'http://localhost:5000'; // Base URL for images

function Home() {
    // Removed: const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState(null); // Logged-in user's profile
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [fetchError, setFetchError] = useState(null); // Combined error state

    // State for Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedPostForView, setSelectedPostForView] = useState(null);

    // State for interactions (Example - implement fully later)
    const [likedPosts, setLikedPosts] = useState({}); // { postId: true/false }

    // --- Data Fetching ---
    const fetchPosts = async () => {
        // setLoadingPosts(true); // Handled by initial state
        // setFetchError(null); // Reset error before fetch if needed
        try {
            const response = await axios.get(`${API_URL}/posts/feed`, {
                withCredentials: true, // Important for sending cookies
            });
            setPosts(response.data);
            console.log("Fetched posts:", response.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setFetchError(err.response?.data?.message || 'Failed to load feed. Please try again later.');
            setPosts([]); // Clear posts on error
        } finally {
            setLoadingPosts(false);
        }
    };

    const fetchMyData = async () => {
        setLoadingProfile(true);
        setFetchError(null); // Reset error before fetching profile/user data
        let loggedInUsername = null; // To store username if profile fetch fails

        try {
            // 1. Attempt to fetch the full profile for the logged-in user
            const profileResponse = await axios.get(`${API_URL}/profile/me`, {
                withCredentials: true,
            });
            console.log("Fetched my profile:", profileResponse.data.profile);
            setProfile(profileResponse.data.profile); // Success! Set the full profile

        } catch (profileErr) {
            console.warn('Error fetching logged-in user profile:', profileErr);

            // 2. If profile fetch failed, check if the user is still logged in
            //    by fetching basic user info (which only requires a valid token)
            try {
                const userMeResponse = await axios.get(`${API_URL}/user/me`, {
                    withCredentials: true,
                });
                loggedInUsername = userMeResponse.data.username;
                console.log("Fetched logged-in username:", loggedInUsername);

                // 3. Decide what profile state to set based on the original error
                if (profileErr.response?.status === 404) {
                    // Profile doesn't exist yet, but user is logged in. Create minimal profile.
                    console.log("User profile not created yet, creating placeholder.");
                    setProfile({
                        username: loggedInUsername,
                        name: '', // Or fetch fullname if user/me provided it
                        title: '',
                        image: '', // Use default placeholder later
                        connections: [], // Default empty arrays
                        profileViewers: 0,
                        needsUpdate: true, // Flag to indicate profile needs creation/update
                    });
                     // Optionally set a less severe error or info message
                     // setFetchError("Profile not found. Please update your profile.");

                } else {
                    // Different error fetching profile (e.g., 500), but user is logged in.
                    // Set minimal profile, but indicate an error loading full details.
                     setProfile({
                        username: loggedInUsername,
                        name: 'Error Loading Name',
                        title: 'Error Loading Title',
                        image: '',
                        connections: [],
                        profileViewers: 0,
                        fetchError: true // Flag indicating incomplete data due to error
                    });
                     setFetchError(profileErr.response?.data?.message || 'Failed to load full profile details.');
                }

            } catch (userMeErr) {
                // Failed to get even basic user info - likely not logged in or token expired
                console.error('Error fetching /user/me, user likely not authenticated:', userMeErr);
                setProfile(null); // No profile data available
                // Handle based on status code from userMeErr if needed
                 if (userMeErr.response?.status === 401) {
                     setFetchError('Authentication required. Please log in.');
                     // Optionally redirect to login: navigate('/login');
                 } else {
                     setFetchError('Could not verify user session.');
                 }
            }
        } finally {
            setLoadingProfile(false);
        }
    };


    useEffect(() => {
        // Fetch posts and user's profile/basic info concurrently
        Promise.all([fetchPosts(), fetchMyData()])
            .catch(err => {
                // This catch is mostly for unhandled promise rejections,
                // individual errors are handled within the fetch functions
                console.error("Error during initial data fetch:", err);
                setFetchError("An unexpected error occurred during initial load.");
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Fetch on mount


    // --- Modal Handlers ---
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    const openViewModal = (post) => {
        setSelectedPostForView(post);
        setIsViewModalOpen(true);
    };
    const closeViewModal = () => {
        setSelectedPostForView(null);
        setIsViewModalOpen(false);
    };


    // --- Post Creation Handler ---
    const handlePostCreated = (newPost) => {
        // Add the new post to the top of the feed
        setPosts(prevPosts => [newPost, ...prevPosts]);
        // Optional: Maybe update profile post count if tracked
    };

    // --- Interaction Handlers (Example) ---
    const toggleLike = (postId) => {
        // TODO: Implement API call to like/unlike post
        console.log(`Toggling like for post ${postId}`);
        setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
        // After API call succeeds, update the actual like count in the 'posts' state
    };

    // --- Helper Functions ---
    const calculateTimeAgo = (isoDateString) => {
        // (Keep your existing calculateTimeAgo function)
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

    // --- Render Logic ---
    const renderPostImages = (imageUrls) => {
        // (Keep your existing renderPostImages function)
        if (!imageUrls || imageUrls.length === 0) return null;
        const getImageUrl = (url) => `${BACKEND_URL}${url}`;
        const gridClass = imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
        const imageBaseClass = "rounded-md w-full object-cover cursor-pointer";

        return (
            <div className={`grid ${gridClass} gap-1 mt-2`}>
                {imageUrls.slice(0, 4).map((url, index) => (
                    <img
                        key={index}
                        src={getImageUrl(url)}
                        alt={`Post content ${index + 1}`}
                        className={`${imageBaseClass} ${imageUrls.length > 1 ? 'h-32 md:h-40' : 'h-auto max-h-96'}`}
                    />
                ))}
            </div>
        );
    };


    return (
        <div className="bg-gray-100 font-sans antialiased min-h-full">
            {/* Container with max height */}
            {/* Adjust height based on your Navbar height */}
            <div className="container mx-auto px-2 sm:px-4 py-4 h-[calc(100vh-64px)]">
                <div className="flex w-full max-w-7xl mx-auto h-full gap-x-4">

                    {/* --- Left Sidebar (Fixed Width, Not Scrolling) --- */}
                    <div className="w-1/4 hidden md:block flex-shrink-0 mt-8">
                        {/* Adjust top based on Navbar height + padding */}
                        <div className="bg-white rounded-lg shadow-md p-4 sticky top-[80px]">
                            {loadingProfile ? (
                                <div className="text-center p-4 flex flex-col items-center justify-center">
                                     <i className="fas fa-spinner fa-spin text-indigo-500 text-2xl mb-2"></i>
                                     <span className="text-sm text-gray-500">Loading profile...</span>
                                </div>
                            ) : profile ? (
                                // --- Profile loaded successfully (or partially) ---
                                <>
                                    {/* Profile Summary */}
                                    <div className="relative mb-3">
                                        <img
                                            // Use profile image or default placeholder
                                            src={profile.image ? `${BACKEND_URL}${profile.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.username || '?')}&background=random&size=128`}
                                            alt={profile.name || profile.username}
                                            className="w-20 h-20 rounded-full mx-auto border-4 border-white -mt-10 relative z-10 object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.username || '?')}&background=random&size=128`; }}
                                        />
                                    </div>
                                    <div className="text-center">
                                        {/* Link to profile using username */}
                                        <Link to={`/profile/${profile.username}`} className="hover:underline">
                                            {/* Display name, fallback to username */}
                                            <h2 className="text-lg font-semibold text-gray-800 truncate" title={profile.name || profile.username}>
                                                {profile.name || profile.username || 'Unknown User'}
                                            </h2>
                                        </Link>
                                        {/* Display title or placeholder */}
                                        <p className="text-sm text-gray-600 italic mb-1 truncate" title={profile.title}>
                                            {profile.title || (profile.needsUpdate ? 'Update your title!' : (profile.fetchError ? '' : 'No title'))}
                                            {profile.fetchError && <span className="text-red-500 text-xs block">(Error loading title)</span>}
                                        </p>
                                    </div>

                                    {/* Profile Stats */}
                                    {!profile.fetchError && ( // Don't show potentially inaccurate stats if fetch failed
                                        <div className="mt-4 border-t border-gray-200 pt-3 text-xs">
                                            <div className="flex justify-between items-center mb-1 hover:bg-gray-50 px-1 py-0.5 rounded">
                                                <span className="font-medium text-gray-600">Connections</span>
                                                <span className="font-semibold text-green-600">{profile.connections?.length ?? 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1 hover:bg-gray-50 px-1 py-0.5 rounded">
                                                <span className="font-medium text-gray-600">Profile viewers</span>
                                                <span className="font-semibold text-green-600">{profile.profileViewers ?? 0}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Links */}
                                    <div className="mt-4 border-t border-gray-200 pt-3">
                                        <Link to={`/profile/${profile.username}`} className="block py-1 rounded-md hover:bg-gray-100">
                                            <div className="flex items-center p-1.5 rounded-md">
                                                <i className="fas fa-user text-gray-600 mr-2 w-4 text-center"></i>
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {profile.needsUpdate ? 'Complete Profile' : 'My Profile'}
                                                </span>
                                            </div>
                                        </Link>
                                        {/* Link to Network page (ensure this route exists) */}
                                        <Link to="/connections" className="block py-1 rounded-md hover:bg-gray-100">
                                             <div className="flex items-center p-1.5 rounded-md">
                                                <i className="fas fa-users text-gray-600 mr-2 w-4 text-center"></i>
                                                <span className="text-sm text-gray-700 font-medium">My Network</span>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Start a post Button */}
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                        <button
                                            onClick={openCreateModal}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out"
                                        >
                                            Start a post
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // --- Error or Not Logged In State ---
                                <div className="text-center p-4 text-sm">
                                    <i className="fas fa-exclamation-circle text-red-500 text-2xl mb-2"></i>
                                    <p className="text-red-600 mb-3">{fetchError || 'Could not load profile.'}</p>
                                    {/* Show login button if the likely error is authentication */}
                                     {(fetchError?.includes('Authentication') || fetchError?.includes('log in')) && (
                                        <Link to="/login" className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md font-medium">
                                            Log In
                                        </Link>
                                     )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Middle Feed (Scrollable) --- */}
                    <div className="w-full md:w-1/2 flex-grow overflow-y-auto h-full pr-1 pb-20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {loadingPosts ? (
                             <div className="text-center p-10 flex flex-col items-center justify-center text-gray-500">
                                <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
                                <span>Loading posts...</span>
                            </div>
                        ) : fetchError && posts.length === 0 ? ( // Show feed error only if posts couldn't load
                             <div className="text-center p-10 text-red-600 bg-red-50 rounded-md shadow-sm">
                                 <i className="fas fa-exclamation-triangle mr-2"></i>{fetchError}
                             </div>
                         ) : posts.length === 0 ? (
                            <div className="text-center p-10 text-gray-500 bg-white rounded-md shadow-sm">No posts to show yet. Follow people or create your own post!</div>
                        ) : (
                            // --- Render Posts ---
                            posts.map((post) => (
                                <div key={post._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                                    {/* Post Header */}
                                    <div className="flex items-start space-x-2 mb-3">
                                        <Link to={`/profile/${post.author?.username}`}>
                                             <img
                                                src={post.author?.image ? `${BACKEND_URL}${post.author.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || post.author?.username || '?')}&background=random&size=50`}
                                                alt={post.author?.name || post.username}
                                                className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                                                 onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || post.author?.username || '?')}&background=random&size=50`; }}
                                            />
                                        </Link>
                                        <div className="flex-grow">
                                            <Link to={`/profile/${post.author?.username}`} className="hover:underline">
                                                 <h3 className="font-semibold text-sm text-gray-900 leading-tight truncate" title={post.author?.name || post.username}>
                                                     {post.author?.name || post.username}
                                                 </h3>
                                            </Link>
                                            {post.author?.title && <p className="text-gray-500 text-xs leading-tight truncate" title={post.author.title}>{post.author.title}</p>}
                                            <div className="flex items-center space-x-1 text-gray-500 text-xs mt-0.5">
                                                <span>{calculateTimeAgo(post.createdAt)}</span>
                                                <i className="fas fa-circle text-[3px] mx-1"></i>
                                                <i className="fas fa-globe-asia" title="Public"></i>
                                            </div>
                                        </div>
                                        {/* More actions button */}
                                        <button className="ml-auto text-gray-500 hover:text-gray-700 flex-shrink-0 p-1">
                                            <i className="fas fa-ellipsis-h"></i>
                                        </button>
                                    </div>

                                    {/* Post Body */}
                                    <div className="cursor-pointer" onClick={() => openViewModal(post)}>
                                        {/* Truncated Content */}
                                         <p className="text-gray-800 text-sm mb-2 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                        {/* Render Images */}
                                        {renderPostImages(post.imageUrls)}
                                    </div>

                                    {/* Like Count */}
                                     {(post.likeCount > 0) && (
                                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                                            <span className="hover:underline cursor-pointer">{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="border-t border-gray-200 mt-2 pt-1 flex justify-around text-gray-600 text-sm font-medium">
                                        <button
                                             onClick={() => toggleLike(post._id)}
                                            className={`flex items-center space-x-1 p-2 rounded w-full justify-center hover:bg-gray-100 ${likedPosts[post._id] ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                                            title="Like"
                                        >
                                            <i className={`fas fa-thumbs-up pt-0.5`}></i> {/* Consider solid icon if liked */}
                                             <span className="hidden sm:inline">Like</span>
                                        </button>
                                        <button
                                            onClick={() => openViewModal(post)} // Open modal for commenting
                                            className="flex items-center space-x-1 p-2 rounded w-full justify-center hover:bg-gray-100 hover:text-orange-600"
                                            title="Comment"
                                        >
                                            <i className="far fa-comment-alt pt-0.5"></i> {/* Use far for outline */}
                                            <span className="hidden sm:inline">Comment</span>
                                        </button>
                                         <button
                                             className="flex items-center space-x-1 p-2 rounded w-full justify-center hover:bg-gray-100 hover:text-green-600"
                                             title="Share"
                                         >
                                            <i className="fas fa-share pt-0.5"></i>
                                            <span className="hidden sm:inline">Share</span>
                                        </button>
                                        <button
                                             className="flex items-center space-x-1 p-2 rounded w-full justify-center hover:bg-gray-100 hover:text-red-600"
                                             title="Send"
                                        >
                                            <i className="fas fa-paper-plane pt-0.5"></i>
                                            <span className="hidden sm:inline">Send</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                     {/* --- Right Sidebar (Optional) --- */}
                     <div className="w-1/4 hidden lg:block flex-shrink-0">
                         <div className="bg-white rounded-lg shadow-md p-4 sticky top-[80px]">
                             <h3 className="font-semibold text-md mb-3">WorthVerse News</h3>
                             <ul className="space-y-2 text-sm">
                                 <li className="hover:bg-gray-50 p-1 rounded">🚀 Platform Launch Announcement!</li>
                                 <li className="hover:bg-gray-50 p-1 rounded">💡 Tip: Complete your profile for better visibility.</li>
                                 {/* Add more items */}
                             </ul>
                              <div className="mt-4 border-t pt-3">
                                <h3 className="font-semibold text-md mb-3">People you may know</h3>
                                <p className="text-sm text-gray-600">Suggestions coming soon...</p>
                                {/* Add suggested connections here */}
                              </div>
                         </div>
                    </div>

                </div>
            </div>

            {/* Modals */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onRequestClose={closeCreateModal}
                onPostCreated={handlePostCreated}
                // Pass the fetched profile (even if minimal) to the modal
                currentUserProfile={profile}
            />
            {selectedPostForView && (
                 <ViewPostModal
                    isOpen={isViewModalOpen}
                    onRequestClose={closeViewModal}
                    post={selectedPostForView}
                />
            )}

        </div>
    );
}

export default Home;