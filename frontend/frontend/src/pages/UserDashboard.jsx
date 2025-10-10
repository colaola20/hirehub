import { useEffect, useCallback, useState, useRef } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import styles from "./dashBoard.module.css";
import PersonalizedNavbar from "../components/PersonalizedNavbar.jsx";
import SideBar  from "../components/sideBar.jsx";
import ChatBot from "../components/ChatBot.jsx";




const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

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
        <div className={styles["dashboard-wrapper"]}>
          <div>
            <SideBar/>
          </div>

          <main className={styles["dashboard-container"]} role="main">
            <div className = {styles["main-content"]}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
};


export default UserDashboard