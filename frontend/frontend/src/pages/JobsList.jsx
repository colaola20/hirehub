import { useEffect, useCallback, useState, useRef, useMemo, useLayoutEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

import styles from "./JobsList.module.css";
import JobCard from "../components/JobCard.jsx";
import { MdClose } from "react-icons/md";
// import { MdSearch } from 'react-icons/md';

const JobsList = () => {

  const outlet = useOutletContext() || {}
  const { onJobClick = () => {}} = outlet
  const scrollTarget = useRef(0);

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


  const listRef = useRef(null);

  const isRestoring = useRef(false);

  // on mount: load filters from db if there is some AND List State from SessionStorage on Mount
  useEffect(() => {
    const restoreState = async () => {
      // 1. Restore Filters from DB
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/filter-settings", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });
        // optional: merge logic here if needed
      } catch (e) { console.warn(e) }

      // 2. CHECK SESSION STORAGE
      const savedState = sessionStorage.getItem("jobs_list_cache");
      
      if (savedState) {
        const parsed = JSON.parse(savedState);
        const isFresh = (Date.now() - parsed.timestamp) < 1000 * 60 * 30; 

        if (isFresh) {
            console.log("Restoring job list state...");
            isRestoring.current = true; 
            
            // Store the target scroll position in a Ref (don't scroll yet!)
            // scrollTarget.current = parsed.scrollTop; 

            scrollTarget.current = 10;

            setJobs(parsed.jobs);
            setTotalJobs(parsed.totalJobs);
            setSearchQuery(parsed.searchQuery);
            setFilters(parsed.filters);
            lastQueryRef.current = parsed.searchQuery;
            
            setLoading(false); // This triggers the re-render
            return; 
        }
      }
      
      // If no cache, allow normal fetching behavior
      // (This requires a small tweak to your debounce effect to ensure it runs if not restoring)
    };

    restoreState();
  }, []);


// Save State to SessionStorage on Unmount
useEffect(() => {
  return () => {
    // This function runs when you navigate AWAY
    // Check listRef.current here, right before unmount
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

    const currentState = {
      jobs,
      totalJobs,
      searchQuery,
      filters,
      scrollTop: currentScrollTop, 
      timestamp: Date.now()
    };
    
    // Only save if we actually have jobs
    if (jobs.length > 0) {
      sessionStorage.setItem("jobs_list_cache", JSON.stringify(currentState));
    }
  };
}, [jobs, totalJobs, searchQuery, filters]); // Dependencies ensure we have latest state

  // save filters
useEffect(() => {
    if (isRestoring.current) return;

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

    if (isRestoring.current) {
        
        setTimeout(() => { isRestoring.current = false; }, 500);
        return; 
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      lastQueryRef.current = searchQuery

      const { items, total } = await fetchJobs(50, 0, searchQuery, filters)
      setJobs(items)
      setTotalJobs(total)
    }, 300)
    return () => {
      clearTimeout(debounceRef.current)
    }
  }, [searchQuery, filters, fetchJobs])

  const reloadInitialJobs = useCallback(async (query = "") => {
    const { items, total } = await fetchJobs(20, 0, searchQuery, filters);
    setJobs(items);
    setTotalJobs(total);
  }, [fetchJobs]);

// ----------------------------
// Infinite scroll
// infinite scroll
// Infinite scroll
useEffect(() => {
  // ✅ Use listRef.current instead of document.querySelector
  const scrollable = listRef.current; 
  
  if (!scrollable) return;

  const handleScroll = () => {
    // 1. Calculate if we are at the bottom
    const scrolledToBottom =
      scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 100;

    // 2. Check conditions: At bottom? Not currently loading? Have more jobs to fetch?
    if (scrolledToBottom && !loadingMore.current && jobs.length < totalJobs) {
      loadingMore.current = true;
      
      // 3. Fetch
      fetchJobs(20, jobs.length, lastQueryRef.current, filters)
        .then(({ items }) => {
           if (items.length > 0) {
             setJobs(prev => [...prev, ...items]);
           }
        })
        .finally(() => {
           loadingMore.current = false;
        });
    }
  };

  scrollable.addEventListener("scroll", handleScroll);
  return () => scrollable.removeEventListener("scroll", handleScroll);
}, [jobs.length, totalJobs, filters, fetchJobs]);


//Restore scroll position immediately after DOM paint
  useLayoutEffect(() => {
    // Only run if we aren't loading, we have jobs, and we are explicitly restoring
    if (!loading && isRestoring.current && jobs.length > 0 && listRef.current) {
      
      console.log("Applying scroll position:", scrollTarget.current);
     // listRef.current.scrollTop = scrollTarget.current;
      
      window.scrollTo({ 
            top: scrollTarget.current, 
            behavior: 'instant' // Use instant, not smooth, for restoration
        });

      // Turn off restoring mode after a short delay to allow for any image layout shifts
      setTimeout(() => {
        isRestoring.current = false;
      }, 100);
    }
  }, [loading, jobs]);


  // ----------------------------
  // Clear search
const clearSearch = () => {
      setSearchQuery("");
      sessionStorage.removeItem("jobs_list_cache"); 
  }

  //------------------------------------
  // new filter state
const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    sessionStorage.removeItem("jobs_list_cache"); 
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
      <div className={styles.cardList} ref={listRef}>
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
            <div className={styles.theCardContainer}>
              {jobs.map((job, idx) => (
                <JobCard key={job.id || idx} job={job} onClick={() => onJobClick(job)} />
              ))}
            </div>
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