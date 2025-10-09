// ForgotPassword.jsx
import React, { useState } from "react";
import styles from "./forgot_password.module.css";   // ⬅️ use module
import { Link } from "react-router-dom";
import placeholderImg from "../assets/login_reg_Place_holder1.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("✅ Password reset link sent to your email. Please check your inbox.");
        setEmail("");
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending reset request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["register-box"]}>
        {/* Left Side: Form */}
        <div className={styles["register-form-section"]}>
          {/* Branding */}
          <div className={styles["brand"]}>
            <div className={styles["logo"]}>H</div>
            <div className={styles["brand-text"]}>
              <h2 className={styles["brand-title"]}>ireHub</h2>
              <p className={styles["brand-tagline"]}>Your AI Career Companion</p>
            </div>
          </div>

          {/* Forgot Password Form */}
          <form className={styles["register-form"]} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" className={styles["register-btn"]} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className={styles["have-account"]}>
            <span style={{ color: "black" }}>Remembered your password?</span>{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Side */}
        <div className={styles["register-info-section"]}>
          <h1>Forgot Your Password?</h1>
          <p>
            Don’t worry! Enter your email and we’ll send you a secure link to
            reset your password. The link will expire for your safety.
          </p>
          <div className={styles["illustration"]}>
            <img src={placeholderImg} alt="Password Reset" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
