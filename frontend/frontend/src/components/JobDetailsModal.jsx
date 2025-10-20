import React, { useEffect } from "react";
import styles from "./JobDetailsModal.module.css";
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";
import SmallModal from "./SmallModal.jsx";


const JobDetailsModal = ({ job, onClose }) => {

   const [showSecondaryModal, setShowSecondaryModal] = React.useState(false);


  if (!job) return null;

  return (
    <>
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <div className={styles.modalHeader}>
          <h2>{job.title || "Untitled Position"}</h2>
          {/* <FavoriteButton jobId={job.id} /> */}
        </div>
      <div className={styles.modalHeaderContent}>
        <p className={styles.company}> <FaBuilding style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Company:</strong> {job.company || "Unknown"}</p>
        <p className={styles.location}> <FaMapMarkerAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Location:</strong> {job.location || "Unspecified"}</p>
        <p className={styles.datePosted}> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Date Posted:</strong>{" "}{job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}</p>
      </div>
        <hr />
        <div className={styles.scrollArea}>
          <p dangerouslySetInnerHTML={{ __html: job.description || "No description available." }} />
        </div>
        <p className={styles.source}><strong>Source:</strong> {job.source || "Unknown"}</p>
        <button
          className={styles.applyBtn}
          onClick={() => { window.open(job.url, "_blank");
            setShowSecondaryModal(true); // open small modal
          } }
        >
          Apply Now
        </button>
      </div>
    </div>

      {showSecondaryModal && (
          <SmallModal 
              job={job}  
              onNo={() => setShowSecondaryModal(false)} 
          />
      )}

    </>

  );
};

export default JobDetailsModal;
