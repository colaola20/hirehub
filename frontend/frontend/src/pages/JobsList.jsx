import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

import styles from "./JobsList.module.css";
import JobCard from "../components/JobCard.jsx";
import { MdClose } from "react-icons/md";
import { MdSearch } from 'react-icons/md';

const JobsList = () => {

  const outlet = useOutletContext() || {}
  const { onJobClick = () => {}} = outlet

  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    company: "any",
    location: "",
    employment_type: "any",
    datePosted: "newest",
  })

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);

  
  const loadingMore = useRef(false)
  const lastQueryRef = useRef("");
  const debounceRef = useRef(null);

  const initialLoadDone = useRef(false)

  // on mount: load filters from db if there is some
  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("/api/filter-settings", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const serverFilters = data
      setFilters(f => ({...f, ...serverFilters}))
      initialLoadDone.current = true
    })
    .catch(() => {
      initialLoadDone.current = true
    })
  }, [])

  // save filters
  useEffect(() => {
    if (!initialLoadDone.current) return
    const token = localStorage.getItem("token")
    fetch("/api/filter-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(filters)
    })
  }, [filters])
  
  
  // ----------------------------
  // fetch jobs from server
  // fetchJobs accepts limit, offset, and search query
  const fetchJobs = useCallback(async (limit = 20, offset = 0, query = "", filters = {}) => {
    try {
      if (offset === 0) {
        setLoading(true);
        setError(null);
      }

      const token = localStorage.getItem("token");

      const params = new URLSearchParams()
      params.set("limit", limit)
      params.set("offset", offset)

      if (query.trim()) params.set("search", query.trim())
      if (filters.company && filters.company !== "any") params.set("company", filters.company)
      if (filters.location?.trim()) params.set("location", filters.location.trim())
      if (filters.employment_type && filters.employment_type !== "any") params.set("employment_type", filters.employment_type)
      if (filters.datePosted) params.set("sort", filters.datePosted === "newest"? "date_posted:desc" : "date_posted:asc")
      
      const url = `/api/jobs?${params.toString()}`;
      const response = await fetch(url, {
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

  // ----------------------------
  // Initial load + search/filters debounce

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      lastQueryRef.current = searchQuery

      const {items, total} = await fetchJobs(50, 0, searchQuery, filters)
      setJobs(items)
      setTotalJobs(total)
    }, 300)
    return () => {
      clearTimeout(debounceRef.current)
    }
  }, [searchQuery, filters, fetchJobs])

    // helper used by retry button and explicit reload
  const reloadInitialJobs = useCallback(async (query = "") => {
    const { items, total } = await fetchJobs(20, 0, searchQuery, filters);
    setJobs(items);
    setTotalJobs(total);
  }, [fetchJobs]);

// ----------------------------
// Infinite scroll
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
        const { items } = await fetchJobs(20, jobs.length, lastQueryRef.current, filters);
        if (items.length > 0) setJobs(prev => [...prev, ...items]);
      } finally {
        loadingMore.current = false;
      }
    }
  };

  scrollable.addEventListener("scroll", handleScroll);
  return () => scrollable.removeEventListener("scroll", handleScroll);
}, [jobs.length, totalJobs, filters, fetchJobs]);

  // ----------------------------
  // Clear search
  const clearSearch = () => setSearchQuery("")

  //------------------------------------
  // new filter state
  const handleFilterChange = (key, value) => {
    setFilters((f) => ({...f, [key]: value}))
  }

  const companyOptions = useMemo(() => {
        const uniq = Array.from(
          new Set((jobs || [])
          .map((j) => (typeof j.company === "string" ? j.company.trim() : ""))
          .filter(Boolean)
          )
        )
        return [
          {value: "any", label: "All companies"},
          ...uniq.map((label) => ({value: label.toLowerCase(), label}))
        ]
  }, [jobs])

  return (

    <section className={styles.jobSection}>
      <div className = {styles.searchAndFiltersRow}>
        <div className={styles.filterBar} role="region" aria-label="Job filters">
          <select
            className={styles.filterControl}
            value={filters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
          >
            {(companyOptions || []).map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            className={styles.filterControl}
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
          <select
            className = {styles.filterControl}
            value={filters.employment_type}
            onChange={(e) => handleFilterChange("employment_type", e.target.value)}
          >
            <option value="any">Any</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <select
            className={styles.filterControl}
            value={filters.datePosted}
            onChange={(e) => handleFilterChange("datePosted", e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setFilters({company: "any", location: "", employment_type: "any", datePosted: "newest"})}
          >
            <MdClose/>
          </button>
        </div>
        <form 
          // ref = {containerRef}
          className={styles.searchContainer} 
          onSubmit={(e) => e.preventDefault()} 
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
        </form>
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
          
          {/* Empty / Job display (use filteredJobs) */}
          {!loading && jobs.length > 0 && (
            <>
              {jobs.map((job, idx) => (
                <JobCard key={job.id || idx} job={job} onClick={() => onJobClick(job)} />
              ))}
            </>
          )}
          {!loading && !error && jobs.length === 0 && (
            <div className={styles.emptyState}>
              <p>No jobs match the filters.</p>
            </div>
          )}
      </div>
    </section>

  )
}

export default JobsList