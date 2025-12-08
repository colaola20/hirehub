import { useEffect, useState } from "react";
import styles from "./JobCard.module.css";

const JobAnalysisPanel = ({ job }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


useEffect(() => {
    if (!job) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const runAnalysis = async () => {
      try {
        const res = await fetch("/api/profile/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          
          signal: signal, 
          body: JSON.stringify({
            job: {
              skills_extracted: job.skills_extracted || [],
            },
          }),
        });

        const data = await res.json();
        
        // Prevent setting state if the component has already unmounted
        if (!signal.aborted) {
            setAnalysis(data);
        }
      } catch (err) {
        // 3. Handle the AbortError 
        if (err.name === "AbortError") {
          console.log("Analysis cancelled");
          return; // Stop execution here
        }
        
        // Only set error state if not aborted
        if (!signal.aborted) {
             setAnalysis({ error: "Unable to calculate" });
        }
      } finally {
        // Only stop loading if not aborted
        if (!signal.aborted) {
            setLoading(false);
        }
      }
    };

    runAnalysis();

    // Abort request when component unmounts
    return () => {
      controller.abort();
    };
  }, [job, token]);

  if (loading) return <div className={styles.loading}>Analyzing...</div>;
  if (analysis?.error) return <div className={styles.error}>{analysis.error}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.pctRow}>
        <div className={styles.pctBig}>
        {(() => {
            const pct = Number(analysis.percentage_match || 0);
            return pct % 1 === 0 ? pct : pct.toFixed(2);
        })()}%
        </div>
        <div className={styles.pctLabel}>Match</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Skills in Job</div>
        <div className={styles.skillList}>
          {(analysis.job_skills || []).map((s, i) => (
            <span key={i} className={styles.skillPill}>{s}</span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Matched Skills</div>
        <div className={styles.skillList}>
          {(analysis.matched_skills || []).map((s, i) => (
            <span key={i} className={styles.skillPill}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobAnalysisPanel;