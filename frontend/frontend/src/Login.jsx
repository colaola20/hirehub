// LoginPage.jsx
// This component renders the login page for HireHub, including branding, login form, and info section.
import React from "react";
import "./login_Page.css";
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side: Login Form and Branding */}
        <div className="login-form-section">
          {/* Branding */}
          <div className="brand">
    <div className="logo">H</div>
    <div className="brand-text">
      <h2 className="brand-title">ireHub</h2>
      <p className="brand-tagline">Your AI Career Companion</p>
    </div>
  </div>

         

          {/* Login form */}
          <form className="login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />

            <button type="submit" className="login-btn">Login</button>

            <button type="button" className="google-btn">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
              />
              Continue with Google
            </button>
          </form>

          {/* Options below form */}
          <div className="login-options">
            <a href="#">Forgot Password?</a>
          </div>

          {/* Proper paragraph for register */}
          <p className="no-account">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="login-info-section">
          <h1>Smarter Job Applications</h1>
          <p>
            Tailor your resume & cover letter instantly with AI to land your
            dream job faster.
          </p>
          <div className="illustration">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
              alt="AI Assistant"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
