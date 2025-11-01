import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import styles from "./AppliedJobs.module.css";
import { FileText, Briefcase, MapPin, Calendar, CheckCircle, Edit, StickyNote, ExternalLink, Clock } from "lucide-react";


const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


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



  const handleStatusChange = async (applicationId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setAppliedJobs((prevJobs) =>
        prevJobs.map((app) => (app.application_id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error(err);
    }
  };


// Sorting logic
  const sortJobs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...appliedJobs].sort((a, b) => {
      const getValue = (obj) => {
        switch (key) {
          case "title":
            return obj.job?.title || "";
          case "company":
            return obj.job?.company || "";
          case "location":
            return obj.job?.location || "";
          case "date_posted":
            return obj.job?.date_posted || "";
          case "status":
            return obj.status || "";
          case "applied_at":
            return obj.applied_at || "";
          default:
            return "";
        }
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (key.includes("date") || key === "applied_at") {
        // date comparison
        const dateA = new Date(aVal);
        const dateB = new Date(bVal);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // string comparison
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    setAppliedJobs(sorted);
  };


  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };


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
            <span onClick={() => sortJobs("title")} className={styles.sortable}>
              <FileText size={16} /> Title <span className={styles.arrow}>{getSortIcon("title")}</span>
            </span>
            <span onClick={() => sortJobs("company")} className={styles.sortable}>
              <Briefcase size={16} /> Company <span className={styles.arrow}>{getSortIcon("company")}</span>
            </span>
            <span onClick={() => sortJobs("location")} className={styles.sortable}>
              <MapPin size={16} /> Location <span className={styles.arrow}>{getSortIcon("location")}</span>
            </span>
            <span onClick={() => sortJobs("date_posted")} className={styles.sortable}>
              <Calendar size={16} /> Date Posted <span className={styles.arrow}>{getSortIcon("date_posted")}</span>
            </span>
            <span><CheckCircle size={16} /> Active</span>
            <span onClick={() => sortJobs("status")} className={styles.sortable}>
              <Edit size={16} /> Status <span className={styles.arrow}>{getSortIcon("status")}</span>
            </span>
            <span><StickyNote size={16} /> Notes</span>
            <span><ExternalLink size={16} /> URL</span>
            <span onClick={() => sortJobs("applied_at")} className={styles.sortable}>
              <Clock size={16} /> Applied At <span className={styles.arrow}>{getSortIcon("applied_at")}</span>
            </span>
          </div>

          {/* Data Rows */}
          {appliedJobs.map((app) => {
            const job = app.job || {};
            return (
              <div key={app.application_id} className={styles.dataRow}>
                <span>{job.title || "Untitled Position"}</span>
                <span>{job.company || "Unknown"}</span>
                <span>{job.location || "Unspecified"}</span>
                <span>{job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "Unknown"}</span>
                <span>{job.is_active ? "Yes" : "No"}</span>
                <select value={app.status} onChange={(e) => handleStatusChange(app.application_id, e.target.value)}>
                  <option value="applied">Applied</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
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