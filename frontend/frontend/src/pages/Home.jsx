import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";            // ⬅️ added
import styles from "./Home_Page.module.css";  // ⬅️ use module import
import { SpaceIcon } from "lucide-react";

const AngleLanding = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    let effect;
    let cancelled = false;

    import("vanta/dist/vanta.Net.min").then((mod) => {
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
        points: 5.5,
        spacing: 16.0,
        maxDistance: 20.0,
        showDots: false,
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

           {/* SERVICES */}
      <section className={styles["angle2-services"]} id="services">
        <div className={`${styles["angle2-container"]} ${styles["angle2-services__inner"]}`}>
          <h2 className={styles["angle2-section-heading"]}>Services</h2>

          <div className={styles["svcGrid"]}>
            <article className={styles["svcCard"]}>
              <h3>Resume Tailoring</h3>
              <p>
                Instant ATS-friendly optimization for each job description. We highlight keywords,
                quantify your impact, and export cleanly to PDF/DOCX.
              </p>
            </article>

            <article className={styles["svcCard"]}>
              <h3>Cover Letters</h3>
              <p>
                Role-specific letters that stay human-readable while mirroring the company’s tone
                and requirements. No fluff—just clear value.
              </p>
            </article>

            <article className={styles["svcCard"]}>
              <h3>Profile & Portfolio</h3>
              <p>
                polish your LinkedIn, GitHub, and personal site with concise, consistent messaging
                and examples that recruiters notice.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles["angle2-contact"]} id="contact">
        <div className={`${styles["angle2-container"]} ${styles["angle2-contact__inner"]}`}>
          <div className={styles["contactCopy"]}>
            <h2 className={styles["angle2-section-heading"]}>Contact Us</h2>
            <p>
              Have a question or want a quick demo? Drop a note and we’ll get back to you.
            </p>

            <ul className={styles["contactList"]}>
              <li><strong>Email:</strong> hello@hirehub.app</li>
              <li><strong>Hours:</strong> Mon–Fri, 9am–6pm</li>
              <li><strong>Response time:</strong> usually within 1 business day</li>
            </ul>
          </div>

          <form
            className={styles["contactForm"]}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We’ll reach out shortly.");
            }}
          >
            <div className={styles["formRow"]}>
              <input type="text" name="name" placeholder="Your name" required />
              <input type="email" name="email" placeholder="Your email" required />
            </div>
            <textarea name="message" rows="5" placeholder="Your message" required />
            <button type="submit" className={`${styles["angle2-btn"]} ${styles["angle2-btn--ghost"]}`}>
              Send message
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default AngleLanding;
