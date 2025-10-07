// src/components/JobCard.jsx
import React from "react";
import truncate from "html-truncate";
import styles from "./JobCard.module.css";

const JobCard = ({ job }) => {

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

return (
    <div className={styles["job-card"]}>
        <h3>{job.title || "Untitled Position"}</h3>
        <p className={styles.date}><strong>Date:</strong>{" "}{job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "No date"}</p>
        <p><strong>Company:</strong> {job.company || "Unknown"}</p>
        <p><strong>Location:</strong> {job.location || "Unspecified"}</p>
        <p><strong>Salary:</strong> Not listed</p> {/* DB has no salary */}
        <p className={styles.description} dangerouslySetInnerHTML={{ __html: cleanJobDescription(job.description) }}></p>
        <p className={styles.source}><strong>Source:</strong> {job.source || "Unknown"}</p>
        <button
        className={styles["apply-btn"]}
        onClick={() => window.open(job.url, "_blank")}
        >
        Apply Now
        </button>
        </div>
  );
};

export default JobCard;
