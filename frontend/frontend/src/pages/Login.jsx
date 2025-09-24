// LoginPage.jsx
// This component renders the login page for HireHub, including branding, login form, and info section.
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ⬅ import useNavigate
import "./login_Page.css";
import jwt_decode from "jwt-decode";
import githubLogo from "../assets/github.png";
import linkedinLogo from "../assets/linkedin.png";
import googleLogo from "../assets/google.png";
import placeholderImg from "../assets/login_reg_Place_holder1.png";
import Navbar from '../components/Navbar'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ⬅ initialize navigate

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
        } catch (err) {
          console.warn("Failed to decode token:", err);
        }

        console.log("Login successful:", data);
        navigate("/home");
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
                  (window.location.href = "http://127.0.0.1:5000/login/google")
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
                  (window.location.href = "http://127.0.0.1:5000/login/github")
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
                  (window.location.href = "http://127.0.0.1:5000/login/linkedin")
                }
              >
                <img
                  src={linkedinLogo}
                  alt="LinkedIn logo"
                  className="Buttonlogo"
                />
              </button>
            </div>
          </form>

          {/* Options below form */}
          <div className="login-options">
            <Link to="/forgot_password">Forgot Password?</Link>
          </div>

          {/* Proper paragraph for register */}
          <p className="no-account">
            <span style={{ color: "black" }}>Don’t have an account?</span>{" "}
            <Link to="/registration">Sign up</Link>
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
            <img src={placeholderImg} alt="AI Assistant" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
