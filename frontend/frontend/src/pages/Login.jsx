// LoginPage.jsx
// This component renders the login page for HireHub, including branding, login form, and info section.
import React from "react";
import "./login_Page.css";
import { Link } from 'react-router-dom';
import {GoogleLogin} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import githubLogo from "../assets/github.png";
import linkedinLogo from "../assets/linkedin.png";
import googleLogo from "../assets/google.png";
import {useState} from 'react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({email, password}),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Login successful:', data)
        // Redirect to home page
      } else {
        console.error('Login failed:', data.message);
      }

    } catch (error) {
      console.error('Login error:', error);
    }
  };

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
    <div className="container">
      <div className="login-box">
        {/* Left Side: Login Form and Branding */}
        <div className="login-form-section">
          {/* Branding */}
          <div className="brand">
            <div className="logo">
              H
              </div>
            <div className="brand-text">
              <h2 className="brand-title">ireHub</h2>
              <p className="brand-tagline">Your AI Career Companion</p>
            </div>
          </div>

         

          {/* Login form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <button type="submit" className="login-btn">Login</button>

            <div style={{color:"black", padding: "0 0 0 20px "}}>or login with </div>
            <div className={ "buttons-wrapper"}>
                {/* Google login button (provided by @react-oauth/google) */}
              <button className={"google-btn"} onClick={() => window.location.href = "http://127.0.0.1:5000/login/google"}>
                <img src={googleLogo} alt="Google logo" className="Buttonlogo" />
              </button>
              {/*/!* GitHub login button *!/*/}
              <button className="github-btn" onClick={() => window.location.href = "http://127.0.0.1:5000/login/github"} >
                <img src={githubLogo} alt="GitHub logo" className="Buttonlogo"/>
              </button>
            {/*  */}
              <button className="linkedIn-btn" onClick={() => window.location.href = ""} >
                <img src={linkedinLogo} alt="LinkedIn logo" className="Buttonlogo"/>
              </button>

            </div>


          </form>

          {/* Options below form */}
          <div className="login-options">
            <a href="#">Forgot Password?</a>
          </div>

          {/* Proper paragraph for register */}
          <p className="no-account">
            <span style={{color:"black"}}>Don’t have an account?</span> <Link to="/registration">Sign up</Link>
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

export default Login;
