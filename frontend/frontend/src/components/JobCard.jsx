// src/components/JobCard.jsx
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import styles from "./JobCard.module.css";
import FavoriteButton from "./FavoriteButton.jsx";
import JobAnalysisPanel from "./JobAnalysisPanel.jsx";

const JobCard = ({ job, onClick, cardForLikedJobs = false, cardForRecommendedJobcard = false , recommendation = null }) => {



// --- STANDARD CARD (default) ---
  if (!cardForLikedJobs && !cardForRecommendedJobcard) {
    return (
      <div className={styles["job-card"]} onClick={() => onClick && onClick(job)}>
        <div className={styles["card-header"]}>
          <h3>{job.title || "Untitled Position"}</h3>
          <FavoriteButton jobId={job.id} initialFavorited={job.is_favorited} />
        </div>

        <div className={styles.cardWrapper}>
          {/* LEFT SIDE */}
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
                <span className={styles.value}>{job.location || "Unspecified"}</span>
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

          {/* RIGHT SIDE */}
          <div className={styles.rightSide} onClick={(e) => e.stopPropagation()}>
            <JobAnalysisPanel job={job} skipAnalysis={true} />
          </div>
        </div>
      </div>
    );
  }

  // --- LIKED JOB CARD ---
  if (cardForLikedJobs) {
    return (
      <div className={styles["job-card"]} onClick={() => onClick && onClick(job)}>
        <div className={styles["card-header"]}>
          <h3>{job.title || "Untitled Position"}</h3>
          <FavoriteButton jobId={job.id} initialFavorited={true} />
        </div>

      <div className={styles.cardWrapper}>

      <>

        <div className={styles.jobInfo}>

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
                <span className={styles.value}>{job.location || "Unspecified"}</span>
              </div>
            </div>

          <div className={styles.infoBlock}> 
              <div className={styles.iconBox}>
                <FaCalendarAlt />
              </div>
            <div className={styles.columnStyle}>
                <span className={styles.label}>DATE LIKED</span>
                <span className={styles.value}>
                  {job.dateLiked ? new Date(job.dateLiked).toLocaleDateString() : "Unknown"}
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

      </>
                  {/* RIGHT SIDE */}
          <div className={styles.rightSide} onClick={(e) => e.stopPropagation()}>
           <JobAnalysisPanel 
                job={job} 
                recommendedCard={true}
                percentValue={recommendation?.match_score}
                recommendation={recommendation}
              />
          </div>

        </div>
      </div>
    );
  }

  // --- RECOMMENDED JOB CARD ---
  if (cardForRecommendedJobcard) {
    return (
      <div className={styles["job-card"]} onClick={() => onClick && onClick(job)}>
        <div className={styles["card-header"]}>
          <h3>{job.title || "Untitled Position"}</h3>
          <FavoriteButton jobId={job.id} initialFavorited={job.is_favorited} />
        </div>

        <div className={styles.cardWrapper}>
          {/* LEFT SIDE */}
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
                <span className={styles.value}>{job.location || "Unspecified"}</span>
              </div>
            </div>


            {recommendation?.expires_at && (
              <div className={styles.infoBlock}>
                <div className={styles.iconBox}>
                  <FaCalendarAlt />
                </div>
                <div className={styles.columnStyle}>
                  <span className={styles.label}>EXPIRES ON</span>
                  <span className={styles.value}>
                    {new Date(recommendation.expires_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

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

        

          {/* RIGHT SIDE */}
          <div className={styles.rightSide} onClick={(e) => e.stopPropagation()}>
           <JobAnalysisPanel 
                job={job} 
                recommendedCard={true}
                percentValue={recommendation?.match_score}
                recommendation={recommendation}
              />
          </div>

        </div>
      </div>
    );
  }

  return null;

};

export default JobCard;