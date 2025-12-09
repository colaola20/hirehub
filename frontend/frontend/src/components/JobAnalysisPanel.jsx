import { useEffect, useState, useRef } from "react";
import styles from "./JobCard.module.css";
import PercentCircle from "./circle/MatchCircle";

// ✅ Global cache outside component - survives remounts
const analysisCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const inFlightRequests = new Map();

const JobAnalysisPanel = ({ job , recommendedCard = false, percentValue = null, recommendation = null, onClick  }) => {
  
// If this panel is for a recommended job, skip API analysis completely
if (recommendedCard && percentValue !== null) {
  const pct = Math.round(percentValue);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pctRow}>
        <PercentCircle percent={pct} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Skills in Job</div>
        <div className={styles.skillList}>
          {(job.skills_extracted || []).map((s, i) => (
            <span key={i} className={styles.skillPill}>{s}</span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Matched Skills</div>
        <div className={styles.skillList}>
          {(recommendation?.matched_skills || []).map((s, i) => (
            <span key={i} className={styles.matchedSkillPill}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const getCachedAnalysis = (jobId) => {
  const cached = analysisCache.get(jobId);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    analysisCache.delete(jobId);
    return null;
  }
  
  return cached.data;
};

const setCachedAnalysis = (jobId, data) => {
  analysisCache.set(jobId, {
    data,
    timestamp: Date.now()
  });
};

  // ✅ Only start analysis when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // Stop observing once visible
        }
      },
      { rootMargin: "100px" } // Start loading slightly before visible
    )

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect()
  }, [])


  useEffect(() => {

    if (!job?.id || !isVisible) return; // Wait until visible

    // ✅ Check cache first
    if (analysisCache.has(job.id)) {
      console.log(`Using cached analysis for job ${job.id}`);
      setAnalysis(getCachedAnalysis(job.id));
      setLoading(false);
      return;
    }


    const controller = new AbortController();
    const signal = controller.signal;

    const runAnalysis = async () => {
      const token = localStorage.getItem("token");
      console.log(`Running NEW analysis for job ${job.id}`)

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
            setCachedAnalysis(job.id, data);
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
          const errorData = { error: "Unable to calculate" };
          setCachedAnalysis(job.id, errorData);
          setAnalysis(errorData);
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
  }, [job?.id, isVisible]);


if (!analysis)
  return <div ref={containerRef} className={styles.centeredMessage}><div className={styles.loading}>Analyzing...</div></div>;

if (analysis?.error)
  return <div className={styles.error}>{analysis.error}</div>;

if (analysis.percentage_match === 0 ){
  return <div className={styles.noMatch} onClick={onClick}>We couldn’t find enough skill data to generate a match score.</div>;
}

  const rawPct = Number(analysis.percentage_match || 0);
  const formattedPct = Math.round(rawPct);

  return (
    <div ref={containerRef} className={styles.wrapper} onClick={onClick}>
      <div className={styles.pctRow}>

        {/* Circle */}
        <PercentCircle percent={formattedPct} />
    
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
            <span key={i} className={styles.matchedSkillPill}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );

};

export default JobAnalysisPanel;