import React, { useState, useEffect } from 'react';

function MyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get username from localStorage
                const username = localStorage.getItem('loggedInUsername'); // <--- Get username from localStorage

                if (!username) {
                    setError(new Error("Username not found in localStorage."));
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/profile/${username}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProfile(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error fetching profile:", e);
            }
        };

        fetchProfileData();
    }, []);

    const [showAllExperience, setShowAllExperience] = useState(false);
    const [showAllEducation, setShowAllEducation] = useState(false);
    const [showAllCertifications, setShowAllCertifications] = useState(false);

    if (loading) {
        return <div className="text-center">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading profile: {error.message}</div>;
    }

    if (!profile) {
        return <div className="text-center">Profile not found.</div>;
    }

    // Sorting functions remain the same ...

    return (
        <div className="bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 max-h-[calc(100vh-80px)] overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
                {/* ... rest of your MyProfile.jsx component - rendering profile data ... */}
                 {/* Profile Header */}
                 <div className="flex items-center space-x-4 mb-4">
                    <img
                        src={profile.image}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-2 border-gray-300"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700">{profile.name}</h2>
                        <p className="text-gray-500">{profile.title}</p>
                        <div className="flex space-x-3 mt-2">
                            <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-github text-gray-500 text-2xl hover:text-gray-800" />
                            </a>
                            <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-briefcase text-gray-500 text-2xl hover:text-gray-800" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                    <p className="text-gray-600">{profile.about}</p>
                </div>

                {/* Skills Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map(skill => (
                            <span key={skill} className="bg-green-200 px-3 py-1 rounded-full text-sm">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* Experience Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Experience</h3>
                    {(showAllExperience ? sortedExperience : sortedExperience.slice(0, 2)).map((exp, index) => (
                        <div key={index} className="bg-green-50 p-4 rounded-lg shadow mb-2">
                            <h4 className="font-medium text-gray-700">{exp.position} - {exp.company}</h4>
                            <p className="text-sm text-gray-500">{exp.duration}</p>
                            <p className="text-gray-600 mt-2">{exp.description}</p>
                        </div>
                    ))}
                    {profile.experience.length > 2 && (
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
                            <h4 className="font-medium text-gray-700">{edu.degree}</h4>
                            <p className="text-sm text-gray-500">{edu.institution}, {edu.year}</p>
                        </div>
                    ))}
                    {profile.education.length > 2 && (
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
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-700 hover:underline">{cert.title}</a>
                            <p className="text-sm text-gray-600">{cert.authority}</p>
                        </div>
                    ))}
                    {profile.certifications.length > 2 && (
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