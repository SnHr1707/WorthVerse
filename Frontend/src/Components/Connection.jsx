// --- START OF REGENERATED FILE Connection.jsx ---
// Connection.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Define connection status types used INTERNALLY for filtering/rendering cards
const CARD_TYPE = {
    SUGGESTION: 'SUGGESTION',
    REQUEST_RECEIVED: 'REQUEST_RECEIVED',
    REQUEST_SENT: 'REQUEST_SENT',
    CONNECTION: 'CONNECTION',
};

// --- Reusable User Card Component ---
const UserCard = React.memo(({ user, cardType, onAction, actionLoading }) => {
    const { username, name, title, image } = user;

    // Use ui-avatars as fallback
    const profileImageUrl = image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || username || '?')}&background=random&size=96`;

    // --- Tailwind Class Definitions
    const buttonBase = "inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out";
    const buttonPrimary = `${buttonBase} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
    const buttonSecondary = `${buttonBase} text-indigo-700 bg-indigo-100 border-indigo-300 hover:bg-indigo-200 focus:ring-indigo-500`;
    const buttonDanger = `${buttonBase} text-red-700 bg-red-100 border-red-300 hover:bg-red-200 focus:ring-red-500`;
    const buttonSuccess = `${buttonBase} text-green-700 bg-green-100 border-green-300 hover:bg-green-200 focus:ring-green-500`;
    const buttonWarning = `${buttonBase} text-yellow-800 bg-yellow-100 border-yellow-300 hover:bg-yellow-200 focus:ring-yellow-500`;

    const renderButtons = () => {
        switch (cardType) {
            case CARD_TYPE.SUGGESTION:
                return (
                    <button
                        onClick={() => onAction('sendRequest', username)}
                        disabled={actionLoading}
                        className={`${buttonPrimary} w-full sm:w-auto`}
                    >
                        <i className="fas fa-user-plus mr-1.5"></i>Connect
                    </button>
                );
            case CARD_TYPE.REQUEST_RECEIVED:
                return (
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                        <button
                            onClick={() => onAction('acceptRequest', username)}
                            disabled={actionLoading}
                            className={`${buttonSuccess} flex-1`}
                        >
                            <i className="fas fa-check mr-1.5"></i>Accept
                        </button>
                        <button
                            onClick={() => onAction('rejectRequest', username)}
                            disabled={actionLoading}
                            className={`${buttonDanger} flex-1`}
                        >
                            <i className="fas fa-times mr-1.5"></i>Reject
                        </button>
                    </div>
                );
            case CARD_TYPE.REQUEST_SENT:
                return (
                    <button
                        onClick={() => onAction('withdrawRequest', username)}
                        disabled={actionLoading}
                        className={`${buttonWarning} w-full sm:w-auto`}
                    >
                        <i className="fas fa-undo mr-1.5"></i>Withdraw
                    </button>
                );
            case CARD_TYPE.CONNECTION:
                return (
                    <button
                        onClick={() => onAction('removeConnection', username)}
                        disabled={actionLoading}
                        className={`${buttonSecondary} w-full sm:w-auto`}
                    >
                        <i className="fas fa-user-minus mr-1.5"></i>Remove
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Link to={`/profile/${username}`} className="flex-shrink-0">
                <img
                    src={profileImageUrl}
                    alt={name || username}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || username || '?')}&background=random&size=96`; }}
                />
            </Link>
            <div className="flex-grow text-center sm:text-left">
                <Link to={`/profile/${username}`} className="hover:underline">
                    <h3 className="text-lg font-semibold text-gray-800">{name || username}</h3>
                </Link>
                <p className="text-sm text-gray-600">{title || <span className="italic text-gray-400">No title provided</span>}</p>
                {/* Optional: Add location if available */}
                {/* <p className="text-xs text-gray-500 mt-1"><i className="fas fa-map-marker-alt mr-1"></i>{location || 'Location not specified'}</p> */}
            </div>
            <div className="flex-shrink-0 mt-3 sm:mt-0 w-full sm:w-auto flex justify-center sm:justify-end">
                {renderButtons()}
            </div>
        </div>
    );
});

// --- Main Connection Component ---
const Connection = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('suggestions');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const TABS = [
        { id: 'suggestions', label: 'Suggestions', icon: 'fas fa-lightbulb' },
        { id: 'requests', label: 'Requests', icon: 'fas fa-user-clock' },
        { id: 'pending', label: 'Pending', icon: 'fas fa-paper-plane' },
        { id: 'connections', label: 'Connections', icon: 'fas fa-user-friends' },
    ];

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        console.log("Fetching initial connection data...");
        setLoading(true);
        setError(null);
        setLoggedInUser(null);
        setAllUsers([]);

        try {
            // 1. Get logged-in username
            const userMeResponse = await fetch(`http://localhost:5000/api/user/me`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
            if (!userMeResponse.ok) {
                 if (userMeResponse.status === 401) throw new Error("Not authenticated. Please log in.");
                 throw new Error(`Failed to fetch logged-in user status (${userMeResponse.status})`);
            }
            const { username } = await userMeResponse.json();
            console.log("Logged in as:", username);

            // 2. Get logged-in user's FULL profile (needed for connection arrays)
            const profileResponse = await fetch(`http://localhost:5000/api/profile/${username}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
            if (!profileResponse.ok) {
                 if (profileResponse.status === 404) {
                     console.warn(`Profile not found for logged-in user ${username}. Assuming empty connections.`);
                     setLoggedInUser({ username, profile: { connections: [], connectionRequestsSent: [], connectionRequestsReceived: [] } });
                 } else {
                     throw new Error(`Failed to fetch profile for ${username} (${profileResponse.status})`);
                 }
            } else {
                const { profile } = await profileResponse.json();
                setLoggedInUser({
                    username: username,
                    profile: {
                        connections: profile.connections || [],
                        connectionRequestsSent: profile.connectionRequestsSent || [],
                        connectionRequestsReceived: profile.connectionRequestsReceived || []
                    }
                });
                console.log("Logged-in user profile fetched:", profile);
            }


            // 3. Get ALL other users' basic info
            const allUsersResponse = await fetch(`http://localhost:5000/api/user/all`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
             if (!allUsersResponse.ok) {
                 throw new Error(`Failed to fetch all users list (${allUsersResponse.status})`);
             }
             const usersData = await allUsersResponse.json();
             setAllUsers(usersData);
             console.log("Fetched all other users:", usersData.length);

        } catch (e) {
            console.error("Error fetching connection data:", e);
            setError(e.message || 'An unexpected error occurred.');
            // Don't reset loggedInUser if only 'allUsers' fetch failed, maybe? Depends on desired behavior.
            // setLoggedInUser(null);
            setAllUsers([]);
        } finally {
            setLoading(false);
             console.log("Initial data fetch complete.");
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Connection Action Handler ---
    const handleConnectionAction = useCallback(async (action, targetUsername) => {
        if (!loggedInUser) return; // Should not happen if buttons are disabled properly

        console.log(`Attempting action: ${action} on target: ${targetUsername}`);
        setActionLoading(true);
        setError(null);
        let endpoint = '';
        let method = 'POST';

        switch (action) {
            case 'sendRequest': endpoint = `/api/connections/request/${targetUsername}`; break;
            case 'acceptRequest': endpoint = `/api/connections/accept/${targetUsername}`; break; // Target is the *requester*
            case 'rejectRequest': endpoint = `/api/connections/reject/${targetUsername}`; break; // Target is the *requester*
            case 'withdrawRequest': endpoint = `/api/connections/withdraw/${targetUsername}`; method = 'DELETE'; break; // Target is the *receiver*
            case 'removeConnection': endpoint = `/api/connections/remove/${targetUsername}`; method = 'DELETE'; break; // Target is the connection
            default: setActionLoading(false); return;
        }

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json(); // Attempt to parse JSON regardless of status

            if (!response.ok) {
                 console.error(`Action '${action}' failed: ${response.status}`, data);
                throw new Error(data.message || `Action failed with status ${response.status}`);
            }

            console.log(`Action '${action}' successful:`, data.message);
            // CRITICAL: Refetch ALL data to ensure UI consistency
            await fetchData();

        } catch (e) {
            console.error(`Error performing action '${action}':`, e);
            setError(`Action failed: ${e.message}`);
        } finally {
            setActionLoading(false);
        }
    }, [loggedInUser, fetchData]); // Include fetchData dependency

    // --- Filtering and Memoization ---
    const { connectionsUsernames, requestsUsernames, pendingUsernames } = useMemo(() => {
        if (!loggedInUser?.profile) return { connectionsUsernames: new Set(), requestsUsernames: new Set(), pendingUsernames: new Set() };
        return {
            connectionsUsernames: new Set(loggedInUser.profile.connections || []),
            requestsUsernames: new Set(loggedInUser.profile.connectionRequestsReceived || []),
            pendingUsernames: new Set(loggedInUser.profile.connectionRequestsSent || []),
        };
    }, [loggedInUser]);

    // Memoize lists based on fetched data and derived sets
    const suggestions = useMemo(() => allUsers.filter(user =>
        !connectionsUsernames.has(user.username) &&
        !requestsUsernames.has(user.username) &&
        !pendingUsernames.has(user.username)
    ), [allUsers, connectionsUsernames, requestsUsernames, pendingUsernames]);

    const requests = useMemo(() => allUsers.filter(user => requestsUsernames.has(user.username)), [allUsers, requestsUsernames]);

    const pending = useMemo(() => allUsers.filter(user => pendingUsernames.has(user.username)), [allUsers, pendingUsernames]);

    const connections = useMemo(() => allUsers.filter(user => connectionsUsernames.has(user.username)), [allUsers, connectionsUsernames]);

    // Apply search term ONLY to connections tab
    const filteredConnections = useMemo(() => {
        if (activeTab !== 'connections' || !searchTerm) {
            return connections;
        }
        const lowerSearchTerm = searchTerm.toLowerCase();
        return connections.filter(user =>
            user.name?.toLowerCase().includes(lowerSearchTerm) ||
            user.username.toLowerCase().includes(lowerSearchTerm) ||
            user.title?.toLowerCase().includes(lowerSearchTerm)
        );
    }, [connections, searchTerm, activeTab]);

    // Determine which list to display based on activeTab
    const currentList = useMemo(() => {
        switch (activeTab) {
            case 'suggestions': return suggestions;
            case 'requests': return requests;
            case 'pending': return pending;
            case 'connections': return filteredConnections; // Use searched connections
            default: return [];
        }
    }, [activeTab, suggestions, requests, pending, filteredConnections]);

    const currentCardType = useMemo(() => {
         switch (activeTab) {
            case 'suggestions': return CARD_TYPE.SUGGESTION;
            case 'requests': return CARD_TYPE.REQUEST_RECEIVED;
            case 'pending': return CARD_TYPE.REQUEST_SENT;
            case 'connections': return CARD_TYPE.CONNECTION;
            default: return null;
        }
    }, [activeTab]);


    // --- Render Logic ---

    if (loading && !loggedInUser) { // Show full page loader only on initial load
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100">
                <div className="text-center p-10">
                    <i className="fas fa-spinner fa-spin text-indigo-500 text-4xl mb-4"></i>
                    <p className="text-lg text-gray-600">Loading network...</p>
                </div>
            </div>
        );
    }

    // Show error prominently if initial load failed significantly
     if (error && !loggedInUser) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100">
                <div className="text-center p-10 max-w-md mx-auto bg-white rounded-lg shadow-xl">
                     <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Network Unavailable</h2>
                    <p className="text-red-600">{error}</p>
                     <Link to="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150">
                         Go Home
                     </Link>
                 </div>
             </div>
        );
    }

    // --- Tailwind Class Definitions ---
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const inputBaseClass = "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150";


    return (
        <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 min-h-full md:max-h-[calc(100vh-64px)] flex font-sans">

            {/* Left Sidebar */}
            <aside className="hidden md:block w-64 bg-white shadow-md flex-shrink-0 md:max-h-[calc(100vh-64px)] sticky top-16 h-full border-r border-gray-200">
                 <div className="p-4 sticky top-0">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 px-2">Manage Network</h2>
                    <nav className="space-y-1">
                        {TABS.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <i className={`${tab.icon} mr-3 text-lg w-5 text-center ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                                <span>{tab.label}</span>
                                {tab.id === 'requests' && requests.length > 0 && (
                                    <span className="ml-auto inline-block py-0.5 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-500 text-white rounded-full text-xs">{requests.length}</span>
                                )}
                                {tab.id === 'connections' && connections.length > 0 && (
                                    <span className="ml-auto inline-block py-0.5 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-gray-200 text-gray-600 rounded-full text-xs">{connections.length}</span>
                                )}
                             </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-h-[calc(100vh-64px)] overflow-y-auto scroll-smooth relative">

                 {/* Loading Overlay for Actions */}
                {actionLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm rounded-lg">
                        <i className="fas fa-spinner fa-spin text-indigo-600 text-4xl"></i>
                    </div>
                )}

                 {/* General Error Banner (for non-initial errors) */}
                 {error && loggedInUser && (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow-sm" role="alert">
                         <strong className="font-bold block sm:inline">Error: </strong>
                         <span className="block sm:inline">{error}</span>
                         <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 hover:text-red-700">
                             <i className="fas fa-times"></i>
                         </button>
                     </div>
                 )}


                {/* Header for the current view */}
                <div className="mb-6 pb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                         {TABS.find(t => t.id === activeTab)?.label || 'My Network'}
                         <span className="text-lg font-normal text-gray-500 ml-2">({currentList.length})</span>
                     </h1>
                     {/* Search Bar - Only for Connections Tab */}
                     {activeTab === 'connections' && (
                        <div className="relative w-full sm:w-64">
                             <label htmlFor="connection-search" className="sr-only">Search Connections</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="search"
                                id="connection-search"
                                name="connection-search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search connections..."
                                className={`${inputBaseClass} pl-10`}
                            />
                        </div>
                    )}
                </div>

                {/* User Card Grid */}
                {loading && loggedInUser && ( 
                    <div className="text-center py-4">
                        <i className="fas fa-spinner fa-spin text-indigo-500 text-2xl"></i>
                    </div>
                )}

                 {!loading && currentList.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {currentList.map(user => (
                            <UserCard
                                key={user.username}
                                user={user}
                                cardType={currentCardType}
                                onAction={handleConnectionAction}
                                actionLoading={actionLoading}
                            />
                        ))}
                    </div>
                 )}

                {!loading && currentList.length === 0 && (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
                        <i className={`${TABS.find(t => t.id === activeTab)?.icon || 'fas fa-users-slash'} text-4xl text-gray-400 mb-4`}></i>
                        <h3 className="text-lg font-semibold text-gray-700">
                            {activeTab === 'suggestions' && "No new suggestions right now."}
                            {activeTab === 'requests' && "No pending connection requests."}
                            {activeTab === 'pending' && "You haven't sent any pending requests."}
                            {activeTab === 'connections' && (searchTerm ? "No connections match your search." : "You don't have any connections yet.")}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeTab === 'suggestions' && "Check back later or explore profiles!"}
                            {activeTab === 'requests' && "Requests from other users will appear here."}
                            {activeTab === 'pending' && "Requests you send will appear here until accepted."}
                            {activeTab === 'connections' && (searchTerm ? "Try different search terms." : "Start connecting with people!")}
                        </p>
                         {activeTab !== 'suggestions' && activeTab !== 'connections' && (
                             <button
                                onClick={() => setActiveTab('suggestions')}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
                             >
                                 Find People to Connect With
                             </button>
                         )}
                    </div>
                )}

            </main>
        </div>
    );
    // #endregion Render Component JSX
};

export default Connection;
// --- END OF REGENERATED FILE Connection.jsx ---