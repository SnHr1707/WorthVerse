import React, { useState } from 'react';

function MyProfile() {
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
            },
            {
                "position": "Intern",
                "company": "Tech Startup",
                "duration": "Jan 2021 - Apr 2021",
                "description": "Worked on AI-based web applications and optimized front-end performance."
            },
            {
                "position": "Frontend Developer",
                "company": "ABC Solutions",
                "duration": "May 2021 - Dec 2022",
                "description": "Developed user-friendly UI components using React and Tailwind CSS."
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Computer Science",
                "institution": "ABC University",
                "year": "2019 - 2023"
            },
            {
                "degree": "High School Diploma",
                "institution": "XYZ High School",
                "year": "2017 - 2019"
            }
        ],
        "links": {
            "github": "https://github.com/johndoe",
            "portfolio": "https://johndoe.dev"
        },
        "certifications": [
            {
                "title": "React Developer Certification",
                "authority": "Meta",
                "link": "https://example.com/react-cert"
            },
            {
                "title": "AWS Certified Solutions Architect",
                "authority": "Amazon Web Services",
                "link": "https://example.com/aws-cert"
            },
            {
                "title": "Google Cloud Associate",
                "authority": "Google",
                "link": "https://example.com/gcp-cert"
            }
        ]
    };

    const [showAllExperience, setShowAllExperience] = useState(false);
    const [showAllEducation, setShowAllEducation] = useState(false);
    const [showAllCertifications, setShowAllCertifications] = useState(false);

    // Sorting experience in descending order (latest first)
    const sortedExperience = [...profile.experience].sort((a, b) => 
        new Date(b.duration.split(" - ")[1] || new Date()) - new Date(a.duration.split(" - ")[1] || new Date())
    );

    // Sorting education in descending order (latest first)
    const sortedEducation = [...profile.education].sort((a, b) => 
        parseInt(b.year.split(" - ")[1]) - parseInt(a.year.split(" - ")[1])
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>

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
