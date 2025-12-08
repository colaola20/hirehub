// src/components/JobCard.jsx
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import styles from "./JobCard.module.css";
import FavoriteButton from "./FavoriteButton.jsx";
import JobAnalysisPanel from "./JobAnalysisPanel.jsx";

const JobCard = ({ job, onClick, cardForLikedJobs = false }) => {

  // I removed the hardcodedJob object here so the component 
  // uses the real 'job' prop passed in.

  return (
    <>
      {!cardForLikedJobs ? (
        // --- STANDARD JOB CARD VIEW ---
        <div
          className={styles["job-card"]}
          onClick={() => onClick && onClick(job)}
        >
          <div className={styles["card-header"]}>
            <h3>{job.title || "Untitled Position"}</h3>
            <FavoriteButton jobId={job.id} initialFavorited={job.is_favorited} />
          </div>
        <div>
          <div className={styles.cardWrapper}>
            {/* Left side: Job Details */}
            <div className={styles.leftSide}>
              <div className={styles.infoBlock}>
                <div className={styles.iconBox}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.columnStyle}>
                  <span className={styles.label}>DATE</span>
                  <span className={styles.value}>
                    {job.date_posted
                      ? new Date(job.date_posted).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <div className={styles.iconBox}>
                  <FaBuilding />
                </div>
                <div className={styles.columnStyle}>
                  <span className={styles.label}>COMPANY</span>
                  <span className={styles.value}>{job.company || "Unknown"}</span>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <div className={styles.iconBox}>
                  <FaMapMarkerAlt />
                </div>
                <div className={styles.columnStyle}>
                  <span className={styles.label}>LOCATION</span>
                  <span className={styles.value}>
                    {job.location || "Unspecified"}
                  </span>
                </div>
              </div>

              {job.employment_type && (
                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaBriefcase />
                  </div>
                  <div className={styles.columnStyle}>
                    <span className={styles.label}>EMPLOYMENT TYPE</span>
                    <span className={styles.value}>{job.employment_type}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Analysis Panel */}
            <div className={styles.rightSide} onClick={(e) => e.stopPropagation()}>
              <JobAnalysisPanel job={job} skipAnalysis={true} />
            </div>
          </div>
          </div>
        </div>
      ) : (
        // --- LIKED JOBS CARD VIEW ---
        <>
          <div
            className={styles["job-card"]}
            onClick={() => onClick && onClick(job)}
          >
            <div className={styles["card-header"]}>
              <h3>{job.title || "Untitled Position"}</h3>
              <FavoriteButton jobId={job.id} initialFavorited={true} />
            </div>

            <div className={styles.jobInfo}>
              <p className={styles.date}>
                <FaCalendarAlt
                  style={{ marginRight: "10px", color: "#a3bffa", fontSize: "20px" }}
                />
                <strong>Date:</strong>{" "}
                {job.date_posted
                  ? new Date(job.date_posted).toLocaleDateString()
                  : "No date"}
              </p>

              <p>
                <FaBuilding
                  style={{ marginRight: "10px", color: "#a3bffa", fontSize: "20px" }}
                />
                <strong>Company:</strong> {job.company || "Unknown"}
              </p>

              <p>
                <FaMapMarkerAlt
                  style={{ marginRight: "10px", color: "#a3bffa", fontSize: "20px" }}
                />
                <strong>Location:</strong> {job.location || "Unspecified"}
              </p>
              
              <p>
                <FaCalendarAlt
                  style={{ marginRight: "10px", color: "#a3bffa", fontSize: "20px" }}
                />
                <strong>
                  Date Liked:{" "}
                  {job.dateLiked
                    ? new Date(job.dateLiked).toLocaleDateString()
                    : "Unknown"}
                </strong>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JobCard;