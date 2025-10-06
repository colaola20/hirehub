import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Home_Page.module.css";  // ⬅️ use module import

const AngleLanding = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    let effect;
    let cancelled = false;

    import("vanta/dist/vanta.Globe.min").then((mod) => {
      if (cancelled) return;
      const Halo = mod.default;

      effect = Halo({
        el: bgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        points: 8.0,
        maxDistance: 18.0,
        spacing: 18.0,
        showDots: false,
        backgroundAlpha: 0.0,
        backgroundColor: 0x131a43,
        color: 0xff3f81,
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
            <div className={styles["angle2-logo"]}>HireHub</div>

            <nav className={styles["angle2-links"]}>
              <a href="#case-studies">Case studies</a>
              <a href="#process">Process</a>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact Us</a>
            </nav>

            <button className={`${styles["angle2-btn"]} ${styles["angle2-btn--small"]}`}>
              Free quote
            </button>
          </div>
        </header>

        <div className={`${styles["angle2-hero__inner"]} ${styles["angle2-container"]}`}>
          <h1 className={styles["angle2-hero__title"]}>
            The application assistant
            <br />
            that optimizes<span className={styles["accent"]}> every detail</span>
          </h1>

          <p className={styles["angle2-hero__lead"]}>
            Tailor your <strong>resume &amp; cover letter</strong> instantly with AI to
            land your dream job faster.
          </p>

          <p className={styles["angle2-hero__sub"]}>
            Our <span className={styles["accent"]}>UX design expertise</span> means we prioritize the people who
            matter most – your users
          </p>

          <button className={`${styles["angle2-btn"]} ${styles["angle2-btn--ghost"]}`}>
            Free quote
          </button>
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
