import { useEffect, useCallback, useState, useRef } from "react";
import { Outlet, useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";


import styles from "./dashBoard.module.css";
import style from "./JobsList.module.css";
import PersonalizedNavbar from "../components/PersonalizedNavbar.jsx";
import SideBar  from "../components/sideBar.jsx";
import ChatBot from "../components/ChatBot.jsx";
import JobCard from "../components/JobCard.jsx";
import AppliedJobs from "../components/AppliedJobs.jsx";
import RecommendationPending from "../components/UsersMessages/RecommendationPending.jsx";


const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const [showLiked, setShowLiked] = useState(false);
  const [showApplied, setShowApplied] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [likedJobs, setLikedJobs] = useState([]);

  const location = useLocation();

  const handleJobClick = useCallback((job) => {
    try {
      localStorage.setItem("job_dashboard_payload", JSON.stringify(job));
    } catch (e) {
      console.warn("Could not store job payload:", e);
    }

    navigate("/job_dashboard"); // same tab navigation
  }, [navigate]);



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
      let items = data.current || [];

      return {
        items,
        total: data.total || 0,
      };
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setError('Failed to load jobs. Please try again.');
      return { items: [], total: 0 };
    } finally {
      if (offset === 0) setLoading(false);
    }
  }, []);


    // Fetch liked jobs
  const fetchLikedJobs = useCallback(async () => {
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
  }, []);

  const fetchRecommendedJobs = useCallback(async () => {
  const token = localStorage.getItem("token");
  console.log("Fetching recommended jobs...");

  try {
    setRecommendedLoading(true);
    setRecommendedError(null);

    //  GET existing recommendations first
    const getRes = await fetch("/api/profile/recommendations", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const getData = await getRes.json();

    if (getRes.ok && getData.recommendations && getData.recommendations.length > 0) {
      setRecommendedJobs(getData.recommendations); // update state if there are jobs
    } else {
      setRecommendedJobs([]); 
    }

    // After a few seconds → silently update backend recommendations
    setTimeout(async () => {
      try {
        await fetch("/api/profile/generate_recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
      } catch (err) {
        console.warn("Background recommendation refresh failed", err);
      }
    }, 3000); 

  } catch (err) {
    console.error("Error loading recommended jobs:", err);
    setRecommendedError(err.message);
  } finally {
    setRecommendedLoading(false);
  }
}, []);



  const handleShowLiked = () => {
    setShowLiked(true);
    setShowApplied(false);
    setShowRecommended(false);
    fetchLikedJobs();
  };

  const handleShowRecommended = () => {
    setShowRecommended(true);
    setShowLiked(false);
    setShowApplied(false);
    fetchRecommendedJobs();
  };

  const handleShowApplied = () => {
    setShowApplied(true);
    setShowLiked(false);
    setShowRecommended(false);
    
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className={styles["dashboard-screen-wrapper"]}>
        <PersonalizedNavbar  onShowLiked={handleShowLiked} onShowRecommended={handleShowRecommended} onShowApplied={handleShowApplied} />
        <div className={styles["dashboard-wrapper"]}>
          <SideBar 
            showRandomJob={fetchJobs}
            onReset = {() => {
              setShowLiked(false);
              setShowApplied(false);
              setShowRecommended(false)
             
            }}
          />
          <main className={styles["dashboard-container"]} role="main">
              <div className={styles["main-content"]}>
                <div className={style.cardList}>
                {showLiked ? (
                  likedJobs.length > 0 ? (
                    likedJobs.map((job) => (
                       <div className={style.theCardContainer}>
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        cardForLikedJobs={true} 
                        onClick={handleJobClick} 
                      />
                      </div>
                    ))
                  ) : (

                    <div className={styles.wrapper}>
                      <h2 className={styles.title}>No liked jobs yet</h2>
                      <p className={styles.subtitle}>Start exploring and liking jobs to see them here!</p>
                    </div>

                  )
                ) : showApplied ? (
                  <AppliedJobs />
                ) : showRecommended ? (
                  recommendedLoading ? (
                    <p style={{ color: "white", textAlign: "center" }}>Loading recommendations...</p>
                  ) : recommendedError ? (
                    <p style={{ color: "red", textAlign: "center" }}>Error: {recommendedError}</p>
                  ) : recommendedJobs.length > 0 ? (
                    recommendedJobs.map((rec) => {
                      if (!rec.job) return null;
                      return (
                         <div className={style.theCardContainer}>
                        <JobCard
                          key={rec.id}
                          job={rec.job}
                          recommendation={rec}
                          cardForRecommendedJobcard={true}
                          onClick={handleJobClick}
                        />
                        </div>
                      );
                    })
                  ) : (

                   <RecommendationPending />

                  )
                ) : (
                  <Outlet context={{ onJobClick: handleJobClick, fetchJobs }} />
                )}
                </div>
              </div>
          </main>
        </div>
      </div>

      
    </>
  )
};


export default UserDashboard