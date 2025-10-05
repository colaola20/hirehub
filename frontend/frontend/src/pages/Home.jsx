import React from "react";
import "./home.css";

const AngleLanding = () => {
  return (
    <div className="angle2-root">
      <div className="angle2-landing">
        {/* fixed, full-viewport background */}
        <div className="angle2-bg" aria-hidden="true" />
        {/* ambient ornaments */}
        <div className="angle2-ornaments">
          <span className="angle2-blob blob-tr" />
          <span className="angle2-blob blob-tl" />
          <span className="angle2-blob blob-bl" />
        </div>

        {/* NAVBAR */}
        <header className="angle2-nav">
          <div className="angle2-container">
            <div className="angle2-logo">HireHub</div>

            <nav className="angle2-links">
              <a href="#case-studies">Case studies</a>
              <a href="#process">Process</a>
              <a href="#services">Services</a>
              <a href="#blog">Blog</a>
              <a href="#about">About</a>
              <a href="#contact">Contact Us</a>
            </nav>

            <button className="angle2-btn angle2-btn--small">Free quote</button>
          </div>
        </header>

        {/* HERO */}
        <main className="angle2-hero">
          <div className="angle2-container angle2-hero__inner">
            <h1 className="angle2-hero__title">
              The web application
              <br />
              agency that <span className="accent">helps you grow</span>
            </h1>

            <p className="angle2-hero__lead">
              We create <strong>web applications</strong> for small and medium SaaS
              businesses.
            </p>

            <p className="angle2-hero__sub">
              Our <span className="accent">UX design expertise</span> means we
              prioritize the people who matter most – your users
            </p>

            <button className="angle2-btn angle2-btn--ghost">Free quote</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AngleLanding;
