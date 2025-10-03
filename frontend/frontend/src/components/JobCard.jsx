// src/components/JobCard.jsx
import React from "react";
import "./JobCard.css";

const JobCard = ({ job }) => {

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p>{job.description}</p>
      <button className="apply-btn">Apply Now</button>
    </div>
  );
};

export default JobCard;
