// UserDashboard.jsx
import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PersonalizedNavbar from "../components/PersonalizedNavbar";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  // ✅ logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    alert("You have been logged out due to inactivity.");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    let timer;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logout, 30000); // 30s inactivity
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [logout]);

  // ✅ Handle token + username from query params
  useEffect(() => {
    const token = searchParams.get("token");
    const queryUsername = searchParams.get("username");

    if (token) {
      localStorage.setItem("token", token);
    }

    // 🚀 Clean URL: remove ?token=...&username=...
    if (queryUsername) {
      navigate(`/${queryUsername}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <PersonalizedNavbar />
      <h1>Welcome to Your Dashboard, {username} 👋</h1>
    </div>
  );
};

export default UserDashboard;
