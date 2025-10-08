import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./dashBoard.module.css";
import NavBar from "../components/PersonalizedNavbar.jsx";
import JobCard from "../components/JobCard.jsx";
import SideBard  from "../components/sideBar.jsx";
import ChatBot from "../components/ChatBot.jsx";



const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0)
  const jobsPerPage = 3;

  // Handle token + username from query params
  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");

    if (token) localStorage.setItem("token", token);

    if (username) navigate(`/${username}`, { replace: true });
  }, [searchParams, navigate]);

const fetchJobs = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`http://localhost:5001/api/jobs?limit=${limit}&offset=${offset}&preload=10`);
    const data = await  response.json();
    if (data.status === 'success') {
      return data.current;
    } else {
      console.error("Failed to fetch jobs:", data.message);
      return [];
    }
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
};

useEffect(() => {
  const loadInitialJobs = async () => {
    const initialJobs = await fetchJobs(20, 0);
    setJobs(initialJobs);
  };
  loadInitialJobs();
}, []);

useEffect(() => {
  const handleScroll = async () => {
    const scrollable = document.documentElement;
    const scrolledToBottom =
      scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 100; // 100px buffer

    if (scrolledToBottom) {
      // fetch more jobs if available
      const newJobs = await fetchJobs(20, jobs.length);
      if (newJobs.length > 0) {
        setJobs((prev) => [...prev, ...newJobs]);
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [jobs]);


  // ✅ Block access if token is missing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ logout function
  // const logout = useCallback(() => {
  //   localStorage.removeItem("token");
  //   alert("You have been logged out due to inactivity.");
  //   navigate("/login");
  // }, [navigate]);

  // useEffect(() => {
  //   let timer;
  //   const resetTimer = () => {
  //     if (timer) clearTimeout(timer);
  //     timer = setTimeout(logout, 30000);
  //   };
  //
  //   window.addEventListener("mousemove", resetTimer);
  //   window.addEventListener("keydown", resetTimer);
  //   window.addEventListener("click", resetTimer);
  //
  //   resetTimer();
  //
  //   return () => {
  //     clearTimeout(timer);
  //     window.removeEventListener("mousemove", resetTimer);
  //     window.removeEventListener("keydown", resetTimer);
  //     window.removeEventListener("click", resetTimer);
  //   };
  // }, [logout]);

  // ✅ Handle token + username from query params
  useEffect(() => {
    const token = searchParams.get("token");
    const queryUsername = searchParams.get("username");

    if (token) {
      localStorage.setItem("token", token);
    }

    // ✅ Clean the URL
    if (queryUsername) {
      navigate(`/${queryUsername}`, { replace: true });
    }
  }, [searchParams, navigate]);


  // Fetch jobs function
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      const response = await fetch('/api/jobs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error(`HHTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log(data)
      setJobs(data.jobs || [])
      setTotalJobs(data.total || 0)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      setError('Failed to load jobs. Plaese try again.')

    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchJobs();
    }
  }, [fetchJobs])

  // Calculate pagination based on current jobs
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const currentJobs = jobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  //Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    } 
  }

  return (

    <div className={styles["dashboard-screen-wrapper"]}>
      <PersonalizedNavbar />
      <SideBard/>
      <input type="text"  placeholder="Search jobs..." className={styles.searchInput}/>

      <div className={styles["dashboard-wrapper"]}>
      <div className="dashboard-container">
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
                  <button onClick={fetchJobs} className="retry-btn">Try Again</button>
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && jobs.length === 0 && (
                <div className="empty-state">
                  <p>No jibs found. Check back later!</p>
                </div>
              )}

              {/* Job display */}
              {!loading && jobs.length >0 && (
                <>
                  {currentJobs.map((job, idx) => (
                  <JobCard key={idx} job={job} />
                  ))}

              <div className="pagination">
                <button onClick={() => setPage(p => Math.max(p - 1, 1))}>{'<'}</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))}>{'>'}</button>
              </div>
            </div>

            {/* Right Column: Chatbot */}
            <div className="chat-column">
              <h2>Chatbot Coming Soon </h2>
            </div>
          </div>
        </div>

    </div>
     </div>
);
};

export default UserDashboard;