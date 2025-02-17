import React from 'react';
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
            time_posted: "20h",
            connection_level: "3rd+"
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
            time_posted: "1d",
            connection_level: "2nd"
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
            time_posted: "2d",
            connection_level: "1st"
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
            time_posted: "3h",
            connection_level: "3rd+"
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
            time_posted: "5d",
            connection_level: "2nd"
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
            time_posted: "6h",
            connection_level: "2nd"
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
            time_posted: "1w",
            connection_level: "3rd+"
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
            time_posted: "4d",
            connection_level: "1st"

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
            time_posted: "2w",
            connection_level: "1st"
        },
    ];


    return (
        <div className="bg-gray-200 flex justify-center px-4 py-6">
            <div className="flex w-full max-w-7xl">

                {/* Left Sidebar */}
                <div className="w-1/4 pr-4 hidden md:block">
                    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                        <div className="relative">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Profile"
                                className="w-24 h-24 rounded-full mx-auto"
                            />
                            <button className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <h2 className="text-lg font-semibold">Curr User</h2>
                            <p className="text-sm text-gray-600">Placeholder byline for the current user</p>
                            <p className="text-sm text-gray-600">Based in ....</p>
                        </div>

                        {/* Profile Viewers and Post Impressions */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Profile viewers</span>
                                <span className="text-sm font-semibold text-blue-600">19</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Post impressions</span>
                                <span className="text-sm font-semibold text-blue-600">33</span>
                            </div>
                        </div>

                        {/* Saved Items, Groups, Events */}
                        <div className="mt-4">
                            <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                <i className="fas fa-bookmark text-gray-700 mr-2"></i>
                                <span className="text-sm text-gray-700 font-medium">My Profile</span>
                            </Link>
                            <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                <i className="fas fa-users text-gray-700 mr-2"></i>
                                <span className="text-sm text-gray-700 font-medium">Groups</span>
                            </Link>
                            <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                <i className="fas fa-calendar-alt text-gray-700 mr-2"></i>
                                <span className="text-sm text-gray-700 font-medium">Events</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Middle Feed */}
                <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-4 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                    {/* Start a post */}
                    <div className="mb-4">
                        <textarea
                            placeholder="Start a post"
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="1"
                        ></textarea>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                            <div className="flex space-x-4">
                                <button className="flex items-center text-blue-500 hover:bg-gray-100 p-2 rounded-md">
                                    <i className="fas fa-photo-video mr-1"></i>
                                    <span className="text-sm">Photo</span>
                                </button>
                                <button className="flex items-center text-green-500 hover:bg-gray-100 p-2 rounded-md">
                                    <i className="fas fa-video mr-1"></i>
                                    <span className="text-sm">Video</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feed Posts (mapped from demoPosts) */}
                    {demoPosts.map((post) => (
                        <div key={post.post_id} className="bg-white rounded-lg shadow p-4 mb-4">
                            <div className="flex items-start space-x-2 mb-3">
                                <img src={post.user_profile_pic} alt={post.user_name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <div className="flex items-center space-x-1">
                                        <h3 className="font-semibold text-sm">{post.user_name}</h3>
                                        <span className="text-gray-500 text-xs"> • {post.connection_level}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{post.user_designation}</p>
                                    <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                        <span>{post.time_posted}</span>
                                        <i className="fas fa-globe-asia"></i>
                                    </div>
                                </div>
                                <button className="ml-auto text-gray-500 hover:text-gray-700">
                                    <i className="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                            <div>
                                <p className="text-gray-800 text-sm mb-2">
                                    {post.post_content.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>

                                {post.has_image && (
                                    <div className="grid grid-cols-2 gap-2">
                                         {post.image_urls.length === 1 && (
                                            <img src={post.image_urls[0]} alt="Post" className="rounded-lg w-full" />  // Full width for single image
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
                            <div className="border-t border-gray-200 mt-3 pt-2 flex justify-around text-gray-600 text-sm">
                                <button className="hover:text-blue-500 flex items-center space-x-1">
                                    <i className="far fa-thumbs-up"></i>
                                    <span>Like</span>
                                </button>
                                <button className="hover:text-blue-500 flex items-center space-x-1">
                                    <i className="far fa-comment"></i>
                                    <span>Comment</span>
                                </button>
                                <button className="hover:text-blue-500 flex items-center space-x-1">
                                    <i className="fas fa-share"></i>
                                    <span>Share</span>
                                </button>
                                <button className="hover:text-blue-500 flex items-center space-x-1">
                                    <i className="fas fa-paper-plane"></i>
                                    <span>Send</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;