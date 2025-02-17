import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.png';

function Home(){
    return(
        <div className="bg-gray-100 h-screen w-screen flex justify-center">
            <div className="bg-white shadow-md rounded-lg w-full max-w-7xl h-full flex">

                {/* Left Sidebar */}
                <div className="w-1/5 p-4 h-full sticky top-0 overflow-y-auto no-scrollbar">
                    <div className="flex flex-col space-y-4">
                        {/* Profile Section */}
                        <div className="bg-white rounded-lg shadow p-4">
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
                                <h2 className="text-lg font-semibold">Sneh Soni</h2>
                                <p className="text-sm text-gray-600">CSE Student at Nirma University</p>
                                <p className="text-sm text-gray-600">Ahmedabad, Gujarat, India</p>
                                <p className="text-sm text-gray-600">Ahmedabad, Gujarat</p>
                            </div>
                            <Link to="#" className="block mt-4 p-2 border border-gray-300 rounded-md text-center text-sm hover:bg-gray-100">
                                <img src="https://media.licdn.com/dms/image/D4E0BAQG70yy4n7MB2w/company-logo_100_100/0/1686813605090?e=1723382400&v=beta&t=3bJ9iE528p0YQx6qL53_7W2Q0y_m1t9t9G1K6_1q3xQ" alt="Nirma University" className="w-6 h-6 inline-block mr-1 align-middle" />
                                Nirma University, Ahmedabad, Gujarat, India
                            </Link>
                        </div>

                        {/* Profile Viewers and Post Impressions */}
                        <div className="bg-white rounded-lg shadow p-4">
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
                        <div className="bg-white rounded-lg shadow p-4">
                            <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                <i className="fas fa-bookmark text-gray-700 mr-2"></i>
                                <span className="text-sm text-gray-700 font-medium">Saved items</span>
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
                <div className="w-3/5 p-4 h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {/* Start a post */}
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="mb-2">
                            <textarea
                                placeholder="Start a post"
                                className="w-full border-2 border-gray-400 p-3 focus:ring-0 resize-none rounded-4xl "
                                rows="1"
                            ></textarea>
                        </div>  
                        <div className="flex items-center border-t border-gray-200 pt-2 justify-center">
                            <div className="flex space-x-40">
                                <button className="flex items-center text-blue-500 hover:bg-gray-100 p-2 rounded-md">
                                    <i className="fas fa-photo-video mr-1"></i>
                                    <span>Photo</span>
                                </button>
                                <button className="flex items-center text-green-500 hover:bg-gray-100 p-2 rounded-md">
                                    <i className="fas fa-video mr-1"></i>
                                    <span>Video</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feed Post 1 */}
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="flex items-start space-x-2 mb-3">
                            <img src="https://via.placeholder.com/50" alt="User" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="flex items-center space-x-1">
                                    <h3 className="font-semibold text-sm">Jayesh Geryani</h3>
                                    <span className="text-gray-500 text-xs"> • 3rd+</span>
                                </div>
                                <p className="text-gray-600 text-sm">CSE Student at Pandit Deendayal Energy University (PDEU)</p>
                                <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                    <span>20h</span>
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                            </div>
                            <button className="ml-auto text-gray-500 hover:text-gray-700">
                                <i className="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-800 text-sm mb-2">
                                <span role="img" aria-label="rocket">🚀</span> Successfully Wrapped Up the MERN Workshop! <span role="img" aria-label="rocket">🚀</span>
                            </p>
                            <p className="text-gray-800 text-sm mb-2">
                                On <span className="font-semibold">8-9 Feb 2025</span>, our club <span className="font-semibold">ENCODE</span> organized a MERN Stack Workshop at <Link to="#" className="text-blue-500">...more</Link>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <img src="https://placehold.co/400x300" alt="Post Image" className="rounded-lg" />
                                <img src="https://placehold.co/400x300" alt="Post Image" className="rounded-lg" />
                                <img src="https://placehold.co/400x300" alt="Post Image" className="rounded-lg col-span-2" />
                            </div>
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

                    {/* Add more feed posts here */}
                    {/* Feed Post 2 Example */}
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="flex items-start space-x-2 mb-3">
                            <img src="https://via.placeholder.com/50" alt="User" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="flex items-center space-x-1">
                                    <h3 className="font-semibold text-sm">Another User</h3>
                                    <span className="text-gray-500 text-xs"> • 2nd</span>
                                </div>
                                <p className="text-gray-600 text-sm">Software Engineer</p>
                                <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                    <span>1d</span>
                                    <i className="fas fa-globe-asia"></i>
                                </div>
                            </div>
                            <button className="ml-auto text-gray-500 hover:text-gray-700">
                                <i className="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-800 text-sm mb-2">
                                Just finished a great project! Excited to share the results soon.
                            </p>
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
                </div>

            </div>
        </div>
    );
}

export default Home;