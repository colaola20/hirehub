import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import styles from "./JobsList.module.css";
import JobCard from "../components/JobCard.jsx";
import { MdClose } from "react-icons/md";
import { MdSearch } from 'react-icons/md';

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
  const scrollable = document.querySelector(`.${styles.cardList}`);
  if (!scrollable) return;

  const handleScroll = async () => {
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

  scrollable.addEventListener("scroll", handleScroll);
  return () => scrollable.removeEventListener("scroll", handleScroll);
}, [jobs.length, totalJobs, fetchJobs]);



  const performSearch = useCallback(async (searchQuery) => {
    lastQueryRef.current = searchQuery
    setLoading(true)
    setJobs([])
    setTotalJobs(0)
    const {items, total} = await fetchJobs(20, 0, searchQuery)
    setJobs(items);
    setTotalJobs(total);
    setLoading(false);
  }, [fetchJobs])

  const handleSearchClick = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
      await performSearch(searchQuery.trim())
  }

  const clearSearch = async () => {
    setSearchQuery("")
    await performSearch("")
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchQuery !== lastQueryRef.current) performSearch(searchQuery.trim())
    }, 500)
    return () => clearTimeout(id)
  }, [searchQuery, performSearch])


  // Making search sticky but also callapsing when scolling
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isExpend, setIsExpend] = useState(false)
  const containerRef = useRef(null)
  const scrollTrick = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (scrollTrick.current) return
      scrollTrick.current = true
      window.requestAnimationFrame(()=> {
        const shouldCollapse = window.scrollY > 160 && window.innerWidth > 720
        // only auto-collapse if user has not manually expanded
        if (!isExpend) setIsCollapsed(shouldCollapse)
          scrollTrick.current = false
      })
    }
    window.addEventListener("scroll", onScroll, {passive: true})
    return () => window.removeEventListener("scroll", onScroll)
  }, [isExpend])

  useEffect(() => {
    if (!isExpend) return
    const onKey = (e) => { if (e.key === "Escape") setIsExpend(false)}
    const onDocClick = (e) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setIsExpend(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onDocClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onDocClick)
    }
  }, [isExpend])

  const handleToggle = (e) => {
    e?.preventDefault()
    //if currently collapsed, open the expended view
    if (isCollapsed && !isExpend) {
      setIsExpend(true)
      window.requestAnimationFrame(() => {
        const el = containerRef.current?.querySelector("input")
        if (el) el.focus()
      })
    return
    }
    // otherwise submit or toggle normally
    // if already expanded, closing will keep it collapsed on scroll
    setIsExpend((v) => !v)
  }

  const containerClass = [
    styles.searchContainer,
    isCollapsed ? styles.collapsed : "",
    isExpend ? styles.expanded: "",
  ].join(" ").trim()

  //------------------------------------
  // new filter state
  const [filters, setFilters] = useState({
    company: "any",
    location: "",
    remote: "any",
    datePosted: "newest",
  })

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({...f, [key]: value}))
  }

  const clearFilters = () => setFilters({company: "any", location: "", remote: "any", datePosted: "newest"})

  const companyOptions = useMemo(() => {
        const setC = new Set((jobs || []).map((j) => (j.company ||"").trim()).filter(Boolean))
    return ["any", ...Array.from(setC)]
  }, [jobs])

  // derived filterJobs from fetched jobs
  const filteredJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return []
    let list = jobs.slice()

    //company filter
    if (filters.company && filters.company !== "any") {
      list = list.filter((j) => (j.company || "").toLowerCase() === filters.company.toLowerCase())
    }

    // location substring match
    if (filters.location && filters.location.trim() !== "") {
      const loc = filters.location.trim().toLowerCase()
      list = list.filter((j) => (j.location || "").toLowerCase().includes(loc))
    }

    // remote (expects job.remote to be "remote", "onside", "hybrid")
    // we don't have this info save in the db !!!
    if (filters.remote && filters.remote !== "any") {
      list = list.filter((j) => (j.remote || "").toLowerCase() === filters.remote.toLowerCase())
    }

    //sort by date posted
    const getTime = (job) => {
      const d = job.date_posted || null
      const t = d? new Date(d).getTime() : 0
      return Number.isFinite(t) ? t: 0
    }
    list.sort((a, b) => 
      filters.datePosted === "newest" ? getTime(b) - getTime(a) : getTime(a) - getTime(b)
    )
    return list
  }, [jobs, filters])

  return (

    <section className={styles.jobSection}>

        <form 
          ref = {containerRef}
          className={containerClass} 
          onSubmit={handleSearchClick} 
          role="search" 
          aria-label="Search jobs">
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search jobs"
          />
          {searchQuery && (
            <button type="button" className={styles.clearBtn} onClick={clearSearch} aria-label="Clear search" >
              <MdClose/>
            </button>
          )}
          <button
            type={isCollapsed ? "button" : "submit"}
            className={styles.searchBtn}
            aria-label={isCollapsed ? (isExpend ? "Close search": "Open search") : "Submit search"}
            aria-expanded={isExpend}
            onClick={handleToggle}
          >
            <MdSearch/>
          </button>
        </form>

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