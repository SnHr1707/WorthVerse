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
  },
];

function Job() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ location: [], sort: "", level: [], company: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [companyInput, setCompanyInput] = useState(""); // Input for company search
  const [filteredCompanies, setFilteredCompanies] = useState([]); // Autocomplete companies
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false); // Company dropdown visibility
  const companyInputRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const [locationInput, setLocationInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationInputRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const levelDropdownRef = useRef(null); // Ref for level dropdown

  const toggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);
  const clearFilters = () => {
    setSelectedFilters({ location: [], sort: "", level: [], company: [] });
    setSearchTerm("");
    setCompanyInput("");
    setFilteredCompanies([]);
    setLocationInput("");
    setFilteredLocations([]);
    setShowLevelDropdown(false); // Also close level dropdown on clear filters
  };

  // Get unique locations, levels and companies from job listings
  const allLocations = [...new Set(jobListings.flatMap((job) => job.locations))];
  const allLevels = ["Intern", "Early", "Mid", "Senior", "Director+"]; // Explicit levels as per requirement
  const allCompanies = [...new Set(jobListings.map((job) => job.company))];

  // Handle input change for location and autocomplete
  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setIsLocationDropdownOpen(true);

    if (value) {
      const filtered = allLocations.filter((loc) => loc.toLowerCase().includes(value.toLowerCase()));
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(allLocations); // Show all locations when input is cleared or on focus
    }
  };

  // Add location to filters
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
      setIsLocationDropdownOpen(false); // Close dropdown after selection
    }
  };

  const removeLocation = (loc) => {
    setSelectedFilters({ ...selectedFilters, location: selectedFilters.location.filter((l) => l !== loc) });
  };

  // Handle input change for company and autocomplete
  const handleCompanyInput = (e) => {
    const value = e.target.value;
    setCompanyInput(value);
    setIsCompanyDropdownOpen(true);

    if (value) {
      const filtered = allCompanies.filter((comp) => comp.toLowerCase().includes(value.toLowerCase()));
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(allCompanies); // Show all companies when input is cleared or on focus
    }
  };

  // Add company to filters
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
      setIsCompanyDropdownOpen(false); // Close dropdown after selection
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

  // Filter jobs based on search input, company, location, and level
  const filteredJobs = jobListings.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters.company.length === 0 || selectedFilters.company.includes(job.company)) && // Company filter
      (selectedFilters.location.length === 0 || job.locations.some((loc) => selectedFilters.location.includes(loc))) &&
      (selectedFilters.level.length === 0 || selectedFilters.level.includes(job.level))
    );
  });

  // Close location and level dropdown on click outside
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
    <div className="flex flex-col md:flex-row min-h-screen overflow-y-hidden">
      {/* Sidebar Filters (Desktop) */}
      <div className="hidden md:block w-1/4 bg-gray-100 p-4">
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
              onFocus={() => {setIsCompanyDropdownOpen(true); setFilteredCompanies(allCompanies);}} // Show all companies on focus
              onBlur={() => setTimeout(() => setIsCompanyDropdownOpen(false), 100)} // Delay closing on blur
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
              onFocus={() => {setIsLocationDropdownOpen(true); setFilteredLocations(allLocations);}} // Show all locations on focus
              onBlur={() => setTimeout(() => setIsLocationDropdownOpen(false), 100)} // Delay closing on blur
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

      {/* Job Listings Section */}
      <div className="flex-1 p-4 max-h-[calc(100vh-80px)] overflow-y-auto"> {/* Added max-h and overflow-y-auto */}
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
            <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded">Learn more</button>
          </div>
        ))}
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
                  onFocus={() => {setIsCompanyDropdownOpen(true); setFilteredCompanies(allCompanies);}} // Show all companies on focus
                  onBlur={() => setTimeout(() => setIsCompanyDropdownOpen(false), 100)} // Delay closing on blur
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
                  onFocus={() => {setIsLocationDropdownOpen(true); setFilteredLocations(allLocations);}} // Show all locations on focus
                  onBlur={() => setTimeout(() => setIsLocationDropdownOpen(false), 100)} // Delay closing on blur
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