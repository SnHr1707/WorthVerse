// MyProfile.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Define connection status types (kept for clarity)
const CONNECTION_STATUS = {
    LOADING: 'LOADING',
    SELF: 'SELF',
    NOT_LOGGED_IN: 'NOT_LOGGED_IN',
    CAN_CONNECT: 'CAN_CONNECT',
    REQUEST_SENT: 'REQUEST_SENT', 
    REQUEST_RECEIVED: 'REQUEST_RECEIVED',
    CONNECTED: 'CONNECTED',
    PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    ERROR: 'ERROR',
};

// Helper component for cleaner list item rendering
const ProfileListItem = ({ children, isEditMode, color = 'indigo', onDelete, index, ...props }) => {
    const baseClasses = `bg-white rounded-lg shadow-md p-4 border-l-4 transition-all duration-300 ease-in-out`;
    const hoverClasses = isEditMode ? '' : `hover:shadow-lg hover:scale-[1.02]`;
    const borderClass = isEditMode ? `border-gray-300` : `border-${color}-500`;

    return (
        <div className={`${baseClasses} ${borderClass} ${hoverClasses} relative`} {...props}>
            {children}
            {isEditMode && onDelete && (
                <button
                    onClick={() => onDelete(index)}
                    type="button"
                    title="Delete Item"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-150"
                >
                    <i className="fas fa-trash-alt w-4 h-4"></i>
                </button>
            )}
        </div>
    );
};


function MyProfile() {
    const { username: profileUsernameFromURL } = useParams();
    const navigate = useNavigate();

    // --- State Declarations ---
    const [profile, setProfile] = useState(null);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.LOADING);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileDataForEdit, setProfileDataForEdit] = useState(null);
    const [showAllExperience, setShowAllExperience] = useState(false);
    const [showAllEducation, setShowAllEducation] = useState(false);
    const [showAllCertifications, setShowAllCertifications] = useState(false);

    // Refs for smooth scroll targeting
    const experienceRef = useRef(null);
    const educationRef = useRef(null);
    const certificationsRef = useRef(null);

    // --- Sorting Logic (Memoized for potential performance gain) ---
    const sortedExperience = React.useMemo(() => {
        return profile?.experience?.length > 0
            ? [...profile.experience].sort((a, b) => {
                  const getEndDateYear = (duration) => {
                      const parts = duration?.split(' - ') || [];
                      const endDateStr = parts[1] || parts[0];
                      return endDateStr?.toLowerCase() === 'present' ? new Date().getFullYear() + 1 : parseInt(endDateStr?.match(/\d{4}/)?.[0] || '0', 10);
                  };
                  return getEndDateYear(b.duration) - getEndDateYear(a.duration);
              })
            : [];
    }, [profile?.experience]);

    const sortedEducation = React.useMemo(() => {
        return profile?.education?.length > 0
            ? [...profile.education].sort((a, b) => parseInt(b.year?.match(/\d{4}/)?.[0] || '0', 10) - parseInt(a.year?.match(/\d{4}/)?.[0] || '0', 10))
            : [];
    }, [profile?.education]);

    // No sorting needed for certifications by default, keep original order unless specified
    const sortedCertifications = React.useMemo(() => profile?.certifications || [], [profile?.certifications]);

    // --- Fetching Logic (largely unchanged, added console logs for clarity) ---
    const fetchInitialData = useCallback(async () => {
        console.log("fetchInitialData triggered for:", profileUsernameFromURL);
        setLoading(true);
        setError(null);
        setLoggedInUsername(null);
        setConnectionStatus(CONNECTION_STATUS.LOADING);
        let currentLoggedInUsername = null;

        setShowAllExperience(false);
        setShowAllEducation(false);
        setShowAllCertifications(false);

        try {
            // 1. Check logged-in status
            try {
                const userMeResponse = await fetch(`http://localhost:5000/api/user/me`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
                if (userMeResponse.ok) {
                    const userData = await userMeResponse.json();
                    currentLoggedInUsername = userData.username;
                    setLoggedInUsername(currentLoggedInUsername);
                    console.log("Viewer logged in as:", currentLoggedInUsername);
                } else if (userMeResponse.status === 401) {
                    console.log("Viewer not logged in.");
                    setLoggedInUsername(null);
                } else {
                    console.warn("Non-critical error fetching logged-in user:", userMeResponse.statusText);
                }
            } catch (userFetchError) {
                console.warn("Network error fetching logged-in user:", userFetchError);
            }

            // 2. Fetch profile data
            console.log("Fetching profile for:", profileUsernameFromURL);
            const profileResponse = await fetch(`http://localhost:5000/api/profile/${profileUsernameFromURL}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });

            if (!profileResponse.ok) {
                const errorData = await profileResponse.json().catch(() => ({}));
                const errorMessage = errorData.message || `HTTP error ${profileResponse.status}`;
                console.error(`Failed to fetch profile: ${profileResponse.status} - ${errorMessage}`);

                if (profileResponse.status === 404) {
                     setConnectionStatus(errorMessage.includes('User not found') ? CONNECTION_STATUS.USER_NOT_FOUND : CONNECTION_STATUS.PROFILE_NOT_FOUND);
                     setError({ message: errorMessage });
                } else {
                    setConnectionStatus(CONNECTION_STATUS.ERROR);
                    setError({ message: `Failed to fetch profile: ${errorMessage}`});
                }
                setProfile(null);
                setLoading(false);
                return;
            }

            const profileData = await profileResponse.json();
            setProfile(profileData.profile);
            // Ensure nested structures exist for edit mode, even if empty in fetched data
            const initialEditData = {
                ...profileData.profile,
                links: profileData.profile.links || { github: '', portfolio: '' },
                skills: profileData.profile.skills || [],
                experience: profileData.profile.experience || [],
                education: profileData.profile.education || [],
                certifications: profileData.profile.certifications || [],
            };
            setProfileDataForEdit(initialEditData);
            console.log("Fetched profile:", profileData.profile);

            // 3. Determine Connection Status
            if (!currentLoggedInUsername) {
                setConnectionStatus(CONNECTION_STATUS.NOT_LOGGED_IN);
            } else if (currentLoggedInUsername === profileData.profile.username) {
                setConnectionStatus(CONNECTION_STATUS.SELF);
            } else {
                // Use optional chaining and default empty arrays for safety
                const connections = profileData.profile.connections || [];
                const requestsSent = profileData.profile.connectionRequestsSent || []; 
                const requestsReceived = profileData.profile.connectionRequestsReceived || [];

                console.log("Checking connection status:", { currentLoggedInUsername, connections, requestsSent, requestsReceived });

                if (connections.includes(currentLoggedInUsername)) {
                    setConnectionStatus(CONNECTION_STATUS.CONNECTED);
                } else if (requestsReceived.includes(currentLoggedInUsername)) { 
                    setConnectionStatus(CONNECTION_STATUS.REQUEST_RECEIVED);
                } else if (requestsSent.includes(currentLoggedInUsername)) { 
                    setConnectionStatus(CONNECTION_STATUS.REQUEST_SENT);
                } else {
                    setConnectionStatus(CONNECTION_STATUS.CAN_CONNECT);
                }
            }

        } catch (e) {
            console.error("Error in fetchInitialData:", e);
            setError({message: e.message || 'An unexpected error occurred.'});
            setConnectionStatus(CONNECTION_STATUS.ERROR);
            setProfile(null);
        } finally {
            setLoading(false);
            console.log("fetchInitialData finished. Loading:", false, "Status:", connectionStatus);
        }
    }, [profileUsernameFromURL]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]); 

    // --- Smooth Scroll Helper ---
    const scrollToRef = (ref) => {
        // Scrolls the main container, not the window
        const scrollContainer = document.getElementById('profile-scroll-container');
        if (scrollContainer && ref.current) {
            const containerTop = scrollContainer.getBoundingClientRect().top;
            const elementTop = ref.current.getBoundingClientRect().top;
            const offset = elementTop - containerTop + scrollContainer.scrollTop - 20;

            scrollContainer.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    };

    // --- Edit Mode Handlers ---
    const handleEditClick = () => {
        if (connectionStatus === CONNECTION_STATUS.SELF) {
            setProfileDataForEdit(JSON.parse(JSON.stringify(profile || {})));
            setIsEditMode(true);
            setError(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        // Reset edit data back to the original profile state
        setProfileDataForEdit(profile);
        setError(null);
    };

    const handleSaveProfile = async () => {
        if (connectionStatus !== CONNECTION_STATUS.SELF || !profileDataForEdit) return;

        setActionLoading(true);
        setError(null);
        try {
            const username = profileDataForEdit.username;
            // Prune empty strings from arrays before sending
            const cleanedData = {
                ...profileDataForEdit,
                skills: (profileDataForEdit.skills || []).filter(s => s && s.trim() !== ''),
                // Add similar cleaning for other array fields if needed
            };

            const response = await fetch(`http://localhost:5000/api/profile/${username}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(cleanedData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
                throw new Error(errorData.message || `Failed to update profile.`);
            }

            const updatedProfileData = await response.json();
            setProfile(updatedProfileData.profile);
            setProfileDataForEdit(updatedProfileData.profile);
            setIsEditMode(false);
            console.log("Profile updated successfully");

        } catch (e) {
            console.error("Error updating profile:", e);
            setError({ message: `Update failed: ${e.message}` });
        } finally {
            setActionLoading(false);
        }
    };

    // --- Input Change Handlers (Generic and Specific) ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileDataForEdit(prevData => ({ ...prevData, [name]: value }));
    };
    const handleLinksChange = (e) => {
        const { name, value } = e.target;
        setProfileDataForEdit(prevData => ({ ...prevData, links: { ...prevData.links, [name]: value } }));
    };
    // Generic array item change handler
    const handleArrayItemChange = (arrayName, index, field, value) => {
        setProfileDataForEdit(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((item, i) => i === index ? { ...item, [field]: value } : item)
        }));
    };
    // Generic array add handler
    const handleAddItem = (arrayName, newItem) => {
        setProfileDataForEdit(prev => ({ ...prev, [arrayName]: [...(prev[arrayName] || []), newItem] }));
    };
    // Generic array delete handler
    const handleDeleteItem = (arrayName, index) => {
        setProfileDataForEdit(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
    };
    // Skill specific handlers (using generics)
    const handleSkillChange = (index, value) => {
        setProfileDataForEdit(prev => ({ ...prev, skills: prev.skills.map((s, i) => i === index ? value : s) }));
    };
    const handleAddSkill = () => handleAddItem('skills', "");
    const handleDeleteSkill = (index) => handleDeleteItem('skills', index);
    // Experience specific handlers (using generics)
    const handleExperienceChange = (index, field, value) => handleArrayItemChange('experience', index, field, value);
    const handleAddExperience = () => handleAddItem('experience', { position: "", company: "", duration: "", description: "" });
    const handleDeleteExperience = (index) => handleDeleteItem('experience', index);
    // Education specific handlers (using generics)
    const handleEducationChange = (index, field, value) => handleArrayItemChange('education', index, field, value);
    const handleAddEducation = () => handleAddItem('education', { degree: "", institution: "", year: "" });
    const handleDeleteEducation = (index) => handleDeleteItem('education', index);
    // Certification specific handlers (using generics)
    const handleCertificationChange = (index, field, value) => handleArrayItemChange('certifications', index, field, value);
    const handleAddCertification = () => handleAddItem('certifications', { title: "", authority: "", link: "" });
    const handleDeleteCertification = (index) => handleDeleteItem('certifications', index);


    // --- Connection Action Handler (Unchanged logic, added logs) ---
     const handleConnectionAction = async (action, targetUsername) => {
        console.log(`Attempting action: ${action} on target: ${targetUsername}`);
        setActionLoading(true);
        setError(null);
        let endpoint = '';
        let method = 'POST';

        switch (action) {
            case 'sendRequest': endpoint = `/api/connections/request/${targetUsername}`; break;
            case 'acceptRequest': endpoint = `/api/connections/accept/${targetUsername}`; break;
            case 'rejectRequest': endpoint = `/api/connections/reject/${targetUsername}`; break;
            case 'withdrawRequest': endpoint = `/api/connections/withdraw/${targetUsername}`; method = 'DELETE'; break;
            case 'removeConnection': endpoint = `/api/connections/remove/${targetUsername}`; method = 'DELETE'; break;
            default: setActionLoading(false); return;
        }

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) {
                 console.error(`Action '${action}' failed: ${response.status}`, data);
                throw new Error(data.message || `Action failed with status ${response.status}`);
            }

            console.log(`Action '${action}' successful:`, data.message);
            // CRITICAL: Refetch ALL data to ensure UI consistency after state change on backend
            await fetchInitialData();

        } catch (e) {
            console.error(`Error performing action '${action}':`, e);
            setError({ message: `Action failed: ${e.message}` });
        } finally {
            setActionLoading(false);
        }
    };


    // --- Render Logic ---

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-10">
                    <i className="fas fa-spinner fa-spin text-blue-500 text-4xl mb-4"></i>
                    <p className="text-lg text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

     // Handle specific error/not found states cleanly
     if (connectionStatus === CONNECTION_STATUS.ERROR || connectionStatus === CONNECTION_STATUS.PROFILE_NOT_FOUND || connectionStatus === CONNECTION_STATUS.USER_NOT_FOUND) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-10 max-w-md mx-auto bg-white rounded-lg shadow-xl">
                     <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Unavailable</h2>
                    <p className="text-red-600">{error?.message || 'An unexpected error occurred while loading the profile.'}</p>
                    <Link to="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

     // Fallback if profile data is unexpectedly null after loading and no specific error state
     if (!profile) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-10 max-w-md mx-auto bg-white rounded-lg shadow-xl">
                    <i className="fas fa-question-circle text-yellow-500 text-4xl mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Data Missing</h2>
                    <p className="text-gray-600">The profile data could not be loaded or is incomplete.</p>
                     <Link to="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150">
                         Go Home
                     </Link>
                 </div>
             </div>
        );
     }

    // --- Active Profile Data (Edit or View) ---
    const currentProfileData = isEditMode ? profileDataForEdit : profile;

    // --- Dynamic Title ---
    let profileTitle = "User Profile";
    if (connectionStatus === CONNECTION_STATUS.SELF) {
        profileTitle = isEditMode ? "Edit My Profile" : "My Profile";
    } else if (profile) {
        profileTitle = `${profile.name || profile.username}'s Profile`;
    }

    // --- Tailwind Class Definitions (for readability) ---
    const inputBaseClass = "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150";
    const textareaClass = `${inputBaseClass} min-h-[80px]`;
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const buttonBase = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out";
    const buttonPrimary = `${buttonBase} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
    const buttonSecondary = `${buttonBase} text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500`;
    const buttonDanger = `${buttonBase} text-white bg-red-600 hover:bg-red-700 focus:ring-red-500`;
    const buttonSuccess = `${buttonBase} text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`;
    const buttonTeal = `${buttonBase} text-white bg-teal-500 hover:bg-teal-600 focus:ring-teal-400`;
    const iconButtonBase = "p-2 rounded-full inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out";
    const statusBadgeBase = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

    // --- JSX Return ---
    return (
        <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-blue-100 min-h-full md:max-h-[calc(100vh-64px)] p-3 sm:p-8 font-sans">
            {/* Scrollable Container */}
            <div id="profile-scroll-container" className="max-w-5xl mx-auto bg-white p-5 sm:p-8 shadow-2xl rounded-xl relative overflow-y-auto max-h-[calc(100vh-120px)] scroll-smooth">

                {/* Loading Overlay for Actions */}
                {actionLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 rounded-xl backdrop-blur-sm">
                        <i className="fas fa-spinner fa-spin text-indigo-600 text-4xl"></i>
                    </div>
                )}

                {/* Error Message Banner */}
                 {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow-sm" role="alert">
                         <strong className="font-bold block sm:inline">Error: </strong>
                         <span className="block sm:inline">{error.message}</span>
                         <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 hover:text-red-700">
                             <i className="fas fa-times"></i>
                         </button>
                     </div>
                 )}

                {/* --- Profile Header Area --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                         {profileTitle}
                    </h1>
                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap items-center">
                         {/* Edit Buttons */}
                         {connectionStatus === CONNECTION_STATUS.SELF && !isEditMode && (
                             <button onClick={handleEditClick} disabled={actionLoading} className={`${buttonPrimary}`}>
                                 <i className="fas fa-pencil-alt -ml-1 mr-2 h-4 w-4"></i>Edit Profile
                             </button>
                         )}
                         {connectionStatus === CONNECTION_STATUS.SELF && isEditMode && (
                             <>
                                 <button onClick={handleSaveProfile} disabled={actionLoading} className={`${buttonSuccess}`}>
                                      <i className="fas fa-save -ml-1 mr-2 h-4 w-4"></i>Save Changes
                                 </button>
                                 <button onClick={handleCancelEdit} disabled={actionLoading} className={`${buttonSecondary}`}>
                                     <i className="fas fa-times -ml-1 mr-2 h-4 w-4"></i>Cancel
                                 </button>
                             </>
                         )}

                         {/* Connection Buttons */}
                         {connectionStatus === CONNECTION_STATUS.NOT_LOGGED_IN && (
                            <Link to="/login" className={`${buttonPrimary} bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`}>
                                 <i className="fas fa-sign-in-alt -ml-1 mr-2 h-4 w-4"></i>Login to Connect
                            </Link>
                         )}
                         {connectionStatus === CONNECTION_STATUS.CAN_CONNECT && (
                            <button onClick={() => handleConnectionAction('sendRequest', profile.username)} disabled={actionLoading} className={`${buttonTeal}`}>
                                <i className="fas fa-user-plus -ml-1 mr-2 h-4 w-4"></i>Connect
                            </button>
                         )}
                         {connectionStatus === CONNECTION_STATUS.REQUEST_SENT && (
                            <div className="flex gap-2 items-center">
                                <span className={`${statusBadgeBase} bg-yellow-100 text-yellow-800`}>
                                    <i className="fas fa-paper-plane mr-2 h-4 w-4"></i>Request Sent
                                </span>
                                <button onClick={() => handleConnectionAction('withdrawRequest', profile.username)} disabled={actionLoading} title="Withdraw Request" className={`${iconButtonBase} text-yellow-600 hover:bg-yellow-100`}>
                                    <i className="fas fa-undo h-4 w-4"></i>
                                </button>
                            </div>
                         )}
                         {connectionStatus === CONNECTION_STATUS.REQUEST_RECEIVED && (
                            <div className="flex gap-2">
                                <button onClick={() => handleConnectionAction('acceptRequest', profile.username)} disabled={actionLoading} className={`${buttonSuccess}`}>
                                    <i className="fas fa-check -ml-1 mr-2 h-4 w-4"></i>Accept
                                </button>
                                <button onClick={() => handleConnectionAction('rejectRequest', profile.username)} disabled={actionLoading} className={`${buttonDanger}`}>
                                    <i className="fas fa-times -ml-1 mr-2 h-4 w-4"></i>Reject
                                </button>
                             </div>
                         )}
                          {connectionStatus === CONNECTION_STATUS.CONNECTED && (
                            <div className="flex gap-2 items-center">
                                <span className={`${statusBadgeBase} bg-green-100 text-green-800`}>
                                    <i className="fas fa-check-circle mr-2 h-4 w-4"></i>Connected
                                </span>
                                <button onClick={() => handleConnectionAction('removeConnection', profile.username)} disabled={actionLoading} title="Remove Connection" className={`${iconButtonBase} text-red-500 hover:bg-red-100`}>
                                    <i className="fas fa-user-minus h-4 w-4"></i>
                                </button>
                            </div>
                         )}
                    </div>
                </div>


                {/* --- Profile Details Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (or Top on Mobile) - Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Picture & Basic Info */}
                        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 rounded-lg shadow-md text-center">
                             {isEditMode ? (
                                <div className='mb-4'>
                                    <label htmlFor="image" className={labelClass}>Image URL</label>
                                    <input type="text" id="image" name="image" value={currentProfileData.image || ''} onChange={handleInputChange} placeholder="https://..." className={inputBaseClass} />
                                    {/* Simple preview */}
                                    {currentProfileData.image && <img src={currentProfileData.image} alt="Preview" className="mt-2 w-20 h-20 rounded-full mx-auto object-cover border border-gray-300"/>}
                                </div>
                             ) : (
                                <img
                                    src={currentProfileData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfileData.name || currentProfileData.username || '?')}&background=random&size=128`}
                                    alt={currentProfileData.name || currentProfileData.username}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto mb-4 object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfileData.name || '?')}&background=random&size=128`; }}
                                />
                             )}

                             {isEditMode ? (
                                <div className='space-y-3 text-left'>
                                    <div>
                                        <label htmlFor="name" className={labelClass}>Name</label>
                                        <input type="text" id="name" name="name" value={currentProfileData.name || ''} onChange={handleInputChange} placeholder="Your Full Name" className={inputBaseClass}/>
                                    </div>
                                    <div>
                                        <label htmlFor="title" className={labelClass}>Title / Headline</label>
                                        <input type="text" id="title" name="title" value={currentProfileData.title || ''} onChange={handleInputChange} placeholder="e.g., Software Engineer | Web Developer" className={inputBaseClass}/>
                                    </div>
                                </div>
                             ) : (
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 mt-2">{currentProfileData.name || currentProfileData.username}</h2>
                                    <p className="text-md text-indigo-600 font-medium">{currentProfileData.title || <span className="text-gray-400 italic">No title provided</span>}</p>
                                </>
                             )}
                        </div>

                         {/* Links Section */}
                         <div className="bg-white p-5 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Links</h3>
                             <div className="space-y-3">
                                {isEditMode ? (
                                    <>
                                        <div>
                                            <label htmlFor="github" className={labelClass}>
                                                <i className="fab fa-github mr-2 text-gray-500"></i>GitHub URL
                                            </label>
                                            <input type="text" id="github" name="github" value={currentProfileData.links?.github || ''} onChange={handleLinksChange} placeholder="https://github.com/..." className={inputBaseClass}/>
                                        </div>
                                        <div>
                                            <label htmlFor="portfolio" className={labelClass}>
                                                 <i className="fas fa-briefcase mr-2 text-gray-500"></i>Portfolio URL
                                            </label>
                                            <input type="text" id="portfolio" name="portfolio" value={currentProfileData.links?.portfolio || ''} onChange={handleLinksChange} placeholder="https://your-site.com" className={inputBaseClass}/>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {currentProfileData.links?.github ? (
                                             <a href={currentProfileData.links.github} target="_blank" rel="noopener noreferrer" title="GitHub Profile" className="flex items-center text-gray-600 hover:text-indigo-600 hover:underline transition duration-150 group">
                                                 <i className="fab fa-github text-xl mr-3 text-gray-500 group-hover:text-gray-800"></i>
                                                 <span className="truncate">{currentProfileData.links.github.replace(/^https?:\/\//, '')}</span>
                                                 <i className="fas fa-external-link-alt text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                             </a>
                                         ) : ( <p className="text-sm text-gray-400 italic flex items-center"><i className="fab fa-github text-xl mr-3 text-gray-400"></i> No GitHub link.</p> )}

                                         {currentProfileData.links?.portfolio ? (
                                             <a href={currentProfileData.links.portfolio} target="_blank" rel="noopener noreferrer" title="Portfolio Website" className="flex items-center text-gray-600 hover:text-indigo-600 hover:underline transition duration-150 group">
                                                 <i className="fas fa-briefcase text-xl mr-3 text-gray-500 group-hover:text-blue-700"></i>
                                                 <span className="truncate">{currentProfileData.links.portfolio.replace(/^https?:\/\//, '')}</span>
                                                 <i className="fas fa-external-link-alt text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                             </a>
                                         ) : ( <p className="text-sm text-gray-400 italic flex items-center"><i className="fas fa-briefcase text-xl mr-3 text-gray-400"></i> No portfolio link.</p> )}
                                    </>
                                )}
                             </div>
                        </div>

                        {/* Skills Section */}
                         <div className="bg-white p-5 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2 items-center">
                                {isEditMode ? (
                                    <>
                                        {(currentProfileData.skills || []).map((skill, index) => (
                                            <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md text-sm border border-gray-300">
                                                <input
                                                    type="text" value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} placeholder="Skill"
                                                    className="bg-transparent focus:outline-none text-gray-700 text-xs font-medium w-24 p-0.5"
                                                />
                                                <button onClick={() => handleDeleteSkill(index)} type="button" title="Remove Skill" className="text-red-400 hover:text-red-600 text-xs focus:outline-none">
                                                    <i className="fas fa-times-circle"></i>
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={handleAddSkill} type="button" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center transition duration-150">
                                            <i className="fas fa-plus mr-1 text-xs"></i> Add Skill
                                        </button>
                                    </>
                                ) : (
                                    (currentProfileData.skills && currentProfileData.skills.length > 0) ? (
                                        currentProfileData.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 cursor-default transition duration-150 hover:bg-indigo-200 hover:shadow-sm">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">No skills listed.</span>
                                    )
                                )}
                            </div>
                        </div>

                    </div> {/* End Left Column */}


                    {/* Right Column (or Bottom on Mobile) - Detailed Sections */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Section */}
                         <section className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center">
                                <i className="fas fa-user-circle mr-3 text-indigo-500"></i>About Me
                            </h3>
                            {isEditMode ? (
                                <>
                                    <label htmlFor="about" className={labelClass}>Your Bio</label>
                                    <textarea
                                        id="about" name="about" rows="5"
                                        value={currentProfileData.about || ''} onChange={handleInputChange} placeholder="Write a short bio about your professional background, interests, and goals..."
                                        className={textareaClass}
                                    />
                                </>
                            ) : (
                                <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">
                                    {currentProfileData.about || <span className="text-gray-400 italic">No bio provided. Add a bio to help others learn more about you!</span>}
                                </p>
                            )}
                        </section>

                         {/* Experience Section */}
                         <section ref={experienceRef} className="bg-gradient-to-br from-green-50 via-white to-gray-50 p-6 rounded-lg shadow-md scroll-mt-16">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                                <i className="fas fa-briefcase mr-3 text-green-600"></i>Experience
                            </h3>
                            <div className="space-y-5">
                                 {(isEditMode ? (currentProfileData.experience || []) : (showAllExperience ? sortedExperience : sortedExperience.slice(0, 2))).map((exp, index) => (
                                    <ProfileListItem key={`exp-${index}`} isEditMode={isEditMode} color="green" onDelete={handleDeleteExperience} index={index}>
                                        {isEditMode ? (
                                            <div className='space-y-2'>
                                                <input type="text" value={exp.position || ''} onChange={(e) => handleExperienceChange(index, 'position', e.target.value)} placeholder="Position / Title" className={`${inputBaseClass} font-medium`} />
                                                <input type="text" value={exp.company || ''} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} placeholder="Company Name" className={`${inputBaseClass} text-sm`} />
                                                <input type="text" value={exp.duration || ''} onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)} placeholder="Duration (e.g., Jan 2020 - Present)" className={`${inputBaseClass} text-xs`} />
                                                <textarea value={exp.description || ''} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} placeholder="Key responsibilities and achievements..." rows="3" className={`${textareaClass} mt-1 text-sm`}></textarea>
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className="font-semibold text-lg text-gray-800">{exp.position}</h4>
                                                <p className="text-md text-gray-600 font-medium">{exp.company}</p>
                                                <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                                                <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                                            </>
                                        )}
                                    </ProfileListItem>
                                ))}
                                {isEditMode && (
                                    <button onClick={handleAddExperience} type="button" className="mt-2 bg-green-100 hover:bg-green-200 text-green-800 font-bold py-1.5 px-3 rounded-md text-sm inline-flex items-center transition duration-150">
                                        <i className="fas fa-plus mr-1.5 text-xs"></i> Add Experience
                                    </button>
                                )}
                                {!isEditMode && sortedExperience.length === 0 && <span className="text-sm text-gray-400 italic pl-4">No experience listed.</span>}
                                {!isEditMode && sortedExperience.length > 2 && (
                                    <button onClick={() => {
                                        const shouldShow = !showAllExperience;
                                        setShowAllExperience(shouldShow);
                                        if (!shouldShow) {
                                             setTimeout(() => scrollToRef(experienceRef), 50);
                                        }
                                    }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 focus:outline-none ml-4">
                                        {showAllExperience ? "View Less" : "View More"} Experience
                                        <i className={`fas ${showAllExperience ? 'fa-chevron-up' : 'fa-chevron-down'} ml-1 text-xs`}></i>
                                    </button>
                                )}
                             </div>
                        </section>

                         {/* Education Section */}
                         <section ref={educationRef} className="bg-gradient-to-br from-purple-50 via-white to-gray-50 p-6 rounded-lg shadow-md scroll-mt-16">
                             <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                                <i className="fas fa-graduation-cap mr-3 text-purple-600"></i>Education
                            </h3>
                             <div className="space-y-5">
                                {(isEditMode ? (currentProfileData.education || []) : (showAllEducation ? sortedEducation : sortedEducation.slice(0, 2))).map((edu, index) => (
                                    <ProfileListItem key={`edu-${index}`} isEditMode={isEditMode} color="purple" onDelete={handleDeleteEducation} index={index}>
                                        {isEditMode ? (
                                            <div className='space-y-2'>
                                                <input type="text" value={edu.degree || ''} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} placeholder="Degree / Field of Study" className={`${inputBaseClass} font-medium`} />
                                                <input type="text" value={edu.institution || ''} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} placeholder="Institution Name" className={`${inputBaseClass} text-sm`} />
                                                <input type="text" value={edu.year || ''} onChange={(e) => handleEducationChange(index, 'year', e.target.value)} placeholder="Year(s) (e.g., 2018 or 2018 - 2022)" className={`${inputBaseClass} text-xs`} />
                                            </div>
                                        ) : (
                                            <>
                                                <h4 className="font-semibold text-lg text-gray-800">{edu.degree}</h4>
                                                <p className="text-md text-gray-600 font-medium">{edu.institution}</p>
                                                <p className="text-sm text-gray-500">{edu.year}</p>
                                            </>
                                        )}
                                    </ProfileListItem>
                                ))}
                                {isEditMode && (
                                    <button onClick={handleAddEducation} type="button" className="mt-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-1.5 px-3 rounded-md text-sm inline-flex items-center transition duration-150">
                                        <i className="fas fa-plus mr-1.5 text-xs"></i> Add Education
                                    </button>
                                )}
                                {!isEditMode && sortedEducation.length === 0 && <span className="text-sm text-gray-400 italic pl-4">No education listed.</span>}
                                {!isEditMode && sortedEducation.length > 2 && (
                                    <button onClick={() => {
                                        const shouldShow = !showAllEducation;
                                        setShowAllEducation(shouldShow);
                                        if (!shouldShow) {
                                            setTimeout(() => scrollToRef(educationRef), 50);
                                        }
                                    }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 focus:outline-none ml-4">
                                        {showAllEducation ? "View Less" : "View More"} Education
                                        <i className={`fas ${showAllEducation ? 'fa-chevron-up' : 'fa-chevron-down'} ml-1 text-xs`}></i>
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Certifications Section */}
                         <section ref={certificationsRef} className="bg-gradient-to-br from-yellow-50 via-white to-gray-50 p-6 rounded-lg shadow-md scroll-mt-16">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                                <i className="fas fa-certificate mr-3 text-yellow-600"></i>Certifications
                            </h3>
                            <div className="space-y-5">
                                {(isEditMode ? (currentProfileData.certifications || []) : (showAllCertifications ? sortedCertifications : sortedCertifications.slice(0, 2))).map((cert, index) => (
                                    <ProfileListItem key={`cert-${index}`} isEditMode={isEditMode} color="yellow" onDelete={handleDeleteCertification} index={index}>
                                        {isEditMode ? (
                                            <div className='space-y-2'>
                                                <input type="text" value={cert.title || ''} onChange={(e) => handleCertificationChange(index, 'title', e.target.value)} placeholder="Certification Title" className={`${inputBaseClass} font-medium`} />
                                                <input type="text" value={cert.authority || ''} onChange={(e) => handleCertificationChange(index, 'authority', e.target.value)} placeholder="Issuing Authority" className={`${inputBaseClass} text-sm`} />
                                                <input type="text" value={cert.link || ''} onChange={(e) => handleCertificationChange(index, 'link', e.target.value)} placeholder="Credential URL (Optional)" className={`${inputBaseClass} text-xs`} />
                                            </div>
                                        ) : (
                                            <>
                                                {cert.link ? (
                                                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg text-blue-600 hover:underline group inline-flex items-center">
                                                        {cert.title}
                                                        <i className="fas fa-external-link-alt text-xs ml-2 opacity-50 group-hover:opacity-100 transition-opacity"></i>
                                                    </a>
                                                ) : (
                                                    <h4 className="font-semibold text-lg text-gray-800">{cert.title}</h4>
                                                )}
                                                <p className="text-md text-gray-600 font-medium">{cert.authority}</p>
                                            </>
                                        )}
                                    </ProfileListItem>
                                ))}
                                {isEditMode && (
                                    <button onClick={handleAddCertification} type="button" className="mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-1.5 px-3 rounded-md text-sm inline-flex items-center transition duration-150">
                                        <i className="fas fa-plus mr-1.5 text-xs"></i> Add Certification
                                    </button>
                                )}
                                {!isEditMode && sortedCertifications.length === 0 && <span className="text-sm text-gray-400 italic pl-4">No certifications listed.</span>}
                                {!isEditMode && sortedCertifications.length > 2 && (
                                    <button onClick={() => {
                                        const shouldShow = !showAllCertifications;
                                        setShowAllCertifications(shouldShow);
                                        if (!shouldShow) {
                                            setTimeout(() => scrollToRef(certificationsRef), 50);
                                        }
                                    }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 focus:outline-none ml-4">
                                        {showAllCertifications ? "View Less" : "View More"} Certifications
                                        <i className={`fas ${showAllCertifications ? 'fa-chevron-up' : 'fa-chevron-down'} ml-1 text-xs`}></i>
                                    </button>
                                )}
                            </div>
                        </section>

                    </div> {/* End Right Column */}

                </div> {/* End Profile Details Grid */}

            </div> {/* End Scrollable Container */}
        </div>
    );
}

export default MyProfile;