// src/components/JobCard.jsx
import React from "react";
import truncate from "html-truncate";
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "./JobCard.module.css";
import FavoriteButton from "./FavoriteButton";

const JobCard = ({ job, onClick , cardForLikedJobs = false}) => {


const cleanJobDescription = (html) => {
  if (!html) return "No description provided.";

  // Check if it contains "apply" (case-insensitive)
  if (/apply/i.test(html)) {
    return html; // skip regex, return as-is
  }

  // Remove all HTML tags
  let text = html.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Remove unwanted characters but allow letters, numbers, space, $, -, ., ,, brackets, colon, /, ?, =, &, ", '
  text = text.replace(/[^a-zA-Z0-9\s$.,\-\[\]\(\):\/?=&"']/g, "");

  return text || "No description provided.";
};



  if (cardForLikedJobs) {
    return (
      <div className={styles["job-card"]}
      onClick={() => onClick && onClick(job)}>
          <div className={styles["card-header"]}>
            <h3>{job.title || "Untitled Position"}</h3>
            <FavoriteButton jobId={job.id} />
          </div>
        <div className={styles.jobInfo}>
          <p className={styles.date}> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Date:</strong>{" "}{
          job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}</p>

          <p>  <FaBuilding style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Company:</strong> {job.company || "Unknown"}</p>

          <p>  <FaMapMarkerAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Location:</strong> {job.location || "Unspecified"}</p>
           <p> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong> Date Liked: {job.dateLiked ? new Date(job.dateLiked ).toLocaleDateString() : "Unknown"} </strong></p> 
        </div>
          {/* <button
          className={styles["apply-btn"]}
          onClick={(e) => { 
            e.stopPropagation(); // prevent opening modal
            window.open(job.url, "_blank");}}
          >
          Apply Now
          </button> */}

          {/* Card Modifications for Liked Jobs*/}


      </div>
    );
  }


return (
    <div className={styles["job-card"]}
     onClick={() => onClick && onClick(job)}>
        <div className={styles["card-header"]}>
          <h3>{job.title || "Untitled Position"}</h3>
          <FavoriteButton jobId={job.id} />
        </div>

        <p className={styles.date}> <FaCalendarAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /><strong>Date:</strong>{" "}{
        job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}</p>

        <p>  <FaBuilding style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Company:</strong> {job.company || "Unknown"}</p>

        <p>  <FaMapMarkerAlt style={{ marginRight: "10px", color: "#a3bffa",fontSize: "20px" }} /> <strong>Location:</strong> {job.location || "Unspecified"}</p>
      
        {/* <button
        className={styles["apply-btn"]}
        onClick={(e) => { 
          e.stopPropagation(); // prevent opening modal
          window.open(job.url, "_blank");}}
        >
        Apply Now
        </button> */}

        {/* Card Modifications for Liked Jobs*/}


    </div>
  );
};

export default JobCard;
