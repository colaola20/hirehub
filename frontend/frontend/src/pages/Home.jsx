import React from "react";
import "./home.css";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="container">
      <Navbar />

      <div className="landing-hero">
        <div className="hero-text">
          <h1>Welcome to <span className="highlight">HireHub</span></h1>
          <p>
            Your AI-powered career companion. Tailor resumes, craft cover
            letters, and explore job opportunities — all in one place.
          </p>
          <button
            className="cta-btn"
            onClick={() => (window.location.href = "/registration")}
          >
            Get Started for Free
          </button>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            alt="Career illustration"
          />
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose HireHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI Resume Tailoring</h3>
            <p>
              Instantly adapt your resume to any job description. Save time and
              maximize your chances of landing an interview.
            </p>
          </div>
          <div className="feature-card">
            <h3>Cover Letter Generator</h3>
            <p>
              Struggling with cover letters? HireHub writes personalized,
              professional drafts in seconds.
            </p>
          </div>
          <div className="feature-card">
            <h3>Student-Friendly</h3>
            <p>
              100% free for students. Focus on building your career — without
              worrying about subscription costs.
            </p>
          </div>
        </div>
      </div>

      <div className="tiers-section">
        <h2>Our Packages</h2>
        <p className="tiers-subtitle">
          Simple, transparent, and always free for students.
        </p>
        <div className="tiers-grid">
          <div className="tier-card free">
            <h3>Free Tier (Students)</h3>
            <p>✔ AI Resume Generator</p>
            <p>✔ Cover Letter Assistant</p>
            <p>✔ Job Tracking Dashboard</p>
            <p>✔ Unlimited Access</p>
            <button className="cta-btn">Start Free</button>
          </div>

          <div className="tier-card pro">
            <h3>Professional</h3>
            <p>✔ All Student Features</p>
            <p>✔ Advanced Resume Templates</p>
            <p>✔ LinkedIn/GitHub Integration</p>
            <p>✔ Priority Support</p>
            <button className="cta-btn">Coming Soon</button>
          </div>

          <div className="tier-card enterprise">
            <h3>Enterprise</h3>
            <p>✔ Recruiter Dashboard</p>
            <p>✔ Team Analytics</p>
            <p>✔ Branded Career Portal</p>
            <p>✔ Dedicated Account Manager</p>
            <button className="cta-btn">Contact Us</button>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} HireHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
