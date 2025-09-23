// Home.jsx
import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");

  const handleGenerateResume = async () => {
    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await response.json();

      if (response.ok) {
        setResume(data.resume);
      } else {
        alert(data.message || "Failed to generate resume");
      }
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        {/* Left Side: Resume Generator */}
        <div className="login-form-section">
          {/* Branding */}
          <div className="brand">
            <div className="logo">H</div>
            <div className="brand-text">
              <h2 className="brand-title">ireHub</h2>
              <p className="brand-tagline">AI Resume Tailored for You</p>
            </div>
          </div>

          {/* Resume Generator Form */}
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <textarea
              className="job-input"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
            <button
              type="button"
              className="login-btn"
              onClick={handleGenerateResume}
            >
              Generate Resume
            </button>
          </form>

          {resume && (
            <div className="resume-output">
              <h3>Your AI-Generated Resume</h3>
              <pre>{resume}</pre>
            </div>
          )}
        </div>

        {/* Right Side: Info Section */}
        <div className="login-info-section">
          <h1>Smarter Job Applications</h1>
          <p>
            HireHub uses AI to instantly tailor your resume & cover letter
            to match any job description. Save time and increase your chances
            of landing interviews.
          </p>
          <div className="illustration">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
              alt="Resume illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
