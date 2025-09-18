// LoginPage.jsx
// This component renders the login page for HireHub, including branding, login form, and info section.
import React from "react";
import "./login_Page.css";
import { Link } from 'react-router-dom';
import {GoogleLogin} from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const LoginPage = () => {

    // Called when Google login succeeds.
  const handleSuccess = (credentialResponse) => {
    // credentialResponse.credential is a JWT token (signed by Google)
    const token = credentialResponse?.credential;
    if (!token) {
      console.error("No credential returned from Google");
      return;
    }

    // Decode the JWT to get basic profile info (email, name, picture)
    const user = jwt_decode(token);
    console.log("Decoded user:", user);


    // Save minimal user info locally (for demo). In production, you'd send the token to your backend.
    localStorage.setItem("user", JSON.stringify({
      name: user.name,
      email: user.email,
      picture: user.picture,
      sub: user.sub, // Google's unique user id
    }));

    // Example: send token to your backend to verify and create a session
    // fetch("/api/auth/google", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ credential: token }) })
    //   .then(res => res.json()).then(data => console.log("Server response:", data));
  };

  const handleError = () => {
    console.error("Google login failed or was cancelled.");
  };


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

            {/* Google login button (provided by @react-oauth/google) */}
            <div style={{ marginTop: 10 }}>
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </div>

            {/* GitHub login button */}
            <div style={{ marginTop: 10 }}>
            <button
              onClick={() => window.location.href = "http://127.0.0.1:5000/login/github"}
              className="github-btn"
            >
              Sign in with GitHub
            </button>
            </div>


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
