// UserDashboard.jsx
import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PersonalizedNavbar from "../components/PersonalizedNavbar";

const UserDashboard = () => {
  const navigate = useNavigate();

  // ✅ logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token"); // clear token/session
    alert("You have been logged out due to inactivity.");
    navigate("/login"); // redirect to login page
  }, [navigate]);

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logout, 10000); // 10 seconds (change to 30,000 for 30s)
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer(); // start timer on mount

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [logout]);

  return (
    <div>
      <PersonalizedNavbar />
      <h1>Welcome to Your Dashboard</h1>
    </div>
  );
};

export default UserDashboard;
