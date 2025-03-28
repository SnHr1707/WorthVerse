// --- START OF FILE MyProfile.jsx ---
// MyProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate

function MyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [sortedExperience, setSortedExperience] = useState([]);
    const [sortedEducation, setSortedEducation] = useState([]);
    const [profileDataForEdit, setProfileDataForEdit] = useState(null); // State for editable profile data
    const { username: profileUsernameFromURL } = useParams(); // Get username from URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {

                let usernameToFetchProfile;

                if (profileUsernameFromURL) {
                    // If username is in URL, fetch that profile (public view)
                    usernameToFetchProfile = profileUsernameFromURL;
                } else {
                    // Otherwise, fetch logged in user's profile
                    const usernameResponse = await fetch(`http://localhost:5000/user/get-username`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            credentials: 'include',
                        },
                    });

                    if (!usernameResponse.ok) {
                        if (usernameResponse.status === 401) {
                            // Redirect to login if not authenticated and trying to access /profile without username
                            if (!profileUsernameFromURL) {
                                // navigate('/login');
                                return; // Stop further execution
                            }
                        }
                        throw new Error(`Failed to get username: ${usernameResponse.status}`);
                    }

                    const usernameData = await usernameResponse.json();
                    usernameToFetchProfile = usernameData.username;
                    setLoggedInUsername(usernameData.username); //setting LoggedInUsername for edit mode check
                }


                const profileResponse = await fetch(`http://localhost:5000/api/profile/${usernameToFetchProfile}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        credentials: 'include',
                    },
                });

                if (!profileResponse.ok) {
                    throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
                }
                const profileData = await profileResponse.json();


                // Sort experience and education (same as before)
                const sortedExp = [...profileData.profile.experience].sort((a, b) => {
                    const getEndDate = (duration) => {
                        const parts = duration.split(' - ');
                        const endDate = parts[1] || parts[0];
                        return endDate === 'Present' ? new Date().getFullYear() : parseInt(endDate, 10);
                    };
                    const endDateA = getEndDate(a.duration);
                    const endDateB = getEndDate(b.duration);
                    return endDateB - endDateA;
                });
                setSortedExperience(sortedExp);

                const sortedEdu = [...profileData.profile.education].sort((a, b) => {
                    return parseInt(b.year, 10) - parseInt(a.year, 10);
                });
                setSortedEducation(sortedEdu);

                setProfile(profileData.profile);
                setProfileDataForEdit(profileData.profile); // Initialize editable data
                setLoading(false);


            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error fetching profile:", e);
            }
        };

        fetchProfileData();
    }, [profileUsernameFromURL, navigate]); // Added profileUsernameFromURL and navigate to dependency array


    const [showAllExperience, setShowAllExperience] = useState(false);
    const [showAllEducation, setShowAllEducation] = useState(false);
    const [showAllCertifications, setShowAllCertifications] = useState(false);

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setProfileDataForEdit(profile); // Revert changes
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const username = profileDataForEdit.username; // Use username from editable data
            const response = await fetch(`http://localhost:5000/api/profile/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(profileDataForEdit), // Send the editable profile data
            });

            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.status}`);
            }

            const updatedProfileData = await response.json();
            setProfile(updatedProfileData.profile); // Update displayed profile
            setProfileDataForEdit(updatedProfileData.profile); // Update editable data as well to be consistent
            setIsEditMode(false);
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
            console.error("Error updating profile:", e);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileDataForEdit(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLinksChange = (e) => {
        const { name, value } = e.target;
        setProfileDataForEdit(prevData => ({
            ...prevData,
            links: {
                ...prevData.links,
                [name]: value,
            },
        }));
    };

    const handleSkillChange = (index, value) => {
        const updatedSkills = [...profileDataForEdit.skills];
        updatedSkills[index] = value;
        setProfileDataForEdit(prevData => ({ ...prevData, skills: updatedSkills }));
    };

    const handleAddSkill = () => {
        setProfileDataForEdit(prevData => ({ ...prevData, skills: [...prevData.skills, ""] }));
    };

    const handleDeleteSkill = (index) => {
        const updatedSkills = profileDataForEdit.skills.filter((_, i) => i !== index);
        setProfileDataForEdit(prevData => ({ ...prevData, skills: updatedSkills }));
    };

    const handleExperienceChange = (index, field, value) => {
        const updatedExperience = [...profileDataForEdit.experience];
        updatedExperience[index][field] = value;
        setProfileDataForEdit(prevData => ({ ...prevData, experience: updatedExperience }));
    };

    const handleAddExperience = () => {
        setProfileDataForEdit(prevData => ({
            ...prevData,
            experience: [...prevData.experience, { position: "", company: "", duration: "", description: "" }]
        }));
    };

    const handleDeleteExperience = (index) => {
        const updatedExperience = profileDataForEdit.experience.filter((_, i) => i !== index);
        setProfileDataForEdit(prevData => ({ ...prevData, experience: updatedExperience }));
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...profileDataForEdit.education];
        updatedEducation[index][field] = value;
        setProfileDataForEdit(prevData => ({ ...prevData, education: updatedEducation }));
    };

    const handleAddEducation = () => {
        setProfileDataForEdit(prevData => ({
            ...prevData,
            education: [...prevData.education, { degree: "", institution: "", year: "" }]
        }));
    };

    const handleDeleteEducation = (index) => {
        const updatedEducation = profileDataForEdit.education.filter((_, i) => i !== index);
        setProfileDataForEdit(prevData => ({ ...prevData, education: updatedEducation }));
    };

    const handleCertificationChange = (index, field, value) => {
        const updatedCertifications = [...profileDataForEdit.certifications];
        updatedCertifications[index][field] = value;
        setProfileDataForEdit(prevData => ({ ...prevData, certifications: updatedCertifications }));
    };

    const handleAddCertification = () => {
        setProfileDataForEdit(prevData => ({
            ...prevData,
            certifications: [...prevData.certifications, { title: "", authority: "", link: "" }]
        }));
    };

    const handleDeleteCertification = (index) => {
        const updatedCertifications = profileDataForEdit.certifications.filter((_, i) => i !== index);
        setProfileDataForEdit(prevData => ({ ...prevData, certifications: updatedCertifications }));
    };


    if (loading) {
        return <div className="text-center">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading profile: {error.message}</div>;
    }

    if (!profile) {
        return <div className="text-center">Profile not found.</div>;
    }


    return (
        <div className="bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 max-h-[calc(100vh-80px)] overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {isEditMode ? "Edit My Profile" : profileUsernameFromURL ? `${profile.username}'s Profile` : "My Profile"}
                </h1>

                {loggedInUsername === profile.username && !isEditMode && (
                    <button onClick={handleEditClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
                        Edit Profile
                    </button>
                )}

                {isEditMode && (
                    <div className="mb-4">
                        <button onClick={handleSaveProfile} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Save</button>
                        <button onClick={handleCancelEdit} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                    </div>
                )}


                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-4">
                    {isEditMode ? (
                        <input
                            type="text"
                            name="image"
                            value={profileDataForEdit.image || ''}
                            onChange={handleInputChange}
                            placeholder="Image URL"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    ) : (
                        <img
                            src={profile.image}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-2 border-gray-300"
                        />
                    )}
                    <div>
                        {isEditMode ? (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileDataForEdit.name || ''}
                                    onChange={handleInputChange}
                                    placeholder="Your Name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                />
                                <input
                                    type="text"
                                    name="title"
                                    value={profileDataForEdit.title || ''}
                                    onChange={handleInputChange}
                                    placeholder="Your Title"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-700">{profile.name}</h2>
                                <p className="text-gray-500">{profile.title}</p>
                            </>
                        )}
                        <div className="flex space-x-3 mt-2">
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="github"
                                        value={profileDataForEdit.links?.github || ''}
                                        onChange={handleLinksChange}
                                        placeholder="GitHub URL"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                    />
                                    <input
                                        type="text"
                                        name="portfolio"
                                        value={profileDataForEdit.links?.portfolio || ''}
                                        onChange={handleLinksChange}
                                        placeholder="Portfolio URL"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </>
                            ) : (
                                <>
                                    <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                                        <i className="fa-brands fa-github text-gray-500 text-2xl hover:text-gray-800" />
                                    </a>
                                    <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer">
                                        <i className="fa-solid fa-briefcase text-gray-500 text-2xl hover:text-gray-800" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                    {isEditMode ? (
                        <textarea
                            name="about"
                            value={profileDataForEdit.about || ''}
                            onChange={handleInputChange}
                            placeholder="About you"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    ) : (
                        <p className="text-gray-600">{profile.about}</p>
                    )}
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {isEditMode ? (
                            <>
                                {profileDataForEdit.skills.map((skill, index) => (
                                    <div key={index} className="flex items-center space-x-2 bg-green-200 px-3 py-1 rounded-full text-sm">
                                        <input
                                            type="text"
                                            value={skill}
                                            onChange={(e) => handleSkillChange(index, e.target.value)}
                                            className="shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                        />
                                        <button onClick={() => handleDeleteSkill(index)} type="button" className="text-red-500 hover:text-red-700">
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                                <button onClick={handleAddSkill} type="button" className="bg-green-300 hover:bg-green-400 text-green-800 font-bold py-1 px-2 rounded-full text-sm">
                                    <i className="fa-solid fa-plus"></i> Add Skill
                                </button>
                            </>
                        ) : (
                            profile.skills.map(skill => (
                                <span key={skill} className="bg-green-200 px-3 py-1 rounded-full text-sm">{skill}</span>
                            ))
                        )}
                    </div>
                </div>

                {/* Experience Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Experience</h3>
                    {(showAllExperience ? sortedExperience : sortedExperience.slice(0, 2)).map((exp, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg shadow mb-2">
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        value={profileDataForEdit.experience[index]?.position || ''}
                                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                        placeholder="Position"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={profileDataForEdit.experience[index]?.company || ''}
                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                        placeholder="Company"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={profileDataForEdit.experience[index]?.duration || ''}
                                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                        placeholder="Duration"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <textarea
                                        value={profileDataForEdit.experience[index]?.description || ''}
                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        placeholder="Description"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <button onClick={() => handleDeleteExperience(index)} type="button" className="text-red-500 hover:text-red-700">
                                        <i className="fa-solid fa-trash-alt"></i> Delete Experience
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4 className="font-medium text-gray-700">{exp.position} - {exp.company}</h4>
                                    <p className="text-sm text-gray-500">{exp.duration}</p>
                                    <p className="text-gray-600 mt-2">{exp.description}</p>
                                </>
                            )}
                        </div>
                    ))}
                    {isEditMode && (
                        <button onClick={handleAddExperience} type="button" className="bg-green-300 hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded mt-2">
                            <i className="fa-solid fa-plus"></i> Add Experience
                        </button>
                    )}
                    {profile.experience.length > 2 && !isEditMode && (
                        <button onClick={() => setShowAllExperience(!showAllExperience)} className="text-green-600 hover:underline mt-2">
                            {showAllExperience ? "View Less" : "View More"}
                        </button>
                    )}
                </div>

                {/* Education Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
                    {(showAllEducation ? sortedEducation : sortedEducation.slice(0, 2)).map((edu, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg shadow mb-2">
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        value={profileDataForEdit.education[index]?.degree || ''}
                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                        placeholder="Degree"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={profileDataForEdit.education[index]?.institution || ''}
                                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                        placeholder="Institution"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={profileDataForEdit.education[index]?.year || ''}
                                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                        placeholder="Year"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <button onClick={() => handleDeleteEducation(index)} type="button" className="text-red-500 hover:text-red-700">
                                        <i className="fa-solid fa-trash-alt"></i> Delete Education
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4 className="font-medium text-gray-700">{edu.degree}</h4>
                                    <p className="text-sm text-gray-500">{edu.institution}, {edu.year}</p>
                                </>
                            )}
                        </div>
                    ))}
                    {isEditMode && (
                        <button onClick={handleAddEducation} type="button" className="bg-green-300 hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded mt-2">
                            <i className="fa-solid fa-plus"></i> Add Education
                        </button>
                    )}
                    {profile.education.length > 2 && !isEditMode && (
                        <button onClick={() => setShowAllEducation(!showAllEducation)} className="text-green-600 hover:underline mt-2">
                            {showAllEducation ? "View Less" : "View More"}
                        </button>
                    )}
                </div>

                {/* Certifications Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Certifications</h3>
                    {(showAllCertifications ? profile.certifications : profile.certifications.slice(0, 2)).map((cert, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg shadow mb-2">
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        value={profileDataForEdit.certifications[index]?.title || ''}
                                        onChange={(e) => handleCertificationChange(index, 'title', e.target.value)}
                                        placeholder="Certification Title"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={profileDataForEdit.certifications[index]?.authority || ''}
                                        onChange={(e) => handleCertificationChange(index, 'authority', e.target.value)}
                                        placeholder="Authority"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <input
                                        type="text"
                                        value={profileDataForEdit.certifications[index]?.link || ''}
                                        onChange={(e) => handleCertificationChange(index, 'link', e.target.value)}
                                        placeholder="Link"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    />
                                    <button onClick={() => handleDeleteCertification(index)} type="button" className="text-red-500 hover:text-red-700">
                                        <i className="fa-solid fa-trash-alt"></i> Delete Certification
                                    </button>
                                </>
                            ) : (
                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-700 hover:underline">{cert.title}</a>
                            )}
                            {!isEditMode && <p className="text-sm text-gray-600">{cert.authority}</p>}
                        </div>
                    ))}
                    {isEditMode && (
                        <button onClick={handleAddCertification} type="button" className="bg-green-300 hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded mt-2">
                            <i className="fa-solid fa-plus"></i> Add Certification
                        </button>
                    )}
                    {profile.certifications.length > 2 && !isEditMode && (
                        <button onClick={() => setShowAllCertifications(!showAllCertifications)} className="text-green-600 hover:underline mt-2 text-center">
                            {showAllCertifications ? "View Less" : "View More"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;