import { useEffect, useCallback, useState, useRef } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import styles from "./dashBoard.module.css";
import PersonalizedNavbar from "../components/PersonalizedNavbar.jsx";
import SideBar  from "../components/sideBar.jsx";
import ChatBot from "../components/ChatBot.jsx";
import JobDetailsModal from "../components/JobDetailsModal.jsx";





const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const [selectedJob, setSelectedJob] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalJobs, setTotalJobs] = useState(0)

  const loadingMore = useRef(false)

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

  // Logout due to users inactivity

  const AUTO_LOGOUT_TIME = 10 * 60 * 1000 // 10 minutes
  const WARNING_TIME = 60 * 1000 // 1 min before logout
  // const AUTO_LOGOUT_TIME = 30 * 1000 // 30 sec for testing
  // const WARNING_TIME = 15 * 1000 // 1 min before logout
  

  const timerRef = useRef(null);
  const warningRef = useRef(null)

  // ✅ logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)

    warningRef.current = setTimeout(() => {
      toast.warn(
        <div>
          "You will be logged out in 1 min due to inactivity."
          <button onClick={resetTimer} style={{marginLeft:"10px"}}>Stay Logged In</button>
        </div>, {autoClose: 5000})
    }, AUTO_LOGOUT_TIME - WARNING_TIME)

    timerRef.current = setTimeout(logout, AUTO_LOGOUT_TIME)
  }, [logout])

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"]
    events.forEach((event) => window.addEventListener(event, resetTimer))

    resetTimer()
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [resetTimer]);




 return (
    <>
      <ToastContainer position="top-right" />
      <div className={styles["dashboard-screen-wrapper"]}>
        <PersonalizedNavbar />
        <SideBar />
        <input
          type="text"
          placeholder="Search jobs..."
          className={styles.searchInput}
        />

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
                <div className={styles["error-state"]}>
                  <p>{error}</p>
                  <button onClick={reloadInitialJobs} className="retry-btn">
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && jobs.length === 0 && (
                <div className="empty-state">
                  <p>No jobs found. Check back later!</p>
                </div>
              )}

              {/* Job display */}
              {!loading && jobs.length > 0 &&
                jobs.map((job, idx) => (
                  <div
                    key={job.id || idx}
                    onClick={() => setSelectedJob(job)}
                    style={{ cursor: "pointer" }}
                  >
                    <JobCard job={job} />
                  </div>
                ))}
            </div>
            {/* Right Column: Chatbot (optional) */}
            {/* <div className="chat-column">
              <h2>Chatbot Coming Soon</h2>
            </div> */}
          </div>
        </div>

        {/* Job details modal (render outside of columns) */}
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </>
  );
};

export default UserDashboard;