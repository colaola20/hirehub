import React from "react";
import "./home.css";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="landing-container">
      <Navbar />

      {/* Hero / Intro Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-heading">
            HireHub: Your AI Career Partner
          </h1>
          <p className="hero-subheading">
            Tailor your resume, craft cover letters, and land your dream job — all for free.
          </p>
          <button
            className="cta-button"
            onClick={() => (window.location.href = "/registration")}
          >
            Get Started — Free
          </button>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            alt="AI / Career graphic"
          />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features">
        <div className="feature-card">
          <div className="icon">📝</div>
          <h3>Resume Tailoring</h3>
          <p>
            Paste your job description and let HireHub generate a tailored resume in seconds.
          </p>
        </div>
        <div className="feature-card">
          <div className="icon">✍️</div>
          <h3>Cover Letters</h3>
          <p>
            Generate customized, professional cover letters with AI — no writer’s block.
          </p>
        </div>
        <div className="feature-card">
          <div className="icon">🎓</div>
          <h3>Free for Students</h3>
          <p>
            All core features are 100% free for students — no hidden fees, no trials.
          </p>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section className="plans">
        <h2>Plans & Pricing</h2>
        <div className="plans-grid">
          <div className="plan-card plan-free">
            <h3>Free (Student)</h3>
            <ul>
              <li>✔ Resume Tailoring</li>
              <li>✔ Cover Letters</li>
              <li>✔ Dashboard</li>
              <li>✔ Unlimited Use</li>
            </ul>
            <button className="cta-button">Join Free</button>
          </div>
          <div className="plan-card plan-pro">
            <h3>Pro (Coming Soon)</h3>
            <ul>
              <li>✔ All Free Features</li>
              <li>✔ Premium Templates</li>
              <li>✔ LinkedIn / GitHub Integration</li>
              <li>✔ Priority Support</li>
            </ul>
            <button className="cta-button disabled">Coming Soon</button>
          </div>
          <div className="plan-card plan-enterprise">
            <h3>Enterprise</h3>
            <ul>
              <li>✔ Team Tools</li>
              <li>✔ Analytics</li>
              <li>✔ Custom Branding</li>
              <li>✔ Dedicated Support</li>
            </ul>
            <button className="cta-button">Contact Sales</button>
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
