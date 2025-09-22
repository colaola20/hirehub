// RegistrationPage.jsx
// Registration page for HireHub
import React, { useState } from "react";
import "./registration.css"; // separate CSS file
import { Link } from "react-router-dom";
import placeholderImg from "../assets/login_reg_Place_holder1.png";

const RegistrationPage = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account created! You can now login.");
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="register-box">
        {/* Left Side: Registration Form */}
        <div className="register-form-section">
          <div className="brand">
            <div className="logo">H</div>
            <div className="brand-text">
              <h2 className="brand-title">ireHub</h2>
              <p className="brand-tagline">Create Your Account</p>
            </div>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="register-btn">
              Register
            </button>
          </form>

          <p className="have-account">
            <span style={{ color: "black" }}>Already have an account?</span>{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Side Info */}
        <div className="register-info-section">
          <h1>Join HireHub</h1>
          <p>
            Sign up to access our AI-powered career tools, resume tailoring, and
            smarter job applications.
          </p>
          <div className="illustration">
                <img src={placeholderImg} alt="AI Assistant" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
