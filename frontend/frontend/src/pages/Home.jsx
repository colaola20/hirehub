import React from "react";
import "./home.css";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">HireHub</h1>
        <p className="hero-subtitle">
          Your AI-powered career companion. <br />
          Smarter resumes. Smarter applications. Smarter you.
        </p>
        <button
          className="cta-btn"
          onClick={() => (window.location.href = "/registration")}
        >
          Get Started Free
        </button>
      </section>

      {/* Showcase Section */}
      <section className="showcase">
        <div className="showcase-text">
          <h2>AI Resume Tailoring</h2>
          <p>
            Paste any job description and let HireHub craft a tailored resume
            instantly. Increase your chances of landing interviews.
          </p>
        </div>
        <div className="showcase-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1256/1256650.png"
            alt="Resume Illustration"
          />
        </div>
      </section>

      <section className="showcase reverse">
        <div className="showcase-text">
          <h2>Cover Letter Generator</h2>
          <p>
            Generate professional cover letters in seconds. Personalized,
            compelling, and aligned with your career goals.
          </p>
        </div>
        <div className="showcase-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            alt="Cover Letter Illustration"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="tiers">
        <h2>Simple, Transparent, Always Free for Students</h2>
        <div className="tiers-grid">
          <div className="tier-card free">
            <h3>Free Tier</h3>
            <ul>
              <li>✔ Unlimited AI Resume Tailoring</li>
              <li>✔ Cover Letter Assistant</li>
              <li>✔ Student Dashboard</li>
              <li>✔ Free Forever</li>
            </ul>
            <button className="cta-btn">Join Free</button>
          </div>
          <div className="tier-card pro">
            <h3>Pro (Coming Soon)</h3>
            <ul>
              <li>✔ All Free Features</li>
              <li>✔ Premium Resume Templates</li>
              <li>✔ LinkedIn & GitHub Integration</li>
              <li>✔ Priority Support</li>
            </ul>
            <button className="cta-btn disabled">Coming Soon</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} HireHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
