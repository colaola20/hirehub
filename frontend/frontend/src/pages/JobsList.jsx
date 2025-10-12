import { useEffect, useCallback, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";

import styles from "./JobsList.module.css";
import JobCard from "../components/JobCard.jsx";

const JobsList = ({ jobs: initialJobs }) => {

  const { onJobClick } = useOutletContext();

  const [jobs, setJobs] = useState(initialJobs || []);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);

  
  const loadingMore = useRef(false)
  const lastQueryRef = useRef("");
  

// fetchJobs accepts limit, offset, and search query
const fetchJobs = useCallback(async (limit = 20, offset = 0, query = "") => {
  try {
    if (offset === 0) {
      setLoading(true);
      setError(null);
    }

    const token = localStorage.getItem("token");
    
    const response = await fetch(
      `/api/jobs?limit=${limit}&offset=${offset}&preload=10&search=${encodeURIComponent(query)}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      items: data.current || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    setError('Failed to load jobs. Please try again.');
    return { items: [], total: 0 };
  } finally {
    if (offset === 0) setLoading(false);
  }
}, []);



  // helper used by retry button and explicit reload
const reloadInitialJobs = useCallback(async (query) => {
  const { items, total } = await fetchJobs(20, 0, query);
  setJobs(items);
  setTotalJobs(total);
}, [fetchJobs]);

// initial load
useEffect(() => {
  let mount = true;
  const loadInitialJobs = async () => {
    const { items, total } = await fetchJobs(20, 0, "");
    if (!mount) return;
    setJobs(items);
    setTotalJobs(total);
    setLoading(false);
  };
  const token = localStorage.getItem("token");
  if (token) loadInitialJobs();
  return () => { mount = false; };
}, [fetchJobs]);

// infinite scroll
useEffect(() => {
  const handleScroll = async () => {
    const scrollable = document.documentElement;
    const scrolledToBottom =
      scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 100;

    if (scrolledToBottom && !loadingMore.current && jobs.length < totalJobs) {
      loadingMore.current = true;
      try {
        const { items } = await fetchJobs(20, jobs.length, lastQueryRef.current);
        if (items.length > 0) setJobs(prev => [...prev, ...items]);
      } finally {
        loadingMore.current = false;
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [jobs.length, totalJobs, fetchJobs]);


const handleSearchClick = async () => {
  lastQueryRef.current = searchQuery;
  setLoading(true);
  setJobs([]); 
  setTotalJobs(0); 
  const { items, total } = await fetchJobs(20, 0, searchQuery);
  setJobs(items);
  setTotalJobs(total);
  setLoading(false);
};


  return (

    <section className={styles.jobSection}>

        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className={styles.searchBtn} 
            onClick={handleSearchClick}
          >
            🔍
          </button>
        </div>

      {/* Left Column: Job Cards */}
      <div className={styles.cardList}>
         {/* Loading state */}
          {loading && (
            <div className={styles.loadingState}>
              <p>Loading jobs for you</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button onClick={reloadInitialJobs} className={styles.retryBtn}>Try Again</button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && jobs.length === 0 && (
            <div className={styles.emptyState}>
              <p>No jobs found. Check back later!</p>
            </div>
          )}

          {/* Job display */}
          {!loading && jobs.length >0 && (
            <div className={styles.jobCard}>
              {jobs.map((job, idx) => (
                <JobCard key={job.id || idx} job={job}  onClick={() => onJobClick(job)}
                />
              ))}

            </div>
          )}
      </div>
      {/* Right Column: Chatbot */}
      {/* <div className="chat-column">
        <h2>Chatbot Coming Soon </h2>
      </div> */}
    </section>

  )
}

export default JobsList