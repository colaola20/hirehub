import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PersonalizedNavbar from "../components/PersonalizedNavbar";

import "./dashBoard.css";
import JobCard from "../components/JobCard.jsx";

const sampleJobs = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    location: "New York, NY",
    salary: "$80,000 - $100,000",
    description: "Build amazing web apps with React and modern JS."
  },
  {
    title: "Backend Engineer",
    company: "DataSys",
    location: "San Francisco, CA",
    salary: "$90,000 - $120,000",
    description: "Develop APIs, databases, and server-side logic."
  },
  {
    title: "Fullstack Developer",
    company: "InnovateX",
    location: "Remote",
    salary: "$85,000 - $110,000",
    description: "Work on both frontend and backend projects."
  },
  {
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Austin, TX",
    salary: "$70,000 - $95,000",
    description: "Create intuitive user interfaces and experiences."
  },
  {
    title: "DevOps Engineer",
    company: "CloudNet",
    location: "Seattle, WA",
    salary: "$100,000 - $130,000",
    description: "Automate deployments and manage cloud infrastructure."
  }
];


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

    <div>
      <PersonalizedNavbar />

      <>
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(page-1)}
                        disabled={page === 1}
                        className="pagination-btn"
                      >
                        {'<'}
                      </button>
                      <span className="page-info">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(page+1)}
                        disabled={page === totalPages}
                        className="pagination-btn"
                      >
                        {'>'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Column: Chatbot */}
            {/* <div className="chat-column">
              <h2>Chatbot Coming Soon </h2>
            </div> */}
        </div>
      </>

    </div>

  );
};

export default UserDashboard;
