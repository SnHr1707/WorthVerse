import React, { useState } from "react";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currPage, setPage] = useState('');

    return (
        <nav className="bg-white-100 relative"> {/* Make nav relative for absolute mobile menu */}
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger Icon */}
                            <svg
                                className={`${isOpen ? "hidden" : "block"} size-6`}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                            {/* Close Icon */}
                            <svg
                                className={`${isOpen ? "block" : "hidden"} size-6`}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img className="h-8 w-auto" src={logo} alt="WorthVerse" />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link
                                    to="/home"
                                    onClick={() => setPage('home')}
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage === 'home' ? "bg-gray-100" : "bg-white-100"}`}
                                    aria-current="page"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/connections"
                                    onClick={() => setPage('connections')}
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage === 'connections' ? "bg-gray-100" : "bg-white-100"}`}
                                >
                                    Connections
                                </Link>
                                <Link
                                    to="/companies"
                                    onClick={() => setPage('companies')}
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage === 'companies' ? "bg-gray-100" : "bg-white-100"}`}
                                >
                                    Companies
                                </Link>
                                <Link
                                    to="/jobs"
                                    onClick={() => setPage('jobs')}
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage === 'jobs' ? "bg-gray-100" : "bg-white-100"}`}
                                >
                                    Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Message Button */}
                        <button
                            type="button"
                            className="relative rounded-full mr-3 text-gray-400 hover:text-black focus:ring-2 focus:ring-white focus:outline-none"
                        >
                            <span className="absolute -inset-1.5"></span>
                            <i className="fa-brands fa-facebook-messenger fa-lg"></i>
                        </button>

                        {/* Notification Button */}
                        <button
                            type="button"
                            className="relative rounded-full mr-1 text-gray-400 hover:text-black focus:ring-2 focus:ring-white focus:outline-none"
                        >
                            <span className="absolute -inset-1.5"></span>
                            <i className="fa-solid fa-bell fa-lg"></i>
                        </button>

                        {/* Profile dropdown */}
                        <div className="relative ml-3">
                            <div>
                                <button
                                    type="button"
                                    className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                                    id="user-menu-button"
                                    aria-expanded={isProfileOpen}
                                    aria-haspopup="true"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <span className="absolute -inset-1.5"></span>
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="size-8 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                </button>
                            </div>
                            {/* Profile dropdown menu */}
                            {isProfileOpen && (
                                <div
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabIndex="-1"
                                >
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                        role="menuitem"
                                        tabIndex="-1"
                                        id="user-menu-item-0"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                        role="menuitem"
                                        tabIndex="-1"
                                        id="user-menu-item-1"
                                    >
                                        Settings
                                    </Link>
                                    <Link
                                        to="/signout"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                        role="menuitem"
                                        tabIndex="-1"
                                        id="user-menu-item-2"
                                    >
                                        Sign out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu - Overlay */}
            <div
                className={`${isOpen ? 'block' : 'hidden'} sm:hidden absolute top-16 left-0 right-0 z-50 bg-white shadow-md`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link
                        to="/home"
                        onClick={() => { setPage('home'); setIsOpen(false); }}
                        className={`block rounded-md px-3 py-2 text-base font-medium text-black ${currPage === 'home' ? "bg-gray-100" : "hover:bg-gray-100"}`}
                        aria-current="page"
                    >
                        Home
                    </Link>
                    <Link
                        to="/connections"
                        onClick={() => { setPage('connections'); setIsOpen(false); }}
                        className={`block rounded-md px-3 py-2 text-base font-medium text-black ${currPage === 'connections' ? "bg-gray-100" : "hover:bg-gray-100"}`}
                    >
                        Connections
                    </Link>
                    <Link
                        to="/companies"
                        onClick={() => { setPage('companies'); setIsOpen(false); }}
                        className={`block rounded-md px-3 py-2 text-base font-medium text-black ${currPage === 'companies' ? "bg-gray-100" : "hover:bg-gray-100"}`}
                    >
                        Companies
                    </Link>
                    <Link
                        to="/jobs"
                        onClick={() => { setPage('jobs'); setIsOpen(false); }}
                        className={`block rounded-md px-3 py-2 text-base font-medium text-black ${currPage === 'jobs' ? "bg-gray-100" : "hover:bg-gray-100"}`}
                    >
                        Jobs
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;