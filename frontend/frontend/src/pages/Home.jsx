import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";            // ⬅️ added
import styles from "./Home_Page.module.css";  // ⬅️ use module import

const AngleLanding = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    let effect;
    let cancelled = false;

    import("vanta/dist/vanta.Globe.min").then((mod) => {
      if (cancelled) return;
      const Globe = mod.default;

      effect = Globe({
        el: bgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        scale: 1.0,
        showpoints: false,
        scaleMobile: 1.0,
        size: 1.0,
        points: 8.0,
        color: 0xff3f81,
        backgroundAlpha: 0.0,
        backgroundColor: 0x131a43,
      });
    });

    return () => {
      cancelled = true;
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div className={styles["angle2-root"]}>
      {/* HERO */}
      <section className={styles["angle2-hero"]}>
        <div className={styles["angle2-vanta-layer"]} aria-hidden="true" ref={bgRef} />

        {/* NAV */}
        <header className={styles["angle2-nav"]}>
          <div className={styles["angle2-container"]}>

            <nav className={styles["angle2-links"]}>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact Us</a>
            </nav>

            {/* linked buttons */}
            <Link to="/login" className={`${styles["angle2-btn"]} ${styles["angle2-btn--small"]}`}>
              Sign In
            </Link>
            <Link to="/Registration" className={`${styles["angle2-btn"]} ${styles["angle2-btn--small"]}`}>
              Sign Up
            </Link>
          </div>
        </header>

        {/* headline */}
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>HireHub</h1>
          <p className={styles.heroSub}>
            The application assistant that optimizes <span className={styles.accent}>every detail</span>
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles["angle2-about"]} id="about">
        <div className={`${styles["angle2-container"]} ${styles["angle2-about__inner"]}`}>
          <h2>What is HireHub?</h2>
          <p>
            HireHub is your AI-powered job application copilot. Paste a job description,
            and we instantly tailor your resume and cover letter using smart keyword
            extraction, impact-driven phrasing, and clean formatting that passes ATS
            checks while staying human-readable.
          </p>
          <ul className={styles["angle2-about__list"]}>
            <li>ATS-friendly resume tailoring in seconds</li>
            <li>Role-specific cover letters with measurable impact</li>
            <li>One-click export to PDF/Docx</li>
            <li>Privacy-first — your data stays yours</li>
          </ul>
        </div>
      </section>

      {/* MORE */}
      <section className={styles["angle2-more"]}>
        <div className={styles["angle2-container"]}>
          <h3>More sections here…</h3>
          <p>Services, case studies, pricing, etc.</p>
        </div>
      </section>
    </div>
  );
};

export default AngleLanding;
