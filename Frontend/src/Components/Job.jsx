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
    jobType: "Full-time",
    skills: ["Sales", "Marketing", "Advertising"]
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
    jobType: "Remote",
    skills: ["Computer Science", "Software Engineer", "Node.js"]
  },
];

const allLocations = [
  ...new Set(jobListings.flatMap((job) => job.locations)),
];

const experienceLevels = ["Intern", "Early", "Mid", "Advance", "Director+"];
const jobTypes = ["Full-time", "Part-time", "Remote", "Intern"];

function Job() {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  const handleLocationChange = (event) => {
    const value = event.target.value;
    if (selectedLocations.includes(value)) {
      setSelectedLocations(selectedLocations.filter((loc) => loc !== value));
    } else if (selectedLocations.length < 3) {
      setSelectedLocations([...selectedLocations, value]);
    }
  };

  const filteredJobs = jobListings.filter((job) => {
    return (
      (searchTerm === "" || job.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedExperience === "" || job.level === selectedExperience) &&
      (selectedJobType === "" || job.jobType === selectedJobType) &&
      (selectedSkills === "" ||
        job.skills.some((skill) => skill.toLowerCase().includes(selectedSkills.toLowerCase()))) &&
      (selectedLocations.length === 0 || selectedLocations.some((loc) => job.locations.includes(loc)))
    );
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        
        <label className="block font-medium">Search</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <label className="block font-medium mt-4">Select Locations (Max 3)</label>
        <select
          className="w-full p-2 border rounded"
          multiple
          value={selectedLocations}
          onChange={handleLocationChange}
        >
          {allLocations.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
        
        <label className="block font-medium mt-4">Experience Level</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
        >
          <option value="">Select</option>
          {experienceLevels.map((level, index) => (
            <option key={index} value={level}>{level}</option>
          ))}
        </select>
        
        <label className="block font-medium mt-4">Skills & Qualifications</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter skills (e.g., Software Engineer)"
          value={selectedSkills}
          onChange={(e) => setSelectedSkills(e.target.value)}
        />

        <label className="block font-medium mt-4">Job Type</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedJobType}
          onChange={(e) => setSelectedJobType(e.target.value)}
        >
          <option value="">Select</option>
          {jobTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 p-4">
        <h2 className="text-xl font-semibold">{filteredJobs.length} Jobs Matched</h2>
        {filteredJobs.map((job) => (
          <div key={job.id} className="border p-4 rounded bg-white shadow-md mb-4">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <div className="text-gray-600 mt-1">{job.company}</div>
            <div className="text-gray-600 mt-1">{job.locations.join("; ")}</div>
            <p className="mt-2 text-sm bg-gray-200 inline-block px-2 py-1 rounded">{job.level}</p>
            <p className="mt-2 text-sm">{job.jobType}</p>
            <h4 className="mt-3 font-semibold">Minimum Qualifications</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {job.qualifications.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Job;
