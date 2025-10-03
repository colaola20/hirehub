import React from "react";
import "./home.css";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="overlay">
          <h1>HireHub</h1>
          <p>Smarter Job Applications. Tailored Resumes. Free for Students.</p>
          <button
            className="cta"
            onClick={() => (window.location.href = "/registration")}
          >
            Get Started Free
          </button>
        </div>
      </section>


      {/* Company Profile */}
      <section className="profile">
        <div className="profile-text">
          <h2>Company Profile</h2>
          <p>
            HireHub is an AI-powered career companion that helps students and
            professionals create tailored resumes, generate compelling cover
            letters, and track job applications — all in one platform.
          </p>
          <button className="cta">Learn More</button>
        </div>
        <div className="profile-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
            alt="Company illustration"
          />
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-list">
          <div>
            <h3>01 Resume Tailoring</h3>
            <p>AI adapts your resume to match any job description.</p>
          </div>
          <div>
            <h3>02 Cover Letter Generator</h3>
            <p>Instantly create professional cover letters without stress.</p>
          </div>
          <div>
            <h3>03 Student Dashboard</h3>
            <p>Track applications, deadlines, and progress in one place.</p>
          </div>
        </div>
      </section>

      {/* Clients / Showcase */}
      <section className="clients">
        <h2>Our Client Roster</h2>
        <p>
          From students to early professionals, HireHub supports career journeys
          at every stage.
        </p>
        <div className="client-grid">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            alt="Student"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png"
            alt="Graduate"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
            alt="Professional"
          />
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote">
        <blockquote>
          "HireHub is our expertise. We’ll take care of your career tools, so
          you can focus on landing your dream job."
        </blockquote>
        <cite>- Team HireHub</cite>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Let’s Work Together</h2>
        <p>Email: support@hirehub.com</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Address: 123 Innovation Way, NY, USA</p>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} HireHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
