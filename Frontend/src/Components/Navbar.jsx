import React, { useState } from "react";
import logo from "../Assets/logo.png"
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Add state for profile dropdown
  const [currPage,setPage] = useState('');
  return (
    <nav className="bg-white-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)} // Toggle mobile menu state
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isOpen ? "hidden" : "block"} size-6`} // Conditionally render based on isOpen
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
              <img
                className="h-8 w-auto"
                src = {logo}
                alt="WorthVerse"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <a
                  href="#"
                  onClick={() => setPage('feed')}
                  className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage == 'feed' ? "bg-gray-100" : "bg-white-100"}`}
                  aria-current="page"
                >
                  Home
                </a>
                <a
                  href="#"
                  onClick={() => setPage('connections')}
                  className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage == 'connections' ? "bg-gray-100" : "bg-white-100"}`}
                >
                  Connections
                </a>
                <a
                  href="#"
                  onClick={() => setPage('companies')}
                  className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage == 'companies' ? "bg-gray-100" : "bg-white-100"}`}
                >
                  Companies
                </a>
                <a
                  href="#"
                  onClick={() => setPage('jobs')}
                  className={`rounded-md px-3 py-2 text-sm font-medium text-black ${currPage == 'jobs' ? "bg-gray-100" : "bg-white-100"}`}
                >
                  Jobs
                </a>
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
              {/* <svg
                className="size-6"
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
                  d="M3 8c0-2.21 2.239-4 5-4h8c2.761 0 5 1.79 5 4v6c0 2.21-2.239 4-5 4H9l-5 4v-4c-1.761 0-3-1.79-3-4V8z"
                />
              </svg> */}
            </button>

            {/* Notification Button */}
            <button
              type="button"
              className="relative rounded-full mr-1 text-gray-400 hover:text-black focus:ring-2 focus:ring-white focus:outline-none"
            >
              <span className="absolute -inset-1.5"></span>
              <i className="fa-solid fa-bell fa-lg"></i>
              {/* <svg
                className="size-6"
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
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg> */}
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
              {/* Profile dropdown menu, show/hide based on menu state. */}
              {isProfileOpen && ( // Conditionally render the dropdown
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-1"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && ( // Conditionally render the mobile menu
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a
              href="#"
              className="block rounded-md focus:bg-gray-900 px-3 py-2 text-base font-medium text-black focus:text-white"
              aria-current="page"
            >
              Home
            </a>
            <a
              href="#"
              className="block rounded-md focus:bg-gray-900 px-3 py-2 text-base font-medium text-black focus:text-white"
            >
              Team
            </a>
            <a
              href="#"
              className="block rounded-md focus:bg-gray-900 px-3 py-2 text-base font-medium text-black focus:text-white"
            >
              Projects
            </a>
            <a
              href="#"
              className="block rounded-md focus:bg-gray-900 px-3 py-2 text-base font-medium text-black focus:text-white"
            >
              Calendar
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;