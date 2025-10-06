import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./home.css";

const AngleLanding = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    let effect;
    let cancelled = false;

    import("vanta/dist/vanta.net.min").then((mod) => {
      if (cancelled) return;
      const NET = mod.default;

      effect = NET({
        el: bgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        // ↓ make it a bit sparser if you want fewer lines
        points: 8.0,
        maxDistance: 18.0,
        spacing: 18.0,
        showDots: false,

        // show your CSS gradient behind the effect
        backgroundAlpha: 0.0,

        // your colors
        backgroundColor: 0x192164,
        color: 0xff80b5,
      });
    });

    return () => {
      cancelled = true;
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div className="angle2-root">
      {/* HERO (has Vanta, fills one viewport, scrolls away) */}
      <section className="angle2-hero">
        {/* Vanta mounts on this absolutely-positioned layer */}
        <div className="angle2-vanta-layer" aria-hidden="true" ref={bgRef} />

        {/* Content on top of Vanta */}
        <header className="angle2-nav">
          <div className="angle2-container">
            <div className="angle2-logo">HireHub</div>
            <nav className="angle2-links">
              <a href="#case-studies">Case studies</a>
              <a href="#process">Process</a>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact Us</a>
            </nav>
            <button className="angle2-btn angle2-btn--small">Free quote</button>
          </div>
        </header>

        <div className="angle2-hero__inner angle2-container">
          <h1 className="angle2-hero__title">
            The application assistant
            <br />
            that optimizes<span className="accent"> every detail</span>
          </h1>
          <p className="angle2-hero__lead">
            Tailor your <strong>resume &amp; cover letter</strong> instantly with AI to
            land your dream job faster.
          </p>
          <p className="angle2-hero__sub">
            Our <span className="accent">UX design expertise</span> means we prioritize the people who
            matter most – your users
          </p>
          <button className="angle2-btn angle2-btn--ghost">Free quote</button>
        </div>
      </section>

      {/* ABOUT SECTION (full-width black block) */}
      <section className="angle2-about" id="about">
        <div className="angle2-container angle2-about__inner">
          <h2>What is HireHub?</h2>
          <p>
            HireHub is your AI-powered job application copilot. Paste a job description,
            and we instantly tailor your resume and cover letter using smart keyword
            extraction, impact-driven phrasing, and clean formatting that passes ATS
            checks while staying human-readable.
          </p>
          <ul className="angle2-about__list">
            <li>ATS-friendly resume tailoring in seconds</li>
            <li>Role-specific cover letters with measurable impact</li>
            <li>One-click export to PDF/Docx</li>
            <li>Privacy-first — your data stays yours</li>
          </ul>
        </div>
      </section>

      {/* placeholder more content so you can test the scroll */}
      <section className="angle2-more">
        <div className="angle2-container">
          <h3>More sections here…</h3>
          <p>Services, case studies, pricing, etc.</p>
        </div>
      </section>
    </div>
  );
};

export default AngleLanding;
