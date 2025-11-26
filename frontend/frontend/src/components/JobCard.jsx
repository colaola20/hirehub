// src/components/JobCard.jsx
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "./JobCard.module.css";
import FavoriteButton from "./FavoriteButton.jsx";
import JobAnalysisPanel from "./JobAnalysisPanel.jsx";

const JobCard = ({ job, onClick , cardForLikedJobs = false}) => {



return (

  <>

  { !cardForLikedJobs ? (

    <div className={styles["job-card"]}
     onClick={() => onClick && onClick(job)}>
        <div className={styles["card-header"]}>
          <h3>{job.title || "Untitled Position"}</h3>
          <FavoriteButton jobId={job.id} initialFavorited={job.is_favorited}  />
        </div>

      
      <div className={styles.cardWrapper}> 
        <div className={styles.leftSide}>
        <p className={styles.date}> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Date:</strong>{" "}{
        job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}</p>

        <p>  <FaBuilding style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Company:</strong> {job.company || "Unknown"}</p>

        <p>  <FaMapMarkerAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Location:</strong> {job.location || "Unspecified"}</p> 

        </div>

          {/* Right side: analysis section */}
        <div className={styles.rightSide} onClick={(e) => e.stopPropagation()}> 

          <JobAnalysisPanel job={job} />

        </div> 
          
      </div> 
          
    </div>

       ) : (

      <>
        <div className={styles["job-card"]}
        onClick={() => onClick && onClick(job)}>
            <div className={styles["card-header"]}>
              <h3>{job.title || "Untitled Position"}</h3>
              <FavoriteButton jobId={job.id} initialFavorited={true}  />
            </div>
           
        
           
          <div className={styles.jobInfo}>
            <p className={styles.date}> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Date:</strong>{" "}{
            job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}</p>

            <p>  <FaBuilding style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Company:</strong> {job.company || "Unknown"}</p>

            <p>  <FaMapMarkerAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Location:</strong> {job.location || "Unspecified"}</p>
            <p> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong> Date Liked: {job.dateLiked ? new Date(job.dateLiked ).toLocaleDateString() : "Unknown"} </strong></p> 
          </div>
           </div>
        </>
       )}
    </>
  );
};

export default JobCard;
