import { useEffect, useCallback, useState, useRef } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";


import styles from "./dashBoard.module.css";
import PersonalizedNavbar from "../components/PersonalizedNavbar.jsx";
import SideBar  from "../components/sideBar.jsx";
import ChatBot from "../components/ChatBot.jsx";
import JobDetailsModal from "../components/JobDetailsModal.jsx"; 
import JobCard from "../components/JobCard.jsx";





const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const [showLiked, setShowLiked] = useState(false);
   const [selectedJob, setSelectedJob] = useState(null);
   const [likedJobs, setLikedJobs] = useState([]);


   const handleJobClick = (job) => {
    setSelectedJob(job); // open modal
  }
    const closeModal = () => {
    setSelectedJob(null); // close modal
  }

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


  // Fetch liked jobs
const fetchLikedJobs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const favoriteJobs = res.data.favorites.map(fav => ({
      ...fav.job,
      dateLiked: fav.created_at,
    }));

    console.log("Fetched liked jobs:", favoriteJobs); 
    setLikedJobs(favoriteJobs);
  } catch (err) {
    console.error("Failed to fetch liked jobs:", err);
  }
};

  const handleShowLiked = () => {
    setShowLiked(true);
    fetchLikedJobs();
  };

  const handleShowRecommended = () => {
    setShowLiked(false);
  };





  return (
    <>
      <ToastContainer position="top-right" />
      <div className={styles["dashboard-screen-wrapper"]}>
        <PersonalizedNavbar  onShowLiked={handleShowLiked} onShowRecommended={handleShowRecommended} />
        <div className={styles["dashboard-wrapper"]}>
          <SideBar/>
          <main className={styles["dashboard-container"]} role="main">
            <div className={styles["main-content"]}>
              {showLiked && likedJobs.length > 0 ? (
                likedJobs.map(job => (
                  <JobCard key={job.id} job={job} cardForLikedJobs={true} />
                ))
              ) : showLiked ? (
                <p>No liked jobs yet.</p>
              ) : (
                <Outlet context={{ onJobClick: handleJobClick }} />
              )}
           </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {selectedJob && <JobDetailsModal job={selectedJob} onClose={closeModal} />}
    </>
  )
};


export default UserDashboard