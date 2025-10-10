import { useEffect, useCallback, useState, useRef } from "react";
import styles from "./dashBoard.module.css";
import JobCard from "../components/JobCard.jsx";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalJobs, setTotalJobs] = useState(0)
  
  const loadingMore = useRef(false)
  

  // fetchJobs accepts limit & offset and returns the items
  const fetchJobs = useCallback(async (limit = 20, offset = 0) => {
    try {
      if (offset === 0) {
        setLoading(true);
        setError(null);
      }

      const token = localStorage.getItem("token")
      const response = await fetch(`/api/jobs?limit=${limit}&offset=${offset}&preload=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log(data)
      return {
        items: data.current || [],
        total: data.total || 0
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      setError('Failed to load jobs. Please try again.')
      return {items:[], total:0}
    } finally {
      if (offset === 0) setLoading(false);
    }
  }, [])

  // helper used by retry button and explicit reload
  const reloadInitialJobs = useCallback(async () => {
    const {items, total} = await fetchJobs(20, 0)
    setJobs(items)
    setTotalJobs(total)
  }, [fetchJobs])

  // initial load
  useEffect(() => {
    let mount = true;
    const loadInitialJobs = async () => {
      const {items, total} = await fetchJobs(20, 0);
      if (!mount) return
      setJobs(items);
      setTotalJobs(total);
      setLoading(false);
    };
    const token = localStorage.getItem("token")
    if (token) loadInitialJobs();
    return () => {mount = false}
  }, [fetchJobs]);
  // initial scroll appending
  useEffect(() => {
    const handleScroll = async () => {
      const scrollable = document.documentElement;
      const scrolledToBottom =
        scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 100; // 100px buffer

      if (scrolledToBottom && !loadingMore.current && jobs.length < totalJobs) {
        loadingMore.current = true;
        // fetch more jobs if available
        const {items} = await fetchJobs(20, jobs.length);
        if (items.length > 0) {
          setJobs((prev) => [...prev, ...items]);
        }
        loadingMore.current = false;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [jobs.length, totalJobs, fetchJobs]);

  return (
    <section>
      <input 
        type="text"  
        placeholder="Search jobs..." 
        className={styles.searchInput}
      />
      {/* Left Column: Job Cards */}
      <div className="jobs-column">
         {/* Loading state */}
          {loading && (
            <div className="loading-state">
              <p>Loading jobs for you</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={reloadInitialJobs} className="retry-btn">Try Again</button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && jobs.length === 0 && (
            <div className="empty-state">
              <p>No jobs found. Check back later!</p>
            </div>
          )}

          {/* Job display */}
          {!loading && jobs.length >0 && (
            <>
              {jobs.map((job, idx) => (
                <JobCard key={job.id || idx} job={job} />
              ))}

            </>
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