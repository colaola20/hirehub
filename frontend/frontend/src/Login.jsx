// LoginPage.jsx
// This component renders the login page for HireHub, including branding, login form, and info section.
import React from "react";
// Import the CSS file for styling the login page
import "./login_Page.css";

// LoginPage functional component
const LoginPage = () => {
  // The return statement contains the JSX for the login page layout
  return (
    <div className="login-container"> {/* Main container for the login page */}
      <div className="login-box"> {/* Box containing both sections */}
        {/* Left Side: Login Form and Branding */}
        <div className="login-form-section">
          {/* Branding section with logo and app name */}
          <div className="brand">
            <div className="logo">H</div> {/* Logo icon */}
            <div>
              <h2>HireHub</h2> {/* App name */}
              <p>Your AI Career Companion</p> {/* Tagline */}
            </div>
          </div>

          {/* Login form for user credentials */}
          <form className="login-form">
            {/* Email input field */}
            <input type="email" placeholder="Email" required />
            {/* Password input field */}
            <input type="password" placeholder="Password" required />
            {/* Login button */}
            <button type="submit" className="login-btn">
              Login
            </button>
            {/* Google login button */}
            <button type="button" className="google-btn">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
              />
              Continue with Google
            </button>
          </form>

          {/* Options for password recovery and sign up */}
          <div className="login-options">
            <a href="#">Forgot Password?</a>
            <a href="#">Sign up</a>
          </div>
          {/* Message for users without an account */}
          <p className="no-account">
            Dont have an account? <a href="#">VSo</a>
          </p>
        </div>

        {/* Right Side: Info and Illustration */}
        <div className="login-info-section">
          <h1>Smarter Job Applications</h1> {/* Info headline */}
          <p>
            Tailor your resume & cover letter instantly with AI to land your
            dream job faster.
          </p>
          <div className="illustration"> {/* Placeholder for illustration */}
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
