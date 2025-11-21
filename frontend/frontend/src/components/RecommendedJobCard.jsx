import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "./JobCard.module.css";
import FavoriteButton from "./FavoriteButton.jsx";

const RecommendedJobCard = ({ job, recommendation, onClick }) => {
  
  const match = recommendation?.match_score || 0;

  return (
    <div
      className={styles["job-card"]}
      onClick={() => onClick && onClick(job)}
    >
      <div className={styles["card-header"]}>
        <h3>{job.title || "Untitled Position"}</h3>
        <FavoriteButton jobId={job.id} initialFavorited={job.is_favorited} />
      </div>

      <div className={styles.cardWrapper}>
        {/* LEFT SIDE: job details */}
        <div className={styles.leftSide}>
          <p className={styles.date}>
            <FaCalendarAlt
              style={{
                marginRight: "10px",
                color: "#a3bffa",
                fontSize: "20px",
              }}
            />
            <strong>Date:</strong>{" "}
            {job.date_posted
              ? new Date(job.date_posted).toLocaleDateString()
              : "No date"}
          </p>

          <p>
            <FaBuilding
              style={{
                marginRight: "10px",
                color: "#a3bffa",
                fontSize: "20px",
              }}
            />
            <strong>Company:</strong> {job.company || "Unknown"}
          </p>

          <p>
            <FaMapMarkerAlt
              style={{
                marginRight: "10px",
                color: "#a3bffa",
                fontSize: "20px",
              }}
            />
            <strong>Location:</strong> {job.location || "Unspecified"}
          </p>

          {/* Optional: show expiration */}
          {recommendation?.expires_at && (
            <p>
              <FaCalendarAlt
                style={{
                  marginRight: "10px",
                  color: "#a3bffa",
                  fontSize: "20px",
                }}
              />
              <strong>Expires:</strong>{" "}
              {new Date(recommendation.expires_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* RIGHT SIDE — static analysis, no API call */}
        <div
          className={styles.rightSide}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.wrapper}>
            {/* PERCENT MATCH */}
            <div className={styles.pctRow}>
              <div className={styles.pctBig}>
                {match % 1 === 0 ? match : match.toFixed(2)}%
              </div>
              <div className={styles.pctLabel}>Match</div>
            </div>

            {/* SKILLS IN JOB */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Skills in Job</div>
              <div className={styles.skillList}>
                {(job.skills_extracted || []).map((s, i) => (
                  <span key={i} className={styles.skillPill}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* MATCHED SKILLS */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Matched Skills</div>
              <div className={styles.skillList}>
                {(recommendation?.matched_skills || []).map((s, i) => (
                  <span key={i} className={styles.skillPill}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedJobCard;
