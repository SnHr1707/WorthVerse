import { Link } from 'react-router-dom';
import React from "react";
import page1 from "../Assets/page1.jpg";

function Mainpage() {
    return (
        <div className="h-full flex flex-col">
            {/* <Navbar /> */}
            <div className="flex-1 flex md:flex-row flex-col items-center md:items-stretch"> {/* Responsive flex direction and alignment */}
                {/* Left Section (Image) - Now placed first in code for visual order */}
                <div className="flex-[2] relative"> {/* Image section takes 2/3 space on larger screens */}
                    <img
                        src={page1} // Replace with your image URL
                        alt="Main page image"
                        className="h-full w-full object-cover md:block hidden"
                    />
                    <img
                        src={page1} // Replace with your image URL
                        alt="LinkedIn people"
                        className="w-full h-fit object-cover block md:hidden"
                    />
                </div>

                {/* Right Section (Login/Signup Form) - Now placed second in code for visual order */}
                <div className="flex-[1] flex flex-col justify-center items-start md:items-start px-6 md:px-20 py-10 md:py-0 text-center"> {/* Text section takes 1/3 space on larger screens */}
                    {/* Welcome Text */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                        Welcome to your professional community
                    </h1>

                    {/* Login Button */}
                    <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full mb-3 shadow-sm">
                        Login
                    </Link>

                    {/* Sign up Button */}
                    <Link to="/signup" className="bg-white hover:bg-gray-100 border border-gray-300 rounded-full py-2 px-4 w-full mb-4 flex items-center justify-center shadow-sm">
                        Sign up with email
                    </Link>

                    {/* Agreement Text */}
                    <p className="text-xs text-gray-600">
                        By clicking Continue to join or sign in, you agree to WorthVerse's{" "}
                        <a href="#" className="text-blue-500 hover:underline">User Agreement</a>,{" "}
                        <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>, and{" "}
                        <a href="#" className="text-blue-500 hover:underline">Cookie Policy</a>.
                    </p>

                    {/* New to WorthVerse? Join now Link */}
                    <p className="mt-4">
                        New to WorthVerse?
                        <Link to="/signup" className="text-blue-500 font-medium">Join now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Mainpage;