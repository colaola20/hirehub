// LoginPage.jsx
import React from "react";
import "./login_Page.css";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side (Form) */}
        <div className="login-form-section">
          <div className="brand">
            <div className="logo">H</div>
            <div>
              <h2>HireHub</h2>
              <p>Your AI Career Companion</p>
            </div>
          </div>

          <form className="login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="login-btn">
              Login
            </button>
            <button type="button" className="google-btn">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
              />
              Continue with Google
            </button>
          </form>

          <div className="login-options">
            <a href="#">Forgot Password?</a>
            <a href="#">Sign up</a>
          </div>
          <p className="no-account">
            Don’t have an account? <a href="#">VSo</a>
          </p>
        </div>

        {/* Right Side (Illustration + Text) */}
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
