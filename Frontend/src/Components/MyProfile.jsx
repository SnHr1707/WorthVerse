import React, { useEffect, useState } from 'react';

function MyProfile() {
    // const [profile, setProfile] = useState(null);

    // useEffect(() => {
    //     setProfile(profileData);
    // }, []);

    const profile = {
        "name": "John Doe",
        "title": "Software Engineer | Web Developer",
        "image": "https://via.placeholder.com/100",
        "about": "Passionate software engineer with experience in web development, AI, and cloud computing.",
        "skills": ["React", "Node.js", "JavaScript", "Python", "Tailwind CSS", "MongoDB"],
        "experience": [
          {
            "position": "Software Engineer",
            "company": "XYZ Tech",
            "duration": "Jan 2023 - Present",
            "description": "Working on web applications and improving user experience with cutting-edge technologies."
          }
        ],
        "education": [
          {
            "degree": "Bachelor of Computer Science",
            "institution": "ABC University",
            "year": "2019 - 2023"
          }
        ]
      }
    
    if (!profile) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
                
                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-6">
                    <img 
                        src={profile.image} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-2 border-gray-300"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700">{profile.name}</h2>
                        <p className="text-gray-500">{profile.title}</p>
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
                            <span key={skill} className="bg-blue-100  px-3 py-1 rounded-full text-sm">{skill}</span>
                        ))}
                    </div>
                </div>

                {/* Experience Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Experience</h3>
                    {profile.experience.map((exp, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg shadow mb-2">
                            <h4 className="font-medium text-gray-700">{exp.position} - {exp.company}</h4>
                            <p className="text-sm text-gray-500">{exp.duration}</p>
                            <p className="text-gray-600 mt-2">{exp.description}</p>
                        </div>
                    ))}
                </div>

                {/* Education Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Education</h3>
                    {profile.education.map((edu, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg shadow mb-2">
                            <h4 className="font-medium text-gray-700">{edu.degree}</h4>
                            <p className="text-sm text-gray-500">{edu.institution}, {edu.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;


