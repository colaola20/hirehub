// LoginPage.jsx
// This component renders the login page for HireHub, including branding, login form, and info section.
<<<<<<< HEAD
import React from "react";
import "./login_Page.css";
import { Link } from 'react-router-dom';
=======
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // ⬅ import useNavigate
import "./login_Page.css";
>>>>>>> origin/JPR
import jwt_decode from "jwt-decode";
import githubLogo from "../assets/github.png";
import linkedinLogo from "../assets/linkedin.png";
import googleLogo from "../assets/google.png";
<<<<<<< HEAD
import {useState} from 'react';
=======
import placeholderImg from "../assets/login_reg_Place_holder1.png";
import Navbar from '../components/Navbar'
>>>>>>> origin/JPR

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD

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


  return (
    <div className="container">
=======
  const navigate = useNavigate(); // ⬅ initialize navigate
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username')
    const error = searchParams.get('error')

    if (error) {
      alert(`OAuth login failed: ${error}`)
      return
    }

    if (token && username) {
      localStorage.setItem("token", token)
      console.log("OAuth login successful, redirecting to:", `/${username}`)
      navigate(`/${username}`)
    }
  }, [searchParams, navigate])

 const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // 🔹 match backend
      });

      const data = await response.json();

      if (response.ok) {
        // Flask sends "access_token", not "token"
        localStorage.setItem("token", data.access_token);

        try {
          const decoded = jwt_decode(data.access_token);
          console.log("Decoded JWT:", decoded);

          const username = data.data?.username;
          console.log(username)
          if (username) {
            navigate(`/${username}`);
          } else {
            navigate("/")
          }
        } catch (err) {
          console.warn("Failed to decode token:", err);
          navigate("/")
        }

        console.log("Login successful:", data);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Backend not available:", error);
      navigate("/home"); // fallback while backend isn’t ready
    }
  };

  return (
    <div className="container">
      <Navbar/>
>>>>>>> origin/JPR
      <div className="login-box">
        {/* Left Side: Login Form and Branding */}
        <div className="login-form-section">
          {/* Branding */}
          <div className="brand">
<<<<<<< HEAD
    <div className="logo">H</div>
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
                {/* Google login button */}
              <button className={"google-btn"} onClick={() => window.location.href = "http://127.0.0.1:5000/login/google"}>
                <img src={googleLogo} alt="Google logo" className="Buttonlogo" />
              </button>
              {/*/!* GitHub login button *!/*/}
              <button className="github-btn" onClick={() => window.location.href = "http://127.0.0.1:5000/login/github"} >
                <img src={githubLogo} alt="GitHub logo" className="Buttonlogo"/>
              </button>
            {/* Linkedin login button */}
              <button className="linkedIn-btn" onClick={() => window.location.href = "http://127.0.0.1:5000/login/linkedin"} >
                <img src={linkedinLogo} alt="LinkedIn logo" className="Buttonlogo"/>
              </button>

            </div>


=======
            <div className="logo">H</div>
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

            <button type="submit" className="login-btn">
              Login
            </button>

            <div style={{ color: "black", padding: "0 0 0 20px " }}>
              or login with
            </div>
            <div className={"buttons-wrapper"}>
              {/* Google login button */}
              <button
                type="button"
                className={"google-btn"}
                onClick={() =>
                  (window.location.href = "http://127.0.0.1:5001/api/login/google")
                }
              >
                <img
                  src={googleLogo}
                  alt="Google logo"
                  className="Buttonlogo"
                />
              </button>

              {/* GitHub login button */}
              <button
                type="button"
                className="github-btn"
                onClick={() =>
                  (window.location.href = "http://127.0.0.1:5001/api/login/github")
                }
              >
                <img
                  src={githubLogo}
                  alt="GitHub logo"
                  className="Buttonlogo"
                />
              </button>

              {/* Linkedin login button */}
              <button
                type="button"
                className="linkedIn-btn"
                onClick={() =>
                  (window.location.href = "http://127.0.0.1:5001/api/login/linkedin")
                }
              >
                <img
                  src={linkedinLogo}
                  alt="LinkedIn logo"
                  className="Buttonlogo"
                />
              </button>
            </div>
>>>>>>> origin/JPR
          </form>

          {/* Options below form */}
          <div className="login-options">
<<<<<<< HEAD
            <a href="#">Forgot Password?</a>
=======
            <Link to="/forgot_password">Forgot Password?</Link>
>>>>>>> origin/JPR
          </div>

          {/* Proper paragraph for register */}
          <p className="no-account">
<<<<<<< HEAD
            <span style={{color:"black"}}>Don’t have an account?</span> <Link to="/registration">Sign up</Link>
=======
            <span style={{ color: "black" }}>Don’t have an account?</span>{" "}
            <Link to="/registration">Sign up</Link>
>>>>>>> origin/JPR
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
<<<<<<< HEAD
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
              alt="AI Assistant"
            />
=======
            <img src={placeholderImg} alt="AI Assistant" />
>>>>>>> origin/JPR
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
