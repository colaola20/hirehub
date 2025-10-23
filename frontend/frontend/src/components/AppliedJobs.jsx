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
        <div className={styles.cardsContainer}>
          {appliedJobs.map((app) => {
            const job = app.job;
            return (
              <div key={app.application_id} className={styles.appliedJobCard}>
                <h3>{job.title || "Untitled Position"}</h3>
                <p><strong>Company:</strong> {job.company || "Unknown"}</p>
                <p><strong>Location:</strong> {job.location || "Unspecified"}</p>
                <p><strong>Date Posted:</strong> {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "Unknown"}</p>
                <p><strong>Active:</strong> {job.is_active ? "Yes" : "No"}</p>
                <p><strong>Status:</strong> {app.status || "Applied"}</p>
                <p><strong>Notes:</strong> {app.notes || "None"}</p>
                <p><strong>URL:</strong> {job.url || "Unknown"}</p>
                <p><strong>Applied At:</strong> {app.applied_at ? new Date(app.applied_at).toLocaleString() : "Unknown"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


export default AppliedJobs;
