// Connection.jsx
import React, { useState } from 'react';

const colors = {
    primary: "#0a66c2", // LinkedIn Blue
    secondary: "#f0f2f5", // Light Grey Background
    textPrimary: "#000000", // Black Text
    textSecondary: "#666666", // Grey Text
    white: "#ffffff",
    accent: "#e7e9ea", // Light Grey Accent
    success: "#28a745",
    warning: "#ffc107",
    danger: "#dc3545",
};

const connectionsData = [
    {
        id: 1,
        name: "Jayesh Chavda",
        title: "Asp.Net and Microsoft Dynamics CRM Developer",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        isOpenToWork: false
    },
    {
        id: 2,
        name: "Mitul Koradiya",
        title: "Full-stack PHP developer | Freelancer | Laravel ...",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
        isOpenToWork: true
    },
    {
        id: 3,
        name: "Kunjesh Patel",
        title: "AI/ML Engineer | Freelancing - AI/ML ...",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
        isOpenToWork: true
    },
    {
        id: 4,
        name: "Mihir Ghelani",
        title: "React.js, Next.js, Vue.js, and React-native ...",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
        isOpenToWork: true
    },
    {
        id: 5,
        name: "Hitendrasinh Rathod",
        title: "Flutter Developer",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
        isOpenToWork: false
    },
    {
        id: 6,
        name: "Hrut Nayak",
        title: "Enthusiast Data Analyst || Power BI || SQL || ETL || ...",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/6.jpg",
        isOpenToWork: true
    },
    {
        id: 7,
        name: "Darshan Nimavat",
        title: "Graphic Designer & Video Editor",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/7.jpg",
        isOpenToWork: false
    },
    {
        id: 8,
        name: "Mohit Rane",
        title: "Immediate Joiner | Actively looking for ...",
        location: "Greater Ahmedabad Area",
        profileImage: "https://randomuser.me/api/portraits/men/8.jpg",
        isOpenToWork: true
    },
    {
        id: 9,
        name: "Priya Sharma",
        title: "Software Engineer at Google",
        location: "Bengaluru, Karnataka, India",
        profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
        isOpenToWork: false
    },
    {
        id: 10,
        name: "Anjali Patel",
        title: "Data Scientist | Machine Learning Enthusiast",
        location: "Mumbai, Maharashtra, India",
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
        isOpenToWork: true
    },
    {
        id: 11,
        name: "Vikram Singh",
        title: "Product Manager at Microsoft",
        location: "Hyderabad, Telangana, India",
        profileImage: "https://randomuser.me/api/portraits/men/9.jpg",
        isOpenToWork: false
    },
    {
        id: 12,
        name: "Sneha Gupta",
        title: "UX/UI Designer | Passionate about User Experience",
        location: "Delhi, India",
        profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
        isOpenToWork: false
    },
    {
        id: 13,
        name: "Rohan Verma",
        title: "Marketing Manager | Digital Marketing Strategist",
        location: "Chennai, Tamil Nadu, India",
        profileImage: "https://randomuser.me/api/portraits/men/10.jpg",
        isOpenToWork: true
    },
    {
        id: 14,
        name: "Deepika Menon",
        title: "Human Resources Manager | Talent Acquisition Specialist",
        location: "Kolkata, West Bengal, India",
        profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
        isOpenToWork: false
    },
    {
        id: 15,
        name: "Arjun Reddy",
        title: "Financial Analyst | Investment Banking Professional",
        location: "Pune, Maharashtra, India",
        profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
        isOpenToWork: false
    },
    {
        id: 16,
        name: "Kavita Joshi",
        title: "Business Analyst | Process Improvement Expert",
        location: "Jaipur, Rajasthan, India",
        profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
        isOpenToWork: true
    },
    {
        id: 17,
        name: "Suresh Kumar",
        title: "Operations Manager | Supply Chain Management",
        location: "Chandigarh, India",
        profileImage: "https://randomuser.me/api/portraits/men/12.jpg",
        isOpenToWork: false
    },
    {
        id: 18,
        name: "Meena Iyer",
        title: "Content Writer | Creative Storyteller",
        location: "Lucknow, Uttar Pradesh, India",
        profileImage: "https://randomuser.me/api/portraits/women/6.jpg",
        isOpenToWork: true
    },
    {
        id: 19,
        name: "Ganesh Patel",
        title: "Civil Engineer | Structural Design Specialist",
        location: "Surat, Gujarat, India",
        profileImage: "https://randomuser.me/api/portraits/men/13.jpg",
        isOpenToWork: false
    },
    {
        id: 20,
        name: "Lakshmi Nair",
        title: "Teacher | Educator | Passionate about Learning",
        location: "Thiruvananthapuram, Kerala, India",
        profileImage: "https://randomuser.me/api/portraits/women/7.jpg",
        isOpenToWork: true
    }
];


const eventsData = [
    {
        id: 1,
        title: "Safari Rally Championships Safari 2025 in Kenya",
        date: "Fri, Mar 20, 2025, 2:30 PM",
        location: "Kenya - Fans and Spectators Servi",
        attendees: 23,
        image: "https://placekitten.com/200/150",
    },
    {
        id: 2,
        title: "8 - Day NLP Practitioner & Beyond Training",
        date: "Thu, Mar 20, 2025, 3:00 PM",
        location: "Break Free and Thrive",
        attendees: 6,
        image: "https://placekitten.com/201/151",
    },
    {
        id: 3,
        title: "Emergency Response",
        date: "Fri, Mar 21, 2025, 12:00 AM",
        location: "Construction Employers Association",
        attendees: 7,
        image: "https://placekitten.com/202/152",
    },
    {
        id: 4,
        title: "Sales Club Conference 2025",
        date: "Fri, Mar 21, 2025, 11:30 AM",
        location: "SALES CLUB - WATER CREST HOTEL",
        attendees: 1522,
        image: "https://placekitten.com/203/153",
    },
    {
        id: 5,
        title: "World Cornea Congress IX",
        date: "Thu, Mar 20, 2025, 5:30 PM",
        location: "Cornea Society",
        attendees: 9,
        image: "https://placekitten.com/204/154",
    },
    {
        id: 6,
        title: "Health Hazards in Construction",
        date: "Thu, Mar 20, 2025, 10:00 PM",
        location: "Construction Employers Association",
        attendees: 3,
        image: "https://placekitten.com/205/155",
    },
    {
        id: 7,
        title: "Tech Startup Summit 2025",
        date: "Sat, Mar 22, 2025, 9:00 AM",
        location: "Innovation Hub, Tech City",
        attendees: 850,
        image: "https://placekitten.com/206/156",
    },
    {
        id: 8,
        title: "Digital Marketing Masterclass",
        date: "Sun, Mar 23, 2025, 2:00 PM",
        location: "Online Webinar",
        attendees: 210,
        image: "https://placekitten.com/207/157",
    },
    {
        id: 9,
        title: "Leadership Workshop",
        date: "Mon, Mar 24, 2025, 10:00 AM",
        location: "Conference Center, Business Park",
        attendees: 55,
        image: "https://placekitten.com/208/158",
    },
    {
        id: 10,
        title: "Cybersecurity Conference",
        date: "Tue, Mar 25, 2025, 9:30 AM",
        location: "Grand Hotel Ballroom",
        attendees: 420,
        image: "https://placekitten.com/209/159",
    },
    {
        id: 11,
        title: "AI and Machine Learning Summit",
        date: "Wed, Mar 26, 2025, 11:00 AM",
        location: "Tech University Auditorium",
        attendees: 680,
        image: "https://placekitten.com/210/160",
    },
    {
        id: 12,
        title: "Project Management Seminar",
        date: "Thu, Mar 27, 2025, 2:30 PM",
        location: "Business Training Institute",
        attendees: 120,
        image: "https://placekitten.com/211/161",
    },
    {
        id: 13,
        title: "Financial Planning Workshop",
        date: "Fri, Mar 28, 2025, 10:00 AM",
        location: "Community Center Hall",
        attendees: 75,
        image: "https://placekitten.com/212/162",
    },
    {
        id: 14,
        title: "Creative Writing Workshop",
        date: "Sat, Mar 29, 2025, 1:00 PM",
        location: "Local Library",
        attendees: 30,
        image: "https://placekitten.com/213/163",
    },
    {
        id: 15,
        title: "Photography Exhibition",
        date: "Sun, Mar 30, 2025, 3:00 PM",
        location: "Art Gallery, Downtown",
        attendees: 150,
        image: "https://placekitten.com/214/164",
    },
    {
        id: 16,
        title: "Music Concert",
        date: "Mon, Mar 31, 2025, 7:00 PM",
        location: "City Concert Hall",
        attendees: 900,
        image: "https://placekitten.com/215/165",
    },
    {
        id: 17,
        title: "Yoga and Wellness Retreat",
        date: "Tue, Apr 1, 2025, 8:00 AM",
        location: "Mountain Resort",
        attendees: 40,
        image: "https://placekitten.com/216/166",
    },
    {
        id: 18,
        title: "Cooking Class - Italian Cuisine",
        date: "Wed, Apr 2, 2025, 6:00 PM",
        location: "Culinary School Kitchen",
        attendees: 25,
        image: "https://placekitten.com/217/167",
    },
    {
        id: 19,
        title: "Gardening Workshop",
        date: "Thu, Apr 3, 2025, 10:30 AM",
        location: "Botanical Garden Greenhouse",
        attendees: 60,
        image: "https://placekitten.com/218/168",
    },
    {
        id: 20,
        title: "Book Club Meeting",
        date: "Fri, Apr 4, 2025, 7:30 PM",
        location: "Cafe Bookworm",
        attendees: 15,
        image: "https://placekitten.com/219/169",
    }
];


const ConnectionCard = ({ connection }) => {

    return (
        <div className="bg-white rounded-md shadow-sm p-4 mb-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div className="flex items-start">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-3">
                        <img src={connection.profileImage} alt={connection.name} className="object-cover w-full h-full" />
                        {connection.isOpenToWork && (
                            <div className="absolute bottom-0 left-0 bg-green-500 text-white text-xs font-semibold py-0.5 px-1 rounded-tr-full rounded-br-full">
                                #OpenToWork
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-textPrimary hover:underline cursor-pointer">{connection.name}</h3>
                        <p className="text-sm text-textSecondary">{connection.title}</p>
                        <p className="text-sm text-textSecondary">{connection.location}</p>
                    </div>
                </div>
                <button
                    className={`bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline text-sm`}
                    style={{ backgroundColor: colors.primary, color: colors.white }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#004182"}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.primary}
                >
                    Connect
                </button>
            </div>
        </div>
    );
};


const EventCard = ({ event }) => {
    return (
        <div className="bg-white rounded-md shadow-sm p-4 mb-4 hover:shadow-md transition-shadow duration-200 flex">
            <div className="w-24 h-24 rounded-md overflow-hidden mr-4">
                <img src={event.image} alt={event.title} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1">
                <h3 className="text-md font-semibold text-textPrimary hover:underline cursor-pointer">{event.title}</h3>
                <p className="text-sm text-textSecondary"><i className="far fa-calendar mr-1"></i> {event.date}</p>
                <p className="text-sm text-textSecondary"><i className="fas fa-map-marker-alt mr-1"></i> {event.location}</p>
                <p className="text-sm text-textSecondary"><i className="fas fa-users mr-1"></i> {event.attendees} attendees</p>
                <button
                    className={`bg-white hover:bg-accent text-primary font-semibold py-2 px-4 rounded-full border border-primary focus:outline-none focus:shadow-outline text-sm mt-2`}
                    style={{ color: colors.primary, borderColor: colors.primary }}
                    onMouseOver={(e) => e.target.style.backgroundColor = colors.accent}
                    onMouseOut={(e) => e.target.style.backgroundColor = colors.white}
                >
                    View
                </button>
            </div>
        </div>
    );
};


const Connection = () => {

    const [viewAllConn, setViewAllConn] = useState(false);

    return (
        <div className="bg-secondary max-h-[calc(100vh-64px)] flex" style={{ backgroundColor: colors.secondary }}>
            {/* Left Sidebar */}
            <div className="hidden md:block w-64 p-4 sticky max-h-[calc(100vh-64px)] top-16 h-screen overflow-y-auto">
                <div className="bg-white rounded-md shadow-sm p-4">
                    <h2 className="text-lg font-semibold mb-3 text-textPrimary">Manage my network</h2>
                    <div className="flex items-center mb-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                        <i className="fas fa-user-friends mr-3 text-lg text-textSecondary"></i>
                        <span className="text-textPrimary">Connections</span>
                    </div>
                    <div className="flex items-center mb-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                        <i className="fas fa-user-plus mr-3 text-lg text-textSecondary"></i>
                        <span className="text-textPrimary">Following & followers</span>
                    </div>
                    <div className="flex items-center mb-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                        <i className="fas fa-users mr-3 text-lg text-textSecondary"></i>
                        <span className="text-textPrimary">Groups</span>
                    </div>
                    <div className="flex items-center mb-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                        <i className="far fa-calendar-alt mr-3 text-lg text-textSecondary"></i>
                        <span className="text-textPrimary">Events</span>
                    </div>
                    <div className="flex items-center mb-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                        <i className="far fa-flag mr-3 text-lg text-textSecondary"></i>
                        <span className="text-textPrimary">Pages</span> <span className="ml-1 text-xs bg-gray-300 text-gray-700 rounded-full px-2 py-0.5">2</span>
                    </div>
                    <div className="flex items-center mb-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                        <i className="far fa-newspaper mr-3 text-lg text-textSecondary"></i>
                        <span className="text-textPrimary">Newsletters</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 max-h-[calc(100vh-64px)] overflow-y-auto">
                {/* Grow Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-md shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-textPrimary">Grow</h2>
                        </div>
                        <div className="p-3 border border-accent rounded-md">
                            <h3 className="font-semibold text-md text-textPrimary mb-2">Grow your career faster</h3>
                            <p className="text-sm text-textSecondary mb-3">Stand out for a role with personalized cover letters and resume tips.</p>
                            <div className="flex items-center mb-3">
                                <i className="fas fa-user-tie text-textSecondary mr-2"></i>
                                <span className="text-sm text-textSecondary">Millions of members use Premium</span>
                            </div>
                            <button
                                className={`bg-warning hover:bg-warning-dark text-textPrimary font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline text-sm`}
                                style={{ backgroundColor: colors.warning, color: colors.textPrimary }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#ffb300"}
                                onMouseOut={(e) => e.target.style.backgroundColor = colors.warning}
                            >
                                Try Premium for ₹0
                            </button>
                            <p className="text-xs text-textSecondary mt-1">1-month free trial. Cancel anytime.</p>
                        </div>
                    </div>
                </div>

                {/* Catch up Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-md shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-textPrimary">Catch up</h2>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-md text-textPrimary">Stay in touch through daily games</h3>
                            <button className="text-primary text-sm hover:underline" style={{ color: colors.primary }}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            <div className="bg-accent rounded-md p-2 w-32 flex flex-col items-center">
                                <div className="bg-white p-2 rounded-md"><i className="fas fa-puzzle-piece text-xl text-warning" style={{ color: colors.warning }}></i></div>
                                <span className="text-sm text-textPrimary mt-2 font-semibold">Zip #3</span>
                                <span className="text-xs text-textSecondary">Thursday, Mar 20</span>
                                <button
                                    className={`bg-white hover:bg-gray-100 text-primary font-semibold py-1 px-3 rounded-full border border-primary focus:outline-none focus:shadow-outline text-xs mt-2`}
                                    style={{ color: colors.primary, borderColor: colors.primary }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = colors.accent}
                                    onMouseOut={(e) => e.target.style.backgroundColor = colors.white}
                                >
                                    Solve
                                </button>
                            </div>
                            <div className="bg-accent rounded-md p-2 w-32 flex flex-col items-center">
                                <div className="bg-white p-2 rounded-md"><i className="fas fa-chess-queen text-xl text-danger" style={{ color: colors.danger }}></i></div>
                                <span className="text-sm text-textPrimary mt-2 font-semibold">Queens #324</span>
                                <span className="text-xs text-textSecondary">Thursday, Mar 20</span>
                                <button
                                    className={`bg-white hover:bg-gray-100 text-primary font-semibold py-1 px-3 rounded-full border border-primary focus:outline-none focus:shadow-outline text-xs mt-2`}
                                    style={{ color: colors.primary, borderColor: colors.primary }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = colors.accent}
                                    onMouseOut={(e) => e.target.style.backgroundColor = colors.white}
                                >
                                    Solve
                                </button>
                            </div>
                            <div className="bg-accent rounded-md p-2 w-32 flex flex-col items-center">
                                <div className="bg-white p-2 rounded-md"><i className="fas fa-dice-d6 text-xl text-success" style={{ color: colors.success }}></i></div>
                                <span className="text-sm text-textPrimary mt-2 font-semibold">Tango #164</span>
                                <span className="text-xs text-textSecondary">Thursday, Mar 20</span>
                                <button
                                    className={`bg-white hover:bg-gray-100 text-primary font-semibold py-1 px-3 rounded-full border border-primary focus:outline-none focus:shadow-outline text-xs mt-2`}
                                    style={{ color: colors.primary, borderColor: colors.primary }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = colors.accent}
                                    onMouseOut={(e) => e.target.style.backgroundColor = colors.white}
                                >
                                    Solve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* People you may know Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-md shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-textPrimary">People You may know</h2>
                            <button className="text-primary text-sm hover:underline" style={{ color: colors.primary }}>Show all</button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {connectionsData.map(connection => (
                                <ConnectionCard key={connection.id} connection={connection} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Events Section */}
                <div className="mb-6">
                    <div className="bg-white rounded-md shadow-sm p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-textPrimary">Events</h2>
                            <button className="text-primary text-sm hover:underline" style={{ color: colors.primary }}>Create an event</button>
                        </div>
                        <h3 className="font-semibold text-md text-textPrimary mb-3">Recommended for you</h3>
                        <div>
                            {eventsData.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Connection;