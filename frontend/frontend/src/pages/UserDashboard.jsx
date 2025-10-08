import React, { useEffect, useCallback,useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./dashBoard.module.css";
import NavBar from "../components/PersonalizedNavbar.jsx";
import JobCard from "../components/JobCard.jsx";
import SideBard  from "../components/sideBar.jsx";
import ChatBot from "../components/ChatBot.jsx";



const UserDashboard = () => {
    const navigate = useNavigate();
    // const { username } = useParams();
    const [searchParams] = useSearchParams();

    const [jobs, setJobs] = useState([]);
    const [preloadedJobs, setPreloadedJobs] = useState([]);


    


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


  // // ✅ Block access if token is missing
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

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


 return (
     <>
     <div className={styles["dashboard-screen-wrapper"]}>
        <SideBard/>
        
        <input type="text"  placeholder="Search jobs..." className={styles.searchInput}/>
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-container"]}>
          {/* Left Column: Job Cards */}
          <div className={styles["jobs-column"]}>
             {console.log("Jobs to render:", jobs)}
            {jobs.map((job, idx) => (
              <JobCard key={idx} job={job} />
            ))}


            {/* Buttons at the bottom to change pages */}
            {/*<div className={styles.pagination}>*/}
            {/*  <button onClick={() => handlePageChange(Math.max(page - 1, 1))}>{'<'}</button>*/}
            {/*  <span>Page {page} of {totalPages}</span>*/}
            {/*  <button onClick={() => handlePageChange(Math.min(page + 1, totalPages))}>{'>'}</button>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
         <ChatBot />
    </div>
     </>
);
};

export default UserDashboard;