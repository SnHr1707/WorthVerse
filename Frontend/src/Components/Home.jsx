import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const demoPosts = [
        {
            user_id: 1,
            user_name: "Sneh Soni",
            post_id: 101,
            post_title: "MERN Workshop Success!",
            post_content: "🚀 Successfully Wrapped Up the MERN Workshop! 🚀\nOn 8-9 Feb 2025, our club ENCODE organized a MERN Stack Workshop.  Learn more...",
            has_image: true,
            image_urls: ["https://placehold.co/400x300", "https://placehold.co/400x300", "https://placehold.co/400x200"],
            user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "CSE Student at Nirma University",
            time_posted: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
            likeCount: 25,
        },
        {
            user_id: 2,
            user_name: "Jayesh Geryani",
            post_id: 102,
            post_title: "New Project Launch",
            post_content: "Just finished a great project! Excited to share the results soon.",
            has_image: false,
            image_urls: [],
            user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "Software Engineer",
            time_posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            likeCount: 12,
        },
        {
            user_id: 3,
            user_name: "Alice Smith",
            post_id: 103,
            post_title: "Interesting Article",
            post_content: "Found a really insightful article about the future of AI.  Check it out!",
            has_image: true,
            image_urls: ["https://placehold.co/600x400"],
             user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "Data Scientist",
            time_posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            likeCount: 30,
        },
        {
            user_id: 1,
            user_name: "Sneh Soni",
            post_id: 104,
            post_title: "Another Post by Sneh",
            post_content: "This is another post to test multiple posts from the same user.",
            has_image: false,
            image_urls: [],
            user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "CSE Student at Nirma University",
            time_posted: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
            likeCount: 5,
        },
        {
            user_id: 4,
            user_name: "Bob Johnson",
            post_id: 105,
            post_title: "Travel Photography",
            post_content: "Sharing some photos from my recent trip to the mountains!",
            has_image: true,
            image_urls: ["https://placehold.co/500x300", "https://placehold.co/500x300", "https://placehold.co/500x300"],
            user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "Photographer",
            time_posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            likeCount: 42,
        },
        {
            user_id: 2,
            user_name: "Jayesh Geryani",
            post_id: 106,
            post_title: "Code Challenge",
            post_content: "Participated in a coding challenge and got a pretty good score!  Learned a lot.",
            has_image: false,
            image_urls: [],
            user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "Software Engineer",
            time_posted: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            likeCount: 8,
        },
        {
            user_id: 5,
            user_name: "Charlie Brown",
            post_id: 107,
            post_title: "New Book Recommendation",
            post_content: "Just finished reading a fantastic book on design patterns. Highly recommend it!",
            has_image: false,
            image_urls: [],
            user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "UI/UX Designer",
            time_posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            likeCount: 19,
        },
        {
            user_id: 3,
            user_name: "Alice Smith",
            post_id: 108,
            post_title: "AI Conference",
            post_content: "Attending an AI conference next week.  Looking forward to learning about the latest advancements.",
            has_image: true,
            image_urls: ["https://placehold.co/400x400"],
             user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "Data Scientist",
            time_posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            likeCount: 55,
        },
        {
            user_id: 6,
            user_name: "Diana Prince",
            post_id: 109,
            post_title: "Productivity Tips",
            post_content: "Sharing some tips for staying productive while working from home.",
            has_image: false,
            image_urls: [],
            user_profile_pic: "https://via.placeholder.com/50",
            user_designation: "Project Manager",
            time_posted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
            likeCount: 71,
        },
    ];

    const [likedPosts, setLikedPosts] = useState({});
    const [commentedPosts, setCommentedPosts] = useState({});

    const toggleLike = (postId) => {
        setLikedPosts(prevLikedPosts => ({
            ...prevLikedPosts,
            [postId]: !prevLikedPosts[postId]
        }));
    };

    const toggleComment = (postId) => {
        setCommentedPosts(prevCommentedPosts => ({
            ...prevCommentedPosts,
            [postId]: !prevCommentedPosts[postId]
        }));
    };

    const calculateTimeAgo = (timePosted) => {
        if (!(timePosted instanceof Date)) {
            return "Invalid date";
        }

        const now = Date.now();
        const diffInSeconds = Math.round((now - timePosted.getTime()) / 1000);
        const diffInMinutes = Math.round(diffInSeconds / 60);
        const diffInHours = Math.round(diffInMinutes / 60);
        const diffInDays = Math.round(diffInHours / 24);
        const diffInWeeks = Math.round(diffInDays / 7);

        if (diffInSeconds < 60) {
            return diffInSeconds < 30 ? "Just now" : `${diffInSeconds}s`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d`;
        } else {
            return `${diffInWeeks}w`;
        }
    };


    return (
        <div className="bg-gray-100 font-sans antialiased">
            <div className="container mx-auto px-4 py-6">
                <div className="flex w-full max-w-7xl mx-auto">

                    {/* Left Sidebar */}
                    <div className="w-1/4 hidden md:block pr-4">
                        <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
                            <div className="relative">
                                <img
                                    src="https://via.placeholder.com/150"
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full mx-auto border-2 border-gray-200"
                                />
                            </div>
                            <div className="text-center mt-2">
                                <h2 className="text-lg font-semibold text-gray-800">Your Name</h2>
                                <p className="text-sm text-gray-700 italic">Your Profession</p>
                                <p className="text-sm text-gray-700">Your City, Country</p>
                            </div>

                            {/* Profile Viewers and Post Impressions */}
                            <div className="mt-4 border-t border-gray-200 pt-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Profile viewers</span>
                                    <span className="text-sm font-semibold text-green-600">19</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Post impressions</span>
                                    <span className="text-sm font-semibold text-green-600">33</span>
                                </div>
                            </div>

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
                    <div className="w-full  overflow-y-auto pb-5" style={{ maxHeight: '90vh' }}>
                        {/* Feed Posts (mapped from demoPosts) */}
                        {demoPosts.map((post) => (
                            <div key={post.post_id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                                <div className="flex items-start space-x-2 mb-3">
                                    <img src={post.user_profile_pic} alt={post.user_name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="flex items-center space-x-1">
                                            <h3 className="font-semibold text-sm text-gray-900">{post.user_name}</h3>
                                        </div>
                                        <p className="text-gray-700 text-sm">{post.user_designation}</p>
                                        <div className="flex items-center space-x-1 text-gray-700 text-xs">
                                            <span>{calculateTimeAgo(post.time_posted)}</span>
                                            <i className="fas fa-globe-asia ml-1"></i>
                                        </div>
                                    </div>
                                    <button className="ml-auto text-gray-500 hover:text-gray-700">
                                        <i className="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                                <div>
                                    <p className="text-gray-800 text-sm mb-2 leading-relaxed">
                                        {post.post_content.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </p>

                                    {post.has_image && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                             {post.image_urls.length === 1 && (
                                                <img src={post.image_urls[0]} alt="Post" className="rounded-lg w-full" />
                                            )}
                                            {post.image_urls.length === 2 && (
                                                 post.image_urls.map((url, index) => (
                                                    <img key={index} src={url} alt={`Post ${index}`} className="rounded-lg" />
                                                ))
                                            )}
                                            {post.image_urls.length > 2 && (
                                                <>
                                                    <img src={post.image_urls[0]} alt="Post 0" className="rounded-lg" />
                                                    <img src={post.image_urls[1]} alt="Post 1" className="rounded-lg" />
                                                    {/* Display remaining images in the third column */}
                                                    <div className="col-span-2 relative">
                                                        <img src={post.image_urls[2]} alt="Post 2" className="rounded-lg w-full" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-200 mt-3 pt-2 flex justify-around text-gray-700 text-sm">
                                    <button onClick={() => toggleLike(post.post_id)} className={`hover:text-blue-500 flex items-center space-x-1 ${likedPosts[post.post_id] ? 'text-blue-500' : ''}`}>
                                        <i className={`far pt-0.5 ${likedPosts[post.post_id] ? 'fa-solid fa-thumbs-up' : 'fa-thumbs-up'}`}></i>
                                        <span className="pl-0.5 md:inline hidden ">Like</span> <span className="text-black text-xs ml-1 pt-0.5">{post.likeCount}</span>
                                    </button>
                                    <button onClick={() => toggleComment(post.post_id)} className={`hover:text-orange-500 flex items-center space-x-1`}>
                                        <i className={`far pt-0.5 ${commentedPosts[post.post_id] ? 'fa-comment' : 'fa-comment'}`}></i>
                                        <span className="pl-0.5 md:inline hidden">Comment</span>
                                    </button>
                                    <button className="hover:text-green-500 flex items-center space-x-1">
                                        <i className="fas fa-share pt-0.5"></i>
                                        <span className="pl-0.5 md:inline hidden">Share</span>
                                    </button>
                                    <button className="hover:text-red-500 flex items-center space-x-1">
                                        <i className="fas fa-paper-plane pt-0.5"></i>
                                        <span className="pl-0.5 md:inline hidden">Send</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;