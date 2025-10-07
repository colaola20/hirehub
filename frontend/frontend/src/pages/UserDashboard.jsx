import React, { useEffect, useCallback,useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./dashBoard.module.css";
import NavBar from "../components/PersonalizedNavbar.jsx";
import JobCard from "../components/JobCard.jsx";




const UserDashboard = () => {
    const navigate = useNavigate();
    // const { username } = useParams();
    const [searchParams] = useSearchParams();

    const [jobs, setJobs] = useState([]);
    const [preloadedJobs, setPreloadedJobs] = useState([]);
    const [page, setPage] = useState(1);

    const jobsPerPage = 10;
    const totalJobs = jobs.length + preloadedJobs.length;
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    


  // Handle token + username from query params
  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");

    if (token) localStorage.setItem("token", token);

    if (username) navigate(`/${username}`, { replace: true });
  }, [searchParams, navigate]);

const fetchJobs = async (limit = 10, offset = 0) => {
  try {
    const response = await fetch(`http://localhost:5001/api/jobs?limit=${limit}&offset=${offset}&preload=10`);
    const data = await  response.json();
    if (data.status === 'success') {
      console.log("Jobs fetched:", data.current); // debug
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
    console.log("Jobs to render:", initialJobs);
    setJobs(initialJobs.slice(0, 10));
    setPreloadedJobs(initialJobs.slice(10, 20));
  };
  loadInitialJobs();
}, []);

const handlePageChange = async (newPage) => {
  const offset = (newPage - 1) * jobsPerPage;
  const newJobs = await fetchJobs(jobsPerPage, offset);

  setJobs(newJobs);
  setPage(newPage);
};


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
        <NavBar/>
      <div className={styles["dashboard-wrapper"]}>
        <div className={styles["dashboard-container"]}>
          {/* Left Column: Job Cards */}
          <div className={styles["jobs-column"]}>
             {console.log("Jobs to render:", jobs)}
            {jobs.map((job, idx) => (
              <JobCard key={idx} job={job} />
            ))}


            {/* Buttons at the bottom to change pages */}
            <div className={styles.pagination}>
              <button onClick={() => handlePageChange(Math.max(page - 1, 1))}>{'<'}</button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => handlePageChange(Math.min(page + 1, totalPages))}>{'>'}</button>
            </div>
          </div>
        </div>
      </div>
        </>
);
};

export default UserDashboard;