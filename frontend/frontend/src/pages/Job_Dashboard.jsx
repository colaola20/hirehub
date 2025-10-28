// job_dashboard.jsx
import { useEffect, useState } from "react";
import styles from "./job_dashboard.module.css"; // your existing CSS module

const JobDashboard = () => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("job_dashboard_payload");
    if (!raw) return; // opened directly without a prior click
    try {
      setJob(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  if (!job) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h2>No job selected</h2>
          <p>Go back to the Jobs list and click a job to view its details here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{job.title || "Job Details"}</h1>

        <div className={styles.meta}>
          {job.company && <span className={styles.metaItem}><strong>Company:</strong> {job.company}</span>}
          {job.location && <span className={styles.metaItem}><strong>Location:</strong> {job.location}</span>}
          {job.date && <span className={styles.metaItem}><strong>Date:</strong> {job.date}</span>}
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Description</h3>
          {/* If your API returns HTML, switch to dangerouslySetInnerHTML */}
          <p className={styles.description}>
            {job.description || "No description provided."}
          </p>
        </section>

        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Skills</h3>
            <ul className={styles.skills}>
              {job.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>
        )}

        {job.apply_url && (
          <a
            className={styles.applyBtn}
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
        )}
      </div>
    </div>
  );
};

export default JobDashboard;
