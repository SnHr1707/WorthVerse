import React, { useState, useEffect } from 'react'; // Import useEffect and useState
import { Link } from 'react-router-dom';

function Home() {
    const demoPosts = [ /* ... your demoPosts array ... */ ];

    const [likedPosts, setLikedPosts] = useState({});
    const [commentedPosts, setCommentedPosts] = useState({});
    const [profile, setProfile] = useState(null); // State to store profile data

    // Function to fetch profile data
    const fetchProfile = async () => {
        // Assuming you have username available after login, maybe stored in localStorage or context.
        // For this example, let's assume username is 'testuser' for testing.  <--- Replace 'testuser' with actual logged-in username
        const username = 'testuser';
        try {
            const response = await fetch(`http://localhost:5000/api/profile/${username}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else {
                console.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile(); // Fetch profile data when component mounts
    }, []); // Empty dependency array ensures it runs only once after initial render


    const toggleLike = (postId) => { /* ... your toggleLike function ... */ };
    const toggleComment = (postId) => { /* ... your toggleComment function ... */ };
    const calculateTimeAgo = (timePosted) => { /* ... your calculateTimeAgo function ... */ };


    return (
        <div className="bg-gray-100 font-sans antialiased min-h-full">
            <div className="container max-h-[calc(100vh-90px)] mx-auto px-4 py-6">
                <div className="flex w-full max-w-7xl mx-auto max-h-[calc(100vh-90px)]">

                    {/* Left Sidebar */}
                    <div className="w-1/4 hidden md:block pr-4">
                        <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
                            {profile && ( // Conditionally render profile info when data is available
                                <>
                                    <div className="relative">
                                        <img
                                            src={profile.profile_pic || "https://via.placeholder.com/150"} // Use profile pic from data or default
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full mx-auto border-2 border-gray-200"
                                        />
                                    </div>
                                    <div className="text-center mt-2">
                                        <h2 className="text-lg font-semibold text-gray-800">{profile.fullname || 'Your Name'}</h2> {/* Use fullname from data or default */}
                                        <p className="text-sm text-gray-700 italic">{profile.profession || 'Your Profession'}</p> {/* Use profession from data or default */}
                                        <p className="text-sm text-gray-700">{`${profile.city || 'Your City'}, ${profile.country || 'Your Country'}`}</p> {/* Use city and country from data or default */}
                                    </div>

                                    {/* Profile Viewers and Post Impressions */}
                                    <div className="mt-4 border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Profile viewers</span>
                                            <span className="text-sm font-semibold text-green-600">{profile.profileViewers}</span> {/* Use profileViewers from data */}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Post impressions</span>
                                            <span className="text-sm font-semibold text-green-600">{profile.postImpressions}</span> {/* Use postImpressions from data */}
                                        </div>
                                    </div>
                                </>
                            )}


                            {/* Saved Items, Groups, Events */}
                            <div className="mt-4 border-t border-gray-200 pt-3">
                                <Link to="/profile" className="block py-2 rounded-md hover:bg-gray-100">
                                    <div className="flex items-center p-2 rounded-md ">
                                        <i className="fas fa-user text-gray-700 mr-3"></i>
                                        <span className="text-sm text-gray-700 font-medium">My Profile</span>
                                    </div>
                                </Link>
                                <Link to="#" className="block py-2 rounded-md hover:bg-gray-100">
                                    <div className="flex items-center p-2 rounded-md ">
                                        <i className="fas fa-users text-gray-700 mr-3"></i>
                                        <span className="text-sm text-gray-700 font-medium">Groups</span>
                                    </div>
                                </Link>
                                <Link to="#" className="block py-2 rounded-md hover:bg-gray-100">
                                    <div className="flex items-center p-2 rounded-md ">
                                        <i className="fas fa-calendar-alt text-gray-700 mr-3"></i>
                                        <span className="text-sm text-gray-700 font-medium">Events</span>
                                    </div>
                                </Link>
                                {/* Start a post moved here */}
                                <div className="mt-4 border-t border-gray-200 pt-3">
                                    <textarea
                                        placeholder="Start a post"
                                        className="w-full border border-gray-300 p-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                        rows="1"
                                    ></textarea>
                                    <div className="flex items-center justify-around mt-2 pt-2">
                                        <button className="flex items-center text-blue-500 hover:bg-gray-100 p-2 rounded-md">
                                            <i className="fas fa-photo-video mr-2"></i>
                                            <span className="text-sm">Photo</span>
                                        </button>
                                        <button className="flex items-center text-green-500 hover:bg-gray-100 p-2 rounded-md">
                                            <i className="fas fa-video mr-2"></i>
                                            <span className="text-sm">Video</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Feed */}
                    <div className="w-full  overflow-y-auto pb-5 max-h-[calc(100vh-104px)]">
                        {/* Feed Posts (mapped from demoPosts) */}
                        {demoPosts.map((post) => (
                            // ... rest of your post rendering code in Home.jsx remains the same
                            <div key={post.post_id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                                {/* ... */}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;