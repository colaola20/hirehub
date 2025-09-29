// ForgotPassword.jsx
import React, { useState } from "react";
import "./login_Page.css"; // reuse same CSS
import { Link } from "react-router-dom";
import placeholderImg from "../assets/login_reg_Place_holder1.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password reset link sent to your email.");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending reset request:", error);
    }
  };

  return (
    <div className="container">
      <div className="register-box">
        {/* Left Side: Form */}
        <div className="register-form-section">
          {/* Branding */}
          <div className="brand">
            <div className="logo">H</div>
            <div className="brand-text">
              <h2 className="brand-title">ireHub</h2>
              <p className="brand-tagline">Your AI Career Companion</p>
            </div>
          </div>

          {/* Forgot Password Form */}
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="register-btn">
              Send Reset Link
            </button>
          </form>

          <p className="have-account">
            <span style={{ color: "black" }}>Remembered your password?</span>{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="register-info-section">
          <h1>Forgot Your Password?</h1>
          <p>
            Don’t worry! Enter your email and we’ll send you a secure link to
            reset your password.
          </p>
          <div className="illustration">
            <img src={placeholderImg} alt="Password Reset" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
