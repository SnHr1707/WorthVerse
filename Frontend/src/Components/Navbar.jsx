// --- START OF REGENERATED FILE Navbar.jsx ---
import React, { useState, useEffect, useRef } from "react";
import logo from "../Assets/logo.png"; // Ensure this path is correct
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    // State variables
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [authCheckComplete, setAuthCheckComplete] = useState(false); // Track if the async check ran

    // Hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Refs
    const profileMenuRef = useRef(null);
    const mobileMenuButtonRef = useRef(null);

    // Derived state
    const currentPage = location.pathname.split('/')[1] || 'home';

    // --- Effect: Check Authentication Status on Mount or Location Change ---
    useEffect(() => {
        let isMounted = true; // Prevent state update on unmounted component
        console.log(`Navbar Effect: Running auth check (Location: ${location.pathname})...`);

        const performAuthCheck = async () => {
            // Indicate check is starting/re-starting for this run
            // Reset state *before* fetch
            if (isMounted) { // Check isMounted before setting state
                setAuthCheckComplete(false);
                setIsAuthenticated(false);
                setLoggedInUsername(null);
                setProfileImageUrl('');
            }

            try {
                // Using the absolute URL as confirmed working by user
                const response = await fetch('http://localhost:5000/api/auth/check-auth', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json' // Explicitly accept JSON
                    },
                    credentials: 'include',
                });

                console.log(`Navbar Effect: /check-auth status: ${response.status}`);

                if (!isMounted) {
                    console.log("Navbar Effect: Component unmounted before processing response.");
                    return; // Exit if component unmounted during fetch
                }

                let authStatus = false;
                let username = null;
                let imageUrl = '';

                if (response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        console.log("Navbar Effect: /check-auth JSON data:", data);
                        if (data.isAuthenticated && data.user?.username) {
                            authStatus = true;
                            username = data.user.username;
                            imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&size=96`;
                            console.log(`Navbar Effect: User ${username} IS authenticated.`);
                        } else {
                            console.warn("Navbar Effect: /check-auth OK & JSON, but not authenticated in data.");
                        }
                    } else {
                        console.warn(`Navbar Effect: /check-auth OK but received non-JSON content-type: ${contentType}. Treating as unauthenticated.`);
                    }
                } else {
                     console.warn(`Navbar Effect: /check-auth failed status ${response.status}. User treated as unauthenticated.`);
                }

                 if (isMounted) {
                     console.log(`Navbar Effect: Updating state - isAuthenticated: ${authStatus}, authCheckComplete: true`);
                     setIsAuthenticated(authStatus);
                     setLoggedInUsername(username);
                     setProfileImageUrl(imageUrl);
                     setAuthCheckComplete(true);
                 } else {
                    console.log("Navbar Effect: Component unmounted before final state update.");
                 }

            } catch (error) {
                if (!isMounted) return;
                console.error("Navbar Effect: Error during fetch/processing:", error);
                 setIsAuthenticated(false);
                 setLoggedInUsername(null);
                 setProfileImageUrl('');
                 setAuthCheckComplete(true); // Mark complete even on error
            }
        };

        performAuthCheck();

        return () => {
            console.log("Navbar Effect: Cleanup running.");
            isMounted = false;
        };
    }, [location]); // Dependency array includes location

    // --- Effect: Close Menus on Click Outside ---
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target)) {
                const mobileMenuElement = document.getElementById('mobile-menu');
                if (mobileMenuElement && !mobileMenuElement.contains(event.target)) {
                    setIsMobileMenuOpen(false);
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- Action: Handle Sign Out ---
    const handleSignOut = async () => {
        console.log("Navbar Action: Signing out...");
        try {
            // Using the absolute URL as confirmed working by user
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                 method: 'POST',
                 credentials: 'include'
            });
            if (!response.ok) {
                console.error("Navbar Action: Sign out API call failed:", response.status);
            } else {
                 console.log("Navbar Action: Sign out successful via API.");
            }
        } catch (error) {
            console.error("Navbar Action: Error during sign out fetch:", error);
        } finally {
             // Always update frontend state and navigate after attempt
             setIsAuthenticated(false);
             setLoggedInUsername(null);
             setProfileImageUrl('');
             closeAllMenus();
             navigate('/login'); // Redirect to login page
        }
    };

    // --- Helper: Close Menus ---
    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    // --- Data: Navigation Links ---
    const navLinks = [
        { name: "Home", path: "/", id: "home" },
        { name: "Connections", path: "/connections", id: "connections" },
        { name: "Jobs", path: "/jobs", id: "jobs" },
    ];

    // --- Render ---
    // console.log(`Navbar Render: authCheckComplete=${authCheckComplete}, isAuthenticated=${isAuthenticated}`);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Mobile Menu Button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            ref={mobileMenuButtonRef} type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="absolute -inset-0.5"></span><span className="sr-only">Open main menu</span>
                            <svg className={`${isMobileMenuOpen ? "hidden" : "block"} size-6`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                            <svg className={`${isMobileMenuOpen ? "block" : "hidden"} size-6`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Logo & Desktop Navigation */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link to="/" onClick={closeAllMenus}><img src={logo} className="h-8 w-auto" alt="WorthVerse Logo" /></Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navLinks.map((link) => (
                                    <Link key={link.id} to={link.path} onClick={closeAllMenus}
                                        className={`rounded-md px-3 py-2 text-sm font-medium transition duration-150 ease-in-out ${currentPage === link.id ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                                        aria-current={currentPage === link.id ? "page" : undefined} >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Conditional Profile/Login */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {!authCheckComplete ? (
                            <div className="flex items-center justify-center h-8 w-16">
                                <i className="fas fa-spinner fa-spin text-gray-400 animate-spin"></i>
                            </div>
                        ) : isAuthenticated ? (
                            <>
                                <div className="relative ml-3" ref={profileMenuRef}>
                                    <button type="button"
                                        className="relative flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        id="user-menu-button" aria-expanded={isProfileMenuOpen} aria-haspopup="true"
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} >
                                        <span className="absolute -inset-1.5"></span><span className="sr-only">Open user menu</span>
                                        <img className="size-8 rounded-full object-cover border border-gray-300"
                                            src={profileImageUrl || "https://via.placeholder.com/32"} alt="User profile" />
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                            role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1" >
                                            <Link to={`/profile/${loggedInUsername}`} onClick={closeAllMenus} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-0">My Profile</Link>
                                            <Link to="/settings" onClick={closeAllMenus} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</Link>
                                            <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign out</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">Log In</Link>
                                <Link to="/signup" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Expansion */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden border-t border-gray-200`} id="mobile-menu">
                {/* Mobile Navigation Links */}
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navLinks.map((link) => (
                        <Link key={`mobile-${link.id}`} to={link.path} onClick={closeAllMenus}
                            className={`block rounded-md px-3 py-2 text-base font-medium ${currentPage === link.id ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                            aria-current={currentPage === link.id ? "page" : undefined} >
                            {link.name}
                        </Link>
                    ))}
                </div>
                {/* Mobile Profile/Login/Signup Actions */}
                <div className="border-t border-gray-200 pt-4 pb-3">
                    {!authCheckComplete ? (
                         <div className="flex justify-center px-5 py-2"><i className="fas fa-spinner fa-spin text-gray-400 animate-spin"></i></div>
                    ) : isAuthenticated ? (
                        <> {/* Authenticated Mobile View */}
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0"><img className="size-10 rounded-full object-cover border border-gray-300" src={profileImageUrl || "https://via.placeholder.com/40"} alt="User profile" /></div>
                                <div className="ml-3"><div className="text-base font-medium text-gray-800">{loggedInUsername}</div></div>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <Link to={`/profile/${loggedInUsername}`} onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">My Profile</Link>
                                <Link to="/settings" onClick={closeAllMenus} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Settings</Link>
                                <button onClick={handleSignOut} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Sign out</button>
                            </div>
                        </>
                    ) : ( // Not Authenticated Mobile View
                        <div className="px-4 space-y-2">
                            <Link to="/login" onClick={closeAllMenus} className="block w-full text-center rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Log In</Link>
                            <Link to="/signup" onClick={closeAllMenus} className="block w-full text-center rounded-md px-3 py-2 text-base font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

        </nav>
    );
}

export default Navbar;
// --- END OF REGENERATED FILE Navbar.jsx ---