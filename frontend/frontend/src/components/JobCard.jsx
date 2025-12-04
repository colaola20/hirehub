// src/components/JobCard.jsx
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "./JobCard.module.css";
import FavoriteButton from "./FavoriteButton.jsx";
import JobAnalysisPanel from "./JobAnalysisPanel.jsx";

const JobCard = ({ job, onClick , cardForLikedJobs = false}) => {

const hardcodedJob = {
  id: 5122,
  title: "Senior Technical Product Manager - AvaCloud",
  company: "Ava Labs",
  date_posted: "2025-11-30T05:00:00",
  description:
    "Ava Labs is looking to hire a Senior Technical Product Manager - AvaCloud to join their team. This is a full-time position that can be done remotely anywhere in North America or on-site in Brooklyn NY.",
  employment_type: "full time",
  is_active: true,
  is_favorited: false,
  location: "Remote",
  source: "findwork",
  skills_by_category: {
    technical: ["python", "aws", "cloud", "databases"],
    tools: ["git", "docker"],
    soft_skills: ["communication", "leadership"]
  },
  skills_extracted: ["docker", "aws", "python", "databases", "git", "cloud"]
};

job = hardcodedJob;

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
