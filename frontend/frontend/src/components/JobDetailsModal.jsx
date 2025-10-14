import React, { useEffect } from "react";
import styles from "./JobDetailsModal.module.css";
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

const JobDetailsModal = ({ job, onClose }) => {

 
  useEffect(() => {
    if (job) {
      document.body.style.overflow = "hidden"; // disable page scroll
    } else {
      document.body.style.overflow = ""; // restore scroll
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [job]);

  if (!job) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <h2>{job.title || "Untitled Position"}</h2>
        <p className={styles.company}> <FaBuilding style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Company:</strong> {job.company || "Unknown"}</p>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <p className={styles.location}> <FaMapMarkerAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Location:</strong> {job.location || "Unspecified"}</p>
        <p className={styles.datePosted}> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Date Posted:</strong>{" "}
          {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}
        </p>
        <hr />
        <div className={styles.scrollArea}>
          <p dangerouslySetInnerHTML={{ __html: job.description || "No description available." }} />
        </div>
        <p className={styles.source}><strong>Source:</strong> {job.source || "Unknown"}</p>
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
