import React, { useState } from "react";

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
];

function Job() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ location: [], sort: "", level: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  const toggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);
  const clearFilters = () => {
    setSelectedFilters({ location: [], sort: "", level: "" });
    setSearchTerm("");
    setLocationInput("");
    setFilteredLocations([]);
  };

  // Get unique locations from job listings
  const allLocations = [...new Set(jobListings.flatMap((job) => job.locations))];

  // Handle input change for location and autocomplete
  const handleLocationInput = (e) => {
    const value = e.target.value;
    setLocationInput(value);

    if (value) {
      const filtered = allLocations.filter((loc) => loc.toLowerCase().includes(value.toLowerCase()));
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
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
    }
  };

  const removeLocation = (loc) => {
    setSelectedFilters({ ...selectedFilters, location: selectedFilters.location.filter((l) => l !== loc) });
  };

  // Filter jobs based on search input, location, and level
  const filteredJobs = jobListings.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters.location.length === 0 || job.locations.some((loc) => selectedFilters.location.includes(loc))) &&
      (selectedFilters.level === "" || job.level === selectedFilters.level)
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar Filters (Desktop) */}
      <div className="hidden md:block w-1/4 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="mt-4">
          <label className="block font-medium">Search</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          <select
            className="w-full p-2 border rounded mt-1"
            value={selectedFilters.level}
            onChange={(e) => setSelectedFilters({ ...selectedFilters, level: e.target.value })}
          >
            <option value="">Select Level</option>
            <option value="Intern">Intern</option>
            <option value="Early">Early</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
            <option value="Director+">Director+</option>
          </select>
        </div>
        <div className="mt-4 relative">
          <label className="block font-medium">Locations</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              className="p-2 border rounded w-full"
              placeholder="Enter location"
              value={locationInput}
              onChange={handleLocationInput}
            />
            <button className="bg-red-400 hover:bg-red-500 text-white p-2 rounded" onClick={() => addLocation(locationInput)}>
              +
            </button>
          </div>
          {filteredLocations.length > 0 && (
            <div className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto">
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
      <div className="flex-1 p-4">
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
            <p className="text-gray-600"><i class="fa-solid fa-buildings mr-1"></i>{job.company}</p>
            <p className="text-gray-600"><i class="fa-solid fa-location-dot mr-1 ml-1"></i>{job.locations.join("; ")}</p>
            <p className="text-gray-600 text-sm inline-block px-1 rounded"><i class="fa-sharp fa-solid fa-chart-simple text-gray-600 mr-1"></i>{job.level}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-3/4 bg-white h-full p-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={toggleMobileFilters}>
              <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Search</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
              <select
                className="w-full p-2 border rounded mt-1"
                value={selectedFilters.level}
                onChange={(e) => setSelectedFilters({ ...selectedFilters, level: e.target.value })}
              >
                <option value="">Select Level</option>
                <option value="Intern">Intern</option>
                <option value="Early">Early</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Director+">Director+</option>
              </select>
            </div>
            <div className="mt-4 relative">
              <label className="block font-medium">Locations</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Enter location"
                  value={locationInput}
                  onChange={handleLocationInput}
                />
                <button className="bg-red-400 hover:bg-red-500 text-white p-2 rounded" onClick={() => addLocation(locationInput)}>
                  +
                </button>
              </div>
              {filteredLocations.length > 0 && (
                <div className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto">
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