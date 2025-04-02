// --- START OF REGENERATED FILE Connection.jsx ---
// Connection.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define color constants (can be removed if using Tailwind classes directly)
const colors = {
    primary: "#0a66c2",
    secondary: "#f0f2f5",
    textPrimary: "#191919",
    textSecondary: "#666666",
    white: "#ffffff",
    accent: "#e7e9ea",
    success: "#28a745", // Use Tailwind bg-green-600 or similar
    warning: "#ffc107", // Use Tailwind bg-yellow-400 or similar
    danger: "#dc3545",  // Use Tailwind bg-red-600 or similar
    borderLight: "#e0e0e0",
};

// Define view modes
const VIEW_MODES = {
    SUGGESTIONS: 'suggestions',
    PENDING: 'pending',
    REQUESTS: 'requests',
    CONNECTIONS: 'connections',
};

// Backend Base URL - Adjust if your backend runs elsewhere
const API_BASE_URL = 'http://localhost:5000';

// #region Helper Components

// Component for displaying a single user card with appropriate actions
const DynamicConnectionCard = ({ user, status, onAction, actionLoadingTarget }) => {
    const navigate = useNavigate();
    // Check if the current card's action is loading
    const isLoading = actionLoadingTarget === user.username;

    const handleProfileClick = () => {
        navigate(`/profile/${user.username}`);
    };

    // Determine button(s) based on the connection status/view mode
    const renderButtons = () => {
        switch (status) {
            case VIEW_MODES.SUGGESTIONS:
                return (
                    <button
                        onClick={() => onAction('sendRequest', user.username)}
                        disabled={isLoading}
                        className="font-semibold py-1.5 px-4 rounded-full text-sm inline-flex items-center justify-center transition duration-150 ease-in-out text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700" // Tailwind primary button
                    >
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Connect'}
                    </button>
                );
            case VIEW_MODES.PENDING: // Request sent by logged-in user
                return (
                    <button
                        onClick={() => onAction('withdrawRequest', user.username)}
                        disabled={isLoading}
                        className="font-semibold py-1.5 px-4 rounded-full text-sm inline-flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-600" // Tailwind secondary/pending button
                    >
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Pending'}
                    </button>
                );
            case VIEW_MODES.REQUESTS: // Request received by logged-in user
                return (
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                            onClick={() => onAction('acceptRequest', user.username)}
                            disabled={isLoading}
                            className="font-semibold py-1.5 px-4 rounded-full text-sm inline-flex items-center justify-center transition duration-150 ease-in-out text-white disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700" // Tailwind success button
                        >
                             {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Accept'}
                        </button>
                        <button
                            onClick={() => onAction('rejectRequest', user.username)}
                            disabled={isLoading}
                            className="font-semibold py-1.5 px-4 rounded-full text-sm inline-flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-600" // Tailwind secondary/ignore button
                        >
                             {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Ignore'}
                        </button>
                    </div>
                );
            case VIEW_MODES.CONNECTIONS:
                return (
                     <button
                        onClick={() => onAction('removeConnection', user.username)}
                        disabled={isLoading}
                        className="font-semibold py-1.5 px-4 rounded-full text-sm inline-flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-600" // Tailwind remove button
                    >
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Remove'}
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-center">
                <div className="flex items-center cursor-pointer flex-grow min-w-0 mr-2" onClick={handleProfileClick}> {/* Added flex-grow, min-w-0, mr-2 */}
                    {/* <img
                        src={user.image || 'https://via.placeholder.com/48?text=N/A'}
                        alt={user.name || user.username}
                        className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-300 flex-shrink-0" // Added flex-shrink-0
                        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/48?text=Err"; }}
                    /> */}
                    <div className="min-w-0"> {/* Added min-w-0 to allow text truncation */}
                        <h3 className="text-md font-semibold text-gray-800 hover:underline truncate">{user.name || user.username}</h3>
                        <p className="text-sm text-gray-500 truncate">{user.title || 'No title provided'}</p>
                    </div>
                </div>
                <div className="ml-auto flex-shrink-0"> {/* Added ml-auto */}
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
};

// Component for displaying a single event card
const EventCard = ({ event }) => {
     return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow duration-200 flex items-center">
            {/* <img
                src={event.image || 'https://via.placeholder.com/80?text=Event'}
                alt={event.title}
                className="w-20 h-20 rounded-md object-cover mr-4 flex-shrink-0"
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/80?text=Err"; }}
            /> */}
            <div className="flex-1 min-w-0">
                <h3 className="text-md font-semibold text-gray-800 hover:underline cursor-pointer truncate">{event.title}</h3>
                <p className="text-sm text-gray-500 truncate"><i className="far fa-calendar-alt mr-1 text-xs"></i> {event.date}</p>
                <p className="text-sm text-gray-500 truncate"><i className="fas fa-map-marker-alt mr-1 text-xs"></i> {event.location}</p>
                <p className="text-sm text-gray-500"><i className="fas fa-users mr-1 text-xs"></i> {event.attendees} attendees</p>
                <button
                    className={`mt-2 font-semibold py-1 px-3 rounded-full text-sm inline-flex items-center justify-center transition duration-150 ease-in-out bg-white hover:bg-gray-100 text-blue-600 border border-blue-600`}
                >
                    View
                </button>
            </div>
        </div>
    );
};

// #endregion Helper Components


// Main Connection Component
const Connection = () => {
    // #region State Variables
    const [myProfile, setMyProfile] = useState(null);
    const [allOtherProfiles, setAllOtherProfiles] = useState([]);
    const [viewMode, setViewMode] = useState(VIEW_MODES.SUGGESTIONS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoadingTarget, setActionLoadingTarget] = useState(null);
    // Example static events data (replace or fetch dynamically if needed)
    const [eventsData] = useState([
        { id: 1, title: "Tech Meetup", date: "Next Tuesday", location: "Online", attendees: 45, image: "https://placekitten.com/200/150" },
        { id: 2, title: "Design Workshop", date: "This Friday", location: "Co-work Space", attendees: 20, image: "https://placekitten.com/201/151" },
    ]);
    // #endregion State Variables

    const navigate = useNavigate();

    // Function to fetch all necessary initial data
    const fetchData = useCallback(async () => {
        // Don't reset loading if only action target is changing
        if (!actionLoadingTarget) {
            setLoading(true);
        }
        setError(null); // Clear previous errors on new fetch attempt

        try {
            // Fetch logged-in user's profile data
            const profileResponse = await fetch(`${API_BASE_URL}/api/profile/me`, { credentials: 'include' });

            // --- Improved Response Handling ---
            if (!profileResponse.ok) {
                if (profileResponse.status === 401) {
                    console.log("Unauthorized fetching profile, redirecting to login.");
                    navigate('/login');
                    return; // Stop further execution
                }
                // Try to get error message from backend, otherwise use status text
                let errorMsg = `Failed to fetch own profile: ${profileResponse.statusText}`;
                try {
                    const errorData = await profileResponse.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) { /* Ignore if response is not JSON */ }
                throw new Error(errorMsg);
            }
            const profileData = await profileResponse.json(); // Now safe to parse
            setMyProfile(profileData.profile);

            // Fetch profiles of all other users
            const usersResponse = await fetch(`${API_BASE_URL}/api/users/all-profiles`, { credentials: 'include' });
             if (!usersResponse.ok) {
                 // Similar error handling for the second fetch
                 let errorMsg = `Failed to fetch other users: ${usersResponse.statusText}`;
                 try {
                    const errorData = await usersResponse.json();
                    errorMsg = errorData.message || errorMsg;
                 } catch(e) { /* Ignore */ }
                throw new Error(errorMsg);
            }
            const usersData = await usersResponse.json(); // Safe to parse
            setAllOtherProfiles(usersData || []);

        } catch (err) {
            console.error("Error fetching connection data:", err);
            setError(err.message || "Failed to load network data.");
            // Clear data on error? Optional, depends on desired UX
            // setMyProfile(null);
            // setAllOtherProfiles([]);
        } finally {
             // Only stop global loading if it wasn't just an action loader
            if (!actionLoadingTarget) {
                 setLoading(false);
            }
        }
    }, [navigate, actionLoadingTarget]); // Include actionLoadingTarget to prevent full reload flicker

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]); // fetchData dependency handles changes in navigate

    // Function to handle connection actions
    const handleConnectionAction = useCallback(async (action, targetUsername) => {
        setActionLoadingTarget(targetUsername);
        setError(null); // Clear previous action errors
        let endpoint = '';
        let method = 'POST';

        switch (action) {
            case 'sendRequest': endpoint = `/api/connections/request/${targetUsername}`; break;
            case 'acceptRequest': endpoint = `/api/connections/accept/${targetUsername}`; break;
            case 'rejectRequest': endpoint = `/api/connections/reject/${targetUsername}`; break;
            case 'withdrawRequest': endpoint = `/api/connections/withdraw/${targetUsername}`; method = 'DELETE'; break;
            case 'removeConnection': endpoint = `/api/connections/remove/${targetUsername}`; method = 'DELETE'; break;
            default: setActionLoadingTarget(null); return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { // Added API_BASE_URL
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            // Check response status *before* trying to parse JSON
            if (!response.ok) {
                 let errorMsg = `Action failed: ${response.statusText}`;
                 try {
                     const errorData = await response.json();
                     errorMsg = errorData.message || errorMsg;
                 } catch(e) { /* Ignore if error response isn't JSON */ }
                throw new Error(errorMsg);
            }

            // Optionally parse success message if needed
            // const data = await response.json();
            // console.log(`${action} successful:`, data.message);

            // Refetch data to update the lists and connection statuses
            await fetchData();

        } catch (e) {
            console.error(`Error performing ${action}:`, e);
            setError(`Action failed: ${e.message}`); // Display action-specific error
        } finally {
            setActionLoadingTarget(null); // Clear loading indicator for this user/action
        }
    }, [fetchData]); // fetchData dependency is important here

    // Memoized calculations for different user lists
    const { suggestions, pending, requests, connections } = useMemo(() => {
        // Return empty arrays if data isn't loaded yet to prevent errors
        if (!myProfile || !allOtherProfiles) {
            return { suggestions: [], pending: [], requests: [], connections: [] };
        }

        const myConnections = new Set(myProfile.connections || []);
        const mySentRequests = new Set(myProfile.connectionRequestsSent || []);
        const myReceivedRequests = new Set(myProfile.connectionRequestsReceived || []);

        const suggestionsList = [];
        const pendingList = [];
        const requestsList = [];
        const connectionsList = [];

        allOtherProfiles.forEach(user => {
            if (!user || !user.username || user.username === myProfile.username) return; // Skip invalid data or self

            const username = user.username;
            // Prioritize showing existing relationships over suggestions
            if (myConnections.has(username)) {
                connectionsList.push(user);
            } else if (myReceivedRequests.has(username)) { // Requests received by me
                requestsList.push(user);
            } else if (mySentRequests.has(username)) { // Requests sent by me
                pendingList.push(user);
            } else {
                suggestionsList.push(user); // Only suggest if no other relationship exists
            }
        });

        return { suggestions: suggestionsList, pending, requests, connections };
    }, [myProfile, allOtherProfiles]);

    // Function to render the current list of users based on viewMode
    const renderUserList = () => {
        let usersToList = [];
        let listTitle = "";
        let emptyMessage = "";
        let listStatus = viewMode;

        switch (viewMode) {
            case VIEW_MODES.PENDING:
                usersToList = pending;
                listTitle = "Pending Invitations";
                emptyMessage = "You haven't sent any invitations recently.";
                break;
            case VIEW_MODES.REQUESTS:
                usersToList = requests;
                listTitle = "Received Invitations";
                emptyMessage = "You have no pending invitations.";
                break;
            case VIEW_MODES.CONNECTIONS:
                usersToList = connections;
                listTitle = "My Connections";
                emptyMessage = "You haven't made any connections yet.";
                break;
            case VIEW_MODES.SUGGESTIONS:
            default:
                usersToList = suggestions;
                listTitle = "People You May Know";
                emptyMessage = "No new connection suggestions right now.";
                listStatus = VIEW_MODES.SUGGESTIONS;
                break;
        }

        return (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{listTitle} ({usersToList.length})</h2>
                {usersToList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Adjusted grid for responsiveness */}
                        {usersToList.map(user => (
                            <DynamicConnectionCard
                                key={user.username}
                                user={user}
                                status={listStatus}
                                onAction={handleConnectionAction}
                                actionLoadingTarget={actionLoadingTarget}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-center py-4">{emptyMessage}</p>
                )}
            </div>
        );
    };

    // #region Render Component JSX
    return (
        // Use h-screen and overflow-hidden on parent if navbar isn't covering part of viewport
        <div className="bg-gray-100 flex h-[calc(100vh-64px)]"> {/* Assuming 64px navbar height */}

            {/* Left Sidebar */}
            <aside className="hidden md:block w-64 lg:w-72 p-4 flex-shrink-0 overflow-y-auto">
                <nav className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4 sticky top-0">
                    <h2 className="text-base font-semibold mb-3 text-gray-700 px-2">Manage my network</h2>
                    {/* Sidebar items using Tailwind classes */}
                     <button onClick={() => setViewMode(VIEW_MODES.CONNECTIONS)} className={`w-full flex items-center mb-1 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-left ${viewMode === VIEW_MODES.CONNECTIONS ? 'bg-gray-100 font-semibold text-blue-700' : 'text-gray-600'}`}>
                        <i className="fas fa-user-friends mr-3 text-lg w-5 text-center text-gray-500"></i>
                        <span>Connections</span>
                        <span className="ml-auto text-sm text-gray-500 font-normal">{connections.length}</span>
                    </button>
                     <button onClick={() => setViewMode(VIEW_MODES.REQUESTS)} className={`w-full flex items-center mb-1 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-left ${viewMode === VIEW_MODES.REQUESTS ? 'bg-gray-100 font-semibold text-blue-700' : 'text-gray-600'}`}>
                        <i className="fas fa-user-clock mr-3 text-lg w-5 text-center text-gray-500"></i>
                        <span>Invitations</span>
                         <span className="ml-auto text-sm text-gray-500 font-normal">{requests.length}</span>
                    </button>
                     <button onClick={() => setViewMode(VIEW_MODES.PENDING)} className={`w-full flex items-center mb-1 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-left ${viewMode === VIEW_MODES.PENDING ? 'bg-gray-100 font-semibold text-blue-700' : 'text-gray-600'}`}>
                        <i className="fas fa-paper-plane mr-3 text-lg w-5 text-center text-gray-500"></i>
                        <span>Pending</span>
                         <span className="ml-auto text-sm text-gray-500 font-normal">{pending.length}</span>
                    </button>
                     <button onClick={() => setViewMode(VIEW_MODES.SUGGESTIONS)} className={`w-full flex items-center mb-1 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-left ${viewMode === VIEW_MODES.SUGGESTIONS ? 'bg-gray-100 font-semibold text-blue-700' : 'text-gray-600'}`}>
                        <i className="fas fa-lightbulb mr-3 text-lg w-5 text-center text-gray-500"></i>
                        <span>Suggestions</span>
                         <span className="ml-auto text-sm text-gray-500 font-normal">{suggestions.length}</span>
                    </button>
                    {/* Add other static items similarly */}
                </nav>
                {/* Footer/Ad Placeholder */}
                 <div className="text-center text-xs text-gray-400 mt-4">
                     {/* Ad placeholder or footer links */}
                 </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-y-auto">
                {loading && !actionLoadingTarget && ( // Show full page loader only on initial load
                     <div className="text-center p-10">
                         <i className="fas fa-spinner fa-spin text-blue-600 text-3xl"></i>
                         <p className="text-gray-500 mt-2">Loading your network...</p>
                    </div>
                )}

                {error && ( // Display error prominently
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 shadow" role="alert">
                        <p className="font-bold">Network Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Render dynamic user list */}
                 {!loading && myProfile && (
                     <section className="mb-6">
                        {renderUserList()}
                    </section>
                 )}

                {/* Static sections (only render if not loading initial data) */}
                {!loading && (
                    <>
                        {/* Grow Section (Optional) */}
                        {/* <section className="mb-6"> ... </section> */}

                         {/* Events Section */}
                         <section className="mb-6">
                            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Events Happening Soon</h2>
                                {eventsData.length > 0 ? (
                                     eventsData.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No upcoming events found.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Removed the <style jsx> block entirely */}
        </div>
    );
    // #endregion Render Component JSX
};

export default Connection;
// --- END OF REGENERATED FILE Connection.jsx ---