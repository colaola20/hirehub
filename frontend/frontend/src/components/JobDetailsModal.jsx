import React from "react";
import styles from "./JobDetailsModal.module.css";

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <h2>{job.title || "Untitled Position"}</h2>
        <p><strong>Company:</strong> {job.company || "Unknown"}</p>
        <p><strong>Location:</strong> {job.location || "Unspecified"}</p>
        <p><strong>Date Posted:</strong>{" "}
          {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}
        </p>
        <hr />
        <div className={styles.scrollArea}>
          <p dangerouslySetInnerHTML={{ __html: job.description || "No description available." }} />
        </div>
        <button
          className={styles.applyBtn}
          onClick={() => window.open(job.url, "_blank")}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetailsModal;
