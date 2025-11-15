// src/components/JobCard.jsx
import React, { useState, useEffect } from "react";
import truncate from "html-truncate";
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "./JobCard.module.css";
import FavoriteButton from "./FavoriteButton.jsx";

const JobCard = ({ job, onClick , cardForLikedJobs = false}) => {
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [dataAnalized, setDataAnalized] = useState(false);
  const token = localStorage.getItem("token");
  

  const analyzeJob = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    if (!token) {
      alert("You must be signed in to analyze fit.");
      return;
    }


    setLoadingAnalysis(true);
    try {
      const res = await fetch("/api/profile/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
          body: JSON.stringify({
            job: { 
              title: job.title, 
              skills_extracted: job.skills_extracted || [] 
            }
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        //console.error("Analysis error:", data);
        setAnalysis({
          error: data.error || data.message || "Analysis failed",
        });
      } else {
        setAnalysis(data);

      }
    } catch (err) {
     // console.error("Network analysis error:", err);
      setAnalysis({ error: "Network error" });
    } finally {
      setLoadingAnalysis(false);
      setDataAnalized(true);
    }
  };

  

  const renderList = (arr) => {
    if (!arr || arr.length === 0) return <em>None</em>;
    return arr.map((s, idx) => (
      <div key={idx} className={styles.skillPill}>
        {s}
      </div>
    ));
  };


  


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
            {!analysis && (
              <div className={styles.analysisPlaceholder}>
                "Analyzed Match" Will apper Here 
              </div>
            )}

            {analysis && analysis.error && (
              <div className={styles.analysisError}>{analysis.error}</div>
            )}

            {analysis && !analysis.error && (
              
              <>
                <div className={styles.pctRow}>
                  <div className={styles.pctBig}>
                    {analysis.percentage_match ?? 0}%
                  </div>
                  <div className={styles.pctLabel}>Match</div>
                </div>

              <div className={styles.analysisContentWrapper}>

                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Skills in Job</div>
                  <div className={styles.skillList}>
                    {renderList(analysis.job_skills)}
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Matched Skills</div>
                  <div className={styles.skillList}>
                    {renderList(analysis.matched_skills)}
                  </div>
                </div>

              </div>
              </>
            )}

          {!dataAnalized &&  (
            <button 
              className={styles.analyzeBtn}
              onClick={analyzeJob}
              onMouseDown={(e) => e.stopPropagation()}
              disabled={loadingAnalysis}
            >
              {loadingAnalysis ? "Analyzing..." : "Analyze Match"}
            </button>
            )}
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
