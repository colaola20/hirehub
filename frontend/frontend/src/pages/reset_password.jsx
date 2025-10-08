// ResetPassword.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import styles from "./reset_password.module.css";
import placeholderImg from "../assets/login_reg_Place_holder1.png";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Password has been reset. Please login.");
        navigate("/login");
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles["register-box"]}>
        {/* Left Side: Form */}
        <div className={styles["register-form-section"]}>
          {/* Branding */}
          <div className={styles.brand}>
            <div className={styles.logo}>H</div>
            <div className={styles["brand-text"]}>
              <h2 className={styles["brand-title"]}>ireHub</h2>
              <p className={styles["brand-tagline"]}>Reset Your Password</p>
            </div>
          </div>

          {/* Reset Password Form */}
          <form className={styles["register-form"]} onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" className={styles["register-btn"]} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className={styles["have-account"]}>
            <span style={{ color: "black" }}>Remembered your password?</span>{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Side */}
        <div className={styles["register-info-section"]}>
          <h1>Set a New Password</h1>
          <p>
            Enter a strong, unique password and confirm it. Once saved, you’ll
            be able to sign in to your account with your new credentials.
          </p>
          <div className={styles.illustration}>
            <img src={placeholderImg} alt="Reset Password" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
