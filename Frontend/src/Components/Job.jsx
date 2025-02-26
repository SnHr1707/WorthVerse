import React, { useState, useEffect, useRef } from "react";

// Sample JSON data
const jobListings = [
  {
    id: 1,
    title: "Account Executive, Mid-Market Sales, Google Customer Solutions",
    company: "Google",
    locations: ["Mumbai, Maharashtra, India", "Bengaluru, Karnataka, India"],
    level: "Mid",
    qualifications: [
      "Bachelor's degree or equivalent practical experience.",
      "5 years of experience in sales, advertising, or marketing.",
    ],
    skills: ["Sales", "Marketing", "Customer Relationship Management", "Communication", "Negotiation"],
    duration: "Full-time",
    lastDate: "2024-03-15",
    roles: ["Sales", "Account Management", "Business Development"],
    vision: "To organize the world's information and make it universally accessible and useful.",
  },
  {
    id: 2,
    title: "Software Engineer, Backend",
    company: "Microsoft",
    locations: ["Hyderabad, Telangana, India"],
    level: "Senior",
    qualifications: [
      "Bachelor's or Master's in Computer Science.",
      "3+ years of experience in backend development with Node.js.",
    ],
    skills: ["Node.js", "JavaScript", "Backend Development", "API Design", "Databases"],
    duration: "Full-time",
    lastDate: "2024-03-22",
    roles: ["Backend Development", "Software Engineering", "API Development"],
    vision: "To empower every person and every organization on the planet to achieve more.",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Netflix",
    locations: ["Los Angeles, California, USA"],
    level: "Mid",
    qualifications: [
      "3+ years of experience in frontend development.",
      "Strong knowledge of React or Vue.js.",
    ],
    skills: ["React", "JavaScript", "HTML", "CSS", "Frontend Development"],
    duration: "Full-time",
    lastDate: "2024-03-29",
    roles: ["Frontend Development", "UI Development", "Web Development"],
    vision: "To entertain the world.",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Amazon",
    locations: ["Seattle, Washington, USA"],
    level: "Early",
    qualifications: [
      "Bachelor's degree in a quantitative field.",
      "Experience with SQL and data visualization tools.",
    ],
    skills: ["SQL", "Data Visualization", "Data Analysis", "Excel", "Statistical Analysis"],
    duration: "Full-time",
    lastDate: "2024-04-05",
    roles: ["Data Analysis", "Reporting", "Business Intelligence"],
    vision: "To be Earth’s most customer-centric company, Earth’s best employer, and Earth’s safest place to work.",
  },
  {
    id: 5,
    title: "Product Designer",
    company: "Facebook",
    locations: ["Menlo Park, California, USA"],
    level: "Mid",
    qualifications: [
      "3+ years of experience in product design.",
      "Portfolio showcasing design process and solutions.",
    ],
    skills: ["UI/UX Design", "Product Design", "Figma", "Adobe XD", "User Research"],
    duration: "Full-time",
    lastDate: "2024-04-12",
    roles: ["Product Design", "UX Design", "UI Design"],
    vision: "To give people the power to build community and bring the world closer together.",
  },
  {
    id: 6,
    title: "Intern - Software Engineering",
    company: "Apple",
    locations: ["Cupertino, California, USA"],
    level: "Intern",
    qualifications: [
      "Currently enrolled in a Bachelor's or Master's degree in Computer Science.",
      "Basic programming knowledge.",
    ],
    skills: ["Programming", "Software Development", "Problem Solving", "Algorithms", "Data Structures"],
    duration: "Internship",
    lastDate: "2024-04-19",
    roles: ["Software Engineering Intern", "Development Intern"],
    vision: "To bring the best user experience to its customers through its innovative hardware, software, and services.",
  },
  {
    id: 7,
    title: "Director of Marketing",
    company: "Tesla",
    locations: ["Austin, Texas, USA"],
    level: "Director+",
    qualifications: [
      "10+ years of marketing experience.",
      "Proven leadership and strategic thinking.",
    ],
    skills: ["Marketing Strategy", "Leadership", "Digital Marketing", "Brand Management", "Team Management"],
    duration: "Full-time",
    lastDate: "2024-04-26",
    roles: ["Marketing Director", "Marketing Leadership", "Strategic Marketing"],
    vision: "To accelerate the world’s transition to sustainable energy.",
  },
  {
    id: 8,
    title: "Senior Data Scientist",
    company: "Google",
    locations: ["Mountain View, California, USA"],
    level: "Senior",
    qualifications: [
      "Master's or PhD in Data Science or related field.",
      "5+ years of experience in machine learning and statistical modeling.",
    ],
    skills: ["Machine Learning", "Data Science", "Statistical Modeling", "Python", "R"],
    duration: "Full-time",
    lastDate: "2024-05-03",
    roles: ["Data Science", "Machine Learning Engineering", "AI Research"],
    vision: "To organize the world's information and make it universally accessible and useful.",
  },
  {
    id: 9,
    title: "Early Career - Business Development Representative",
    company: "Salesforce",
    locations: ["San Francisco, California, USA"],
    level: "Early",
    qualifications: [
      "Bachelor's degree in Business or related field.",
      "Excellent communication and interpersonal skills.",
    ],
    skills: ["Business Development", "Sales", "Communication", "Interpersonal Skills", "CRM"],
    duration: "Full-time",
    lastDate: "2024-05-10",
    roles: ["Business Development", "Sales Representative", "Client Acquisition"],
    vision: "To improve the state of the world.",
  },
  {
    id: 10,
    title: "Mid-Level UX Researcher",
    company: "Airbnb",
    locations: ["San Francisco, California, USA"],
    level: "Mid",
    qualifications: [
      "Master's degree in Human-Computer Interaction or related field.",
      "3+ years of experience in UX research.",
    ],
    skills: ["UX Research", "User Testing", "Usability Testing", "Research Analysis", "User Interviews"],
    duration: "Full-time",
    lastDate: "2024-05-17",
    roles: ["UX Research", "User Experience", "Market Research"],
    vision: "Create a world where anyone can belong anywhere.",
  },
  {
    id: 11,
    title: "Senior DevOps Engineer",
    company: "Microsoft",
    locations: ["Redmond, Washington, USA"],
    level: "Senior",
    qualifications: [
      "5+ years of experience in DevOps engineering.",
      "Strong experience with AWS or Azure.",
    ],
    skills: ["DevOps", "AWS", "Azure", "Cloud Computing", "Automation"],
    duration: "Full-time",
    lastDate: "2024-05-24",
    roles: ["DevOps Engineering", "Cloud Infrastructure", "System Administration"],
    vision: "To empower every person and every organization on the planet to achieve more.",
  },
  {
    id: 12,
    title: "Director of Engineering",
    company: "Amazon",
    locations: ["New York, New York, USA"],
    level: "Director+",
    qualifications: [
      "10+ years of experience in software engineering.",
      "Proven track record of leading and scaling engineering teams.",
    ],
    skills: ["Engineering Leadership", "Team Management", "Software Engineering", "Project Management", "Agile"],
    duration: "Full-time",
    lastDate: "2024-05-31",
    roles: ["Engineering Director", "Technology Leadership", "Software Management"],
    vision: "To be Earth’s most customer-centric company, Earth’s best employer, and Earth’s safest place to work.",
  },
  {
    id: 13,
    title: "Software Engineer - Intern",
    company: "Google",
    locations: ["London, England"],
    level: "Intern",
    qualifications: [
      "Currently pursuing a degree in Computer Science or related field",
      "Passion for technology and software development",
    ],
    skills: ["Software Development", "Programming", "Algorithms", "Data Structures", "Problem Solving"],
    duration: "Internship",
    lastDate: "2024-06-07",
    roles: ["Software Engineering Intern", "Development Intern"],
    vision: "To organize the world's information and make it universally accessible and useful.",
  },
  {
    id: 14,
    title: "Junior Data Scientist",
    company: "Microsoft",
    locations: ["Dublin, Ireland"],
    level: "Early",
    qualifications: [
      "Bachelor's degree in Data Science, Statistics, or related field",
      "Familiarity with Python or R",
    ],
    skills: ["Data Science", "Python", "R", "Statistical Analysis", "Data Mining"],
    duration: "Full-time",
    lastDate: "2024-06-14",
    roles: ["Data Scientist", "Data Analysis", "Statistical Modeling"],
    vision: "To empower every person and every organization on the planet to achieve more.",
  },
  {
    id: 15,
    title: "Mid-Level Frontend Engineer",
    company: "Netflix",
    locations: ["Amsterdam, Netherlands"],
    level: "Mid",
    qualifications: [
      "3+ years of experience in frontend development",
      "Proficiency in JavaScript, HTML, and CSS",
    ],
    skills: ["Frontend Development", "JavaScript", "HTML", "CSS", "React"],
    duration: "Full-time",
    lastDate: "2024-06-21",
    roles: ["Frontend Engineer", "Web Development", "UI Development"],
    vision: "To entertain the world.",
  },
  {
    id: 16,
    title: "Senior Backend Engineer",
    company: "Facebook",
    locations: ["Paris, France"],
    level: "Senior",
    qualifications: [
      "5+ years of experience in backend development",
      "Experience with Node.js, Java, or Python",
    ],
    skills: ["Backend Development", "Node.js", "Java", "Python", "API Development"],
    duration: "Full-time",
    lastDate: "2024-06-28",
    roles: ["Backend Engineer", "Server-side Development", "API Design"],
    vision: "To give people the power to build community and bring the world closer together.",
  },
  {
    id: 17,
    title: "Director of Product Management",
    company: "Apple",
    locations: ["Berlin, Germany"],
    level: "Director+",
    qualifications: [
      "10+ years of experience in product management",
      "Strong leadership and strategic skills",
    ],
    skills: ["Product Management", "Leadership", "Strategic Planning", "Team Leadership", "Product Strategy"],
    duration: "Full-time",
    lastDate: "2024-07-05",
    roles: ["Product Management Director", "Product Strategy", "Product Leadership"],
    vision: "To bring the best user experience to its customers through its innovative hardware, software, and services.",
  },
  {
    id: 18,
    title: "Mid-Level Cybersecurity Analyst",
    company: "Amazon",
    locations: ["Tokyo, Japan"],
    level: "Mid",
    qualifications: [
      "3+ years of experience in cybersecurity",
      "Knowledge of security protocols and tools",
    ],
    skills: ["Cybersecurity", "Security Analysis", "Security Protocols", "Network Security", "Threat Detection"],
    duration: "Full-time",
    lastDate: "2024-07-12",
    roles: ["Cybersecurity Analyst", "Security Operations", "Threat Analysis"],
    vision: "To be Earth’s most customer-centric company, Earth’s best employer, and Earth’s safest place to work.",
  },
  {
    id: 19,
    title: "Early Career - Technical Writer",
    company: "Google",
    locations: ["Singapore"],
    level: "Early",
    qualifications: [
      "Bachelor's degree in English, Communications, or related field",
      "Excellent writing and communication skills",
    ],
    skills: ["Technical Writing", "Communication", "Documentation", "Content Creation", "Editing"],
    duration: "Full-time",
    lastDate: "2024-07-19",
    roles: ["Technical Writer", "Documentation Specialist", "Content Writer"],
    vision: "To organize the world's information and make it universally accessible and useful.",
  },
  {
    id: 20,
    title: "Senior Machine Learning Engineer",
    company: "Microsoft",
    locations: ["Sydney, Australia"],
    level: "Senior",
    qualifications: [
      "Master's or PhD in Computer Science or related field",
      "Extensive experience in machine learning model development and deployment",
    ],
    skills: ["Machine Learning", "Deep Learning", "Model Development", "Deployment", "Python"],
    duration: "Full-time",
    lastDate: "2024-07-26",
    roles: ["Machine Learning Engineer", "AI Engineering", "Data Science"],
    vision: "To empower every person and every organization on the planet to achieve more.",
  },
];

function Job() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ location: [], sort: "", level: [], company: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyInputRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const [locationInput, setLocationInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationInputRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const levelDropdownRef = useRef(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailView, setIsJobDetailView] = useState(false);

  const toggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);
  const clearFilters = () => {
    setSelectedFilters({ location: [], sort: "", level: [], company: [] });
    setSearchTerm("");
    setCompanyInput("");
    setFilteredCompanies([]);
    setLocationInput("");
    setFilteredLocations([]);
    setShowLevelDropdown(false);
    setIsJobDetailView(false); // Reset to list view
    setSelectedJob(null);
  };

  const allLocations = [...new Set(jobListings.flatMap((job) => job.locations))];
  const allLevels = ["Intern", "Early", "Mid", "Senior", "Director+"];
  const allCompanies = [...new Set(jobListings.map((job) => job.company))];

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setIsLocationDropdownOpen(true);

    if (value) {
      const filtered = allLocations.filter((loc) => loc.toLowerCase().includes(value.toLowerCase()));
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(allLocations);
    }
  };

  const addLocation = (location) => {
    if (
      location &&
      allLocations.includes(location) &&
      !selectedFilters.location.includes(location) &&
      selectedFilters.location.length < 3
    ) {
      setSelectedFilters({ ...selectedFilters, location: [...selectedFilters.location, location] });
      setLocationInput("");
      setFilteredLocations([]);
      setIsLocationDropdownOpen(false);
    }
  };

  const removeLocation = (loc) => {
    setSelectedFilters({ ...selectedFilters, location: selectedFilters.location.filter((l) => l !== loc) });
  };

  const handleCompanyInput = (e) => {
    const value = e.target.value;
    setCompanyInput(value);
    setIsCompanyDropdownOpen(true);

    if (value) {
      const filtered = allCompanies.filter((comp) => comp.toLowerCase().includes(value.toLowerCase()));
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(allCompanies);
    }
  };

  const addCompany = (company) => {
    if (
      company &&
      allCompanies.includes(company) &&
      !selectedFilters.company.includes(company) &&
      selectedFilters.company.length < 3
    ) {
      setSelectedFilters({ ...selectedFilters, company: [...selectedFilters.company, company] });
      setCompanyInput("");
      setFilteredCompanies([]);
      setIsCompanyDropdownOpen(false);
    }
  };

  const removeCompany = (comp) => {
    setSelectedFilters({ ...selectedFilters, company: selectedFilters.company.filter((c) => c !== comp) });
  };


  const handleLevelChange = (level) => {
    let updatedLevels = [...selectedFilters.level];
    if (updatedLevels.includes(level)) {
      updatedLevels = updatedLevels.filter((l) => l !== level);
    } else {
      updatedLevels.push(level);
    }
    setSelectedFilters({ ...selectedFilters, level: updatedLevels });
  };

  const toggleLevelDropdown = () => {
    setShowLevelDropdown(!showLevelDropdown);
  };

  const filteredJobs = jobListings.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters.company.length === 0 || selectedFilters.company.includes(job.company)) &&
      (selectedFilters.location.length === 0 || job.locations.some((loc) => selectedFilters.location.includes(loc))) &&
      (selectedFilters.level.length === 0 || selectedFilters.level.includes(job.level))
    );
  });

  const handleLearnMore = (job) => {
    setSelectedJob(job);
    setIsJobDetailView(true);
  };

  const handleGoBack = () => {
    setIsJobDetailView(false);
    setSelectedJob(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLocationDropdownOpen &&
          locationInputRef.current &&
          !locationInputRef.current.contains(event.target) &&
          (!locationDropdownRef.current || !locationDropdownRef.current.contains(event.target))
      ) {
        setIsLocationDropdownOpen(false);
      }

      if (showLevelDropdown &&
          levelDropdownRef.current &&
          !levelDropdownRef.current.contains(event.target)) {
        setShowLevelDropdown(false);
      }

      if (isCompanyDropdownOpen &&
        companyInputRef.current &&
        !companyInputRef.current.contains(event.target) &&
        (!companyDropdownRef.current || !companyDropdownRef.current.contains(event.target))
      ) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocationDropdownOpen, locationInputRef, locationDropdownRef, showLevelDropdown, levelDropdownRef, isCompanyDropdownOpen, companyInputRef, companyDropdownRef]);


  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-y-none">
    
    {/* Sidebar Filters (Desktop) / Back Button (Expanded View) */}
      <div className={`w-full md:w-1/4 bg-gray-100 static p-4 ${isJobDetailView ? 'md:block' : 'md:block'}`}>
        {isJobDetailView ? (
          <button onClick={handleGoBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            <i className="fa-solid fa-arrow-left mr-2"></i>Back to Job Listings
          </button>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="mt-4">
              <label className="block font-medium">Search by Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Company Filter */}
            <div className="mt-4 relative" ref={companyInputRef}>
              <label className="block font-medium">Companies</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Enter company"
                  value={companyInput}
                  onChange={handleCompanyInput}
                  onFocus={() => {setIsCompanyDropdownOpen(true); setFilteredCompanies(allCompanies);}}
                  onBlur={() => setTimeout(() => setIsCompanyDropdownOpen(false), 100)}
                />
                <button className="bg-red-400 hover:bg-red-500 text-white p-2 rounded" onClick={() => addCompany(companyInput)}>
                  +
                </button>
              </div>
              {isCompanyDropdownOpen && (
                <div className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto z-10 transition-opacity duration-200 ease-out transform origin-top" style={{ opacity: isCompanyDropdownOpen ? 1 : 0, transform: isCompanyDropdownOpen ? 'scale(1)' : 'scale(0.95)' }} ref={companyDropdownRef}>
                  {filteredCompanies.map((comp, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => addCompany(comp)}
                    >
                      {comp}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                {selectedFilters.company.map((comp, index) => (
                  <div key={index} className="flex justify-between bg-gray-200 p-2 rounded mt-1">
                    <span>{comp}</span>
                    <button className="text-red-500" onClick={() => removeCompany(comp)}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Sort by</label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={selectedFilters.sort}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, sort: e.target.value })}
              >
                <option value="">Select</option>
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Level</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-2 border rounded mt-1 text-left"
                  onClick={toggleLevelDropdown}
                >
                  {selectedFilters.level.length > 0 ? selectedFilters.level.join(", ") : "Select Level"}
                </button>
                {showLevelDropdown && (
                  <div className="absolute left-0 right-0 z-10 mt-1 bg-white border rounded shadow-md transition-opacity duration-200 ease-out transform origin-top" style={{ opacity: showLevelDropdown ? 1 : 0, transform: showLevelDropdown ? 'scale(1)' : 'scale(0.95)' }} ref={levelDropdownRef}>
                    {allLevels.map((level) => (
                      <div key={level} className="px-4 py-2 hover:bg-gray-100">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-red-500"
                            value={level}
                            checked={selectedFilters.level.includes(level)}
                            onChange={() => handleLevelChange(level)}
                          />
                          <span className="ml-2">{level}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 relative" ref={locationInputRef}>
              <label className="block font-medium">Locations</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Enter location"
                  value={locationInput}
                  onChange={handleLocationInput}
                  onFocus={() => {setIsLocationDropdownOpen(true); setFilteredLocations(allLocations);}}
                  onBlur={() => setTimeout(() => setIsLocationDropdownOpen(false), 100)}
                />
                <button className="bg-red-400 hover:bg-red-500 text-white p-2 rounded" onClick={() => addLocation(locationInput)}>
                  +
                </button>
              </div>
              {isLocationDropdownOpen && (
                <div className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto z-10 transition-opacity duration-200 ease-out transform origin-top" style={{ opacity: isLocationDropdownOpen ? 1 : 0, transform: isLocationDropdownOpen ? 'scale(1)' : 'scale(0.95)' }} ref={locationDropdownRef}>
                  {filteredLocations.map((loc, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => addLocation(loc)}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                {selectedFilters.location.map((loc, index) => (
                  <div key={index} className="flex justify-between bg-gray-200 p-2 rounded mt-1">
                    <span>{loc}</span>
                    <button className="text-red-500" onClick={() => removeLocation(loc)}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 w-full bg-red-500 text-white p-2 rounded" onClick={clearFilters}>
              Clear Filters
            </button>
          </>
        )}
      </div>
    
      {/* Job Listings Section / Job Detail View Section */}
      <div className="flex-1 p-4 overflow-y-scroll">
        {!isJobDetailView ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{filteredJobs.length} Jobs Matched</h2>
              <button className="md:hidden p-2" onClick={toggleMobileFilters}>
                <i className="fa-solid fa-bars-filter text-xl"></i>
              </button>
            </div>
    
            {/* Job Cards */}
            {filteredJobs.map((job) => (
              <div key={job.id} className="border p-4 rounded bg-white shadow-md mb-4 transition duration-300 hover:scale-101 ease-in-out">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600"><i className="fa-solid fa-buildings mr-1"></i>{job.company}</p>
                <p className="text-gray-600"><i className="fa-solid fa-location-dot mr-1 ml-1"></i>{job.locations.join("; ")}</p>
                <p className="text-gray-600 text-sm inline-block px-1 rounded"><i className="fa-sharp fa-solid fa-chart-simple text-gray-600 mr-1"></i>{job.level}</p>
                <h4 className="mt-3 font-semibold">Minimum Qualifications</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {job.qualifications.map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
                <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleLearnMore(job)}>Learn more</button>
              </div>
            ))}
          </>
        ) : (
          selectedJob && (
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
              <p className="text-gray-700 mb-3"><i className="fa-solid fa-building mr-2"></i><strong>Company:</strong> {selectedJob.company}</p>
              <p className="text-gray-700 mb-3"><i className="fa-solid fa-location-dot mr-2"></i><strong>Locations:</strong> {selectedJob.locations.join(", ")}</p>
              <p className="text-gray-700 mb-3"><i className="fa-sharp fa-solid fa-chart-simple mr-2"></i><strong>Level:</strong> {selectedJob.level}</p>
              <p className="text-gray-700 mb-3"><i className="fa-solid fa-clipboard-list mr-2"></i><strong>Roles:</strong> {selectedJob.roles.join(", ")}</p>
              <p className="text-gray-700 mb-3"><i className="fa-regular fa-clock mr-2"></i><strong>Duration:</strong> {selectedJob.duration}</p>
              <p className="text-gray-700 mb-3"><i className="fa-regular fa-calendar-xmark mr-2"></i><strong>Last Date to Apply:</strong> {selectedJob.lastDate}</p>
    
              <h3 className="text-xl font-semibold mt-4 mb-2">Minimum Qualifications</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {selectedJob.qualifications.map((q, index) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
    
              <h3 className="text-xl font-semibold mt-4 mb-2">Skills Required</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {selectedJob.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
    
              <h3 className="text-xl font-semibold mt-4 mb-2">Company Vision</h3>
              <p className="text-gray-700 mb-4">{selectedJob.vision}</p>
    
              <div className="flex justify-center mt-6">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
                  Apply Now <i className="fa-solid fa-external-link-alt ml-2"></i>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    
      {/* Mobile Filters Menu */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-end transition ease ease-in-out">
          <div className="w-full bg-white h-full p-4 shadow-lg mt-15">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={toggleMobileFilters}>
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Search by Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
             {/* Company Filter Mobile */}
             <div className="mt-4 relative" ref={companyInputRef}>
              <label className="block font-medium">Companies</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Enter company"
                  value={companyInput}
                  onChange={handleCompanyInput}
                  onFocus={() => {setIsCompanyDropdownOpen(true); setFilteredCompanies(allCompanies);}}
                  onBlur={() => setTimeout(() => setIsCompanyDropdownOpen(false), 100)}
                />
                <button className="bg-red-400 hover:bg-red-500 text-white p-2 rounded" onClick={() => addCompany(companyInput)}>
                  +
                </button>
              </div>
              {isCompanyDropdownOpen && (
                <div className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto z-10 transition-opacity duration-200 ease-out transform origin-top" style={{ opacity: isCompanyDropdownOpen ? 1 : 0, transform: isCompanyDropdownOpen ? 'scale(1)' : 'scale(0.95)' }} ref={companyDropdownRef}>
                  {filteredCompanies.map((comp, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => addCompany(comp)}
                    >
                      {comp}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                {selectedFilters.company.map((comp, index) => (
                  <div key={index} className="flex justify-between bg-gray-200 p-2 rounded mt-1">
                    <span>{comp}</span>
                    <button className="text-red-500" onClick={() => removeCompany(comp)}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Sort by</label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={selectedFilters.sort}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, sort: e.target.value })}
              >
                <option value="">Select</option>
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Level</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-2 border rounded mt-1 text-left"
                  onClick={toggleLevelDropdown}
                >
                  {selectedFilters.level.length > 0 ? selectedFilters.level.join(", ") : "Select Level"}
                </button>
                {showLevelDropdown && (
                  <div className="absolute left-0 right-0 z-10 mt-1 bg-white border rounded shadow-md transition-opacity duration-200 ease-out transform origin-top" style={{ opacity: showLevelDropdown ? 1 : 0, transform: showLevelDropdown ? 'scale(1)' : 'scale(0.95)' }} ref={levelDropdownRef}>
                    {allLevels.map((level) => (
                      <div key={level} className="px-4 py-2 hover:bg-gray-100">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-red-500"
                            value={level}
                            checked={selectedFilters.level.includes(level)}
                            onChange={() => handleLevelChange(level)}
                          />
                          <span className="ml-2">{level}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 relative" ref={locationInputRef}>
              <label className="block font-medium">Locations</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Enter location"
                  value={locationInput}
                  onChange={handleLocationInput}
                  onFocus={() => {setIsLocationDropdownOpen(true); setFilteredLocations(allLocations);}}
                  onBlur={() => setTimeout(() => setIsLocationDropdownOpen(false), 100)}
                />
                <button className="bg-red-400 hover:bg-red-500 text-white p-2 rounded" onClick={() => addLocation(locationInput)}>
                  +
                </button>
              </div>
              {isLocationDropdownOpen && (
                <div className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto z-10 transition-opacity duration-200 ease-out transform origin-top" style={{ opacity: isLocationDropdownOpen ? 1 : 0, transform: isLocationDropdownOpen ? 'scale(1)' : 'scale(0.95)' }} ref={locationDropdownRef}>
                  {filteredLocations.map((loc, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => addLocation(loc)}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2">
                {selectedFilters.location.map((loc, index) => (
                  <div key={index} className="flex justify-between bg-gray-200 p-2 rounded mt-1">
                    <span>{loc}</span>
                    <button className="text-red-500" onClick={() => removeLocation(loc)}>×</button>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 w-full bg-red-500 text-white p-2 rounded" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
    );
}

export default Job;