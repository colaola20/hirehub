// src/components/JobCard.jsx
import React from "react";
import styles from "./JobCard.module.css";

const JobCard = ({ job }) => {



return (
    <div className={styles["job-card"]}>
      <h3>{job.title || "Untitled Position"}</h3>
      <p className={styles.date}><strong>Date:</strong>{" "}{job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}</p>
      <p><strong>Company:</strong> {job.company || "Unknown"}</p>
      <p><strong>Location:</strong> {job.location || "Unspecified"}</p>
      <p><strong>Salary:</strong> Not listed</p> {/* DB has no salary */}
      <p className={styles.description}
      dangerouslySetInnerHTML={{ __html: job.description || "No description provided." }}></p>
      <p className={styles.source}><strong>Source:</strong> {job.source || "Unknown"}</p>
      <button
        className={styles["apply-btn"]}
        onClick={() => window.open(job.url, "_blank")}
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
