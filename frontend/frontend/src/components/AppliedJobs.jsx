import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import styles from "./AppliedJobs.module.css";


const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to load applied jobs");
        }

        const data = await response.json();
        setAppliedJobs(data.applied);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        setError("Failed to fetch your applied jobs. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);


  if (loading) return <p className={styles.message}>Loading your applied jobs...</p>;
  if (error) return <p className={styles.error}>{error}</p>;



  return (
  
    <div className={styles.container}>
      <h2>Your Applied Jobs</h2>

      {appliedJobs.length === 0 ? (
        <p className={styles.message}>You haven’t applied to any jobs yet.</p>
      ) : (
        <div className={styles.tableContainer}>
          {/* Header Row */}
          <div className={styles.headerRow}>
            <span>Title</span>
            <span>Company</span>
            <span>Location</span>
            <span>Date Posted</span>
            <span>Active</span>
            <span>Status</span>
            <span>Notes</span>
            <span>URL</span>
            <span>Applied At</span>
          </div>

          {/* Data Rows */}
          {appliedJobs.map((app) => {
            const job = app.job;
            return (
              <div key={app.application_id} className={styles.dataRow}>
                <span>{job.title || "Untitled Position"}</span>
                <span>{job.company || "Unknown"}</span>
                <span>{job.location || "Unspecified"}</span>
                <span>{job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "Unknown"}</span>
                <span>{job.is_active ? "Yes" : "No"}</span>
                <span>{app.status || "Applied"}</span>
                <span>{app.notes || "None"}</span>
                <span>{job.url || "Unknown"}</span>
                <span>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "Unknown"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
    
  );
}

export default AppliedJobs