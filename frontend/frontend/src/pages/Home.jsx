import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import styles from "./Home_Page.module.css";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const AngleLanding = () => {
  const [active, setActive] = React.useState("resume");

  // === ABOUT slides state/refs ===
  const [aboutStep, setAboutStep] = React.useState(0);
  const aboutRef = React.useRef(null);
  const lockRef = React.useRef(false); // <-- persistent debounce lock

  const aboutSlides = [
    <h2 className={styles.aboutHeroTitle}>What is <span>HireHub?</span></h2>,
    <div className={styles.aboutBlock}>
      <h3>AI-powered application copilot</h3>
      <p>
        Paste any job description and we tailor your resume and cover letter with smart keyword
        matching, impact-first phrasing, and clean, ATS-ready formatting.
      </p>
    </div>,
    <div className={styles.aboutGrid}>
      <div>
        <h4>ATS-friendly</h4>
        <p>Structure, sections, and wording that pass automated screens.</p>
      </div>
      <div>
        <h4>Faster iterations</h4>
        <p>Generate improved bullets, quantify achievements, and tailor your resume to each job in seconds.</p>
      </div>
      <div>
        <h4>Privacy-first</h4>
        <p>Your documents and personal data stay yours, always.</p>
      </div>
    </div>,
    <div className={styles.aboutCTA}>
      <h3>Ready to stand out?</h3>
      <p> Create high-impact resumes and cover letters tailored to every role you apply for.</p>
      <a href="#services" className={styles.aboutButton}>Explore Services</a>
    </div>
  ];
    const rootRef = React.useRef(null);

    React.useEffect(() => {
      rootRef.current?.classList.add(styles.pageReady);
    }, []);

  // reveal-on-scroll (existing, harmless to keep)
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add(styles["is-visible"]));
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Vanta background (existing)
  const bgRef = useRef(null);
  useEffect(() => {
    let effect;
    let cancelled = false;
    import("vanta/dist/vanta.net.min.js").then((mod) => {
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

  // === ABOUT: lock scroll until slides done (bind to section element) ===
  useEffect(() => {
    const sec = aboutRef.current;
    if (!sec) return;

    let touchStartY = null;

    const advance = (dir = 1) => {
      if (lockRef.current) return;           // respect lock across renders
      lockRef.current = true;
      setAboutStep((s) => {
        const next = Math.min(Math.max(s + dir, 0), aboutSlides.length - 1);
        return next;
      });
      setTimeout(() => { lockRef.current = false; }, 600); // ~single step per gesture
    };

    // Wheel inside the section
    const onWheel = (e) => {
      const atStart = aboutStep === 0;
      const atEnd = aboutStep === aboutSlides.length - 1;

      // Allow scrolling UP out of the section at first slide.
      // Otherwise paginate slides; atEnd fall through to normal page scroll.
      if (!(atStart && e.deltaY < 0) && !atEnd) {
        e.preventDefault();
        advance(e.deltaY > 0 ? 1 : -1);
      }
    };

    // Touch swipe inside the section
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchStartY == null) return;
      const dy = e.touches[0].clientY - touchStartY;
      const atEnd = aboutStep === aboutSlides.length - 1;
      const atStart = aboutStep === 0;

      if (!(atStart && dy > 0) && !atEnd && Math.abs(dy) > 24) {
        e.preventDefault();
        advance(dy < 0 ? 1 : -1);
        touchStartY = e.touches[0].clientY;
      }
    };

    // Keyboard (when section is focused or generally)
    const onKeyDown = (e) => {
      const atEnd = aboutStep === aboutSlides.length - 1;
      const atStart = aboutStep === 0;
      const down = [" ", "ArrowDown", "PageDown"];
      const up = ["ArrowUp", "PageUp"];

      if (down.includes(e.key) && !atEnd) {
        e.preventDefault();
        advance(1);
      } else if (up.includes(e.key) && !atStart) {
        e.preventDefault();
        advance(-1);
      }
    };

    sec.addEventListener("wheel", onWheel, { passive: false });
    sec.addEventListener("touchstart", onTouchStart, { passive: true });
    sec.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });

    return () => {
      sec.removeEventListener("wheel", onWheel);
      sec.removeEventListener("touchstart", onTouchStart);
      sec.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboutStep, aboutSlides.length]);

  // Reset to slide 0 when viewport center is outside the About section
  useEffect(() => {
    const sec = aboutRef.current;
    if (!sec) return;

    const onScroll = () => {
      const secTop = sec.offsetTop;
      const secBottom = secTop + sec.offsetHeight;
      const y = window.scrollY || window.pageYOffset;
      const viewCenter = y + window.innerHeight / 2;

      // If the viewport center is above or below the section, reset
      if ((viewCenter < secTop || viewCenter > secBottom) && aboutStep !== 0) {
        setAboutStep(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [aboutStep]);
    const smoothTo = (hash) => {
      const el = document.querySelector(hash);
      if (!el) return;
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
        ) || 64;

      const y = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: y, behavior: "smooth" });
    };

  return (
    <div ref={rootRef} className={styles["angle2-root"]}>
      {/* HERO */}
      <section className={styles["angle2-hero"]}>
        <div className={styles["angle2-vanta-layer"]} aria-hidden="true" ref={bgRef} />
        {/* NAV */}
        <header className={styles["angle2-nav"]}>
          <div className={styles["angle2-container"]}>
           <nav className={styles["angle2-links"]}>
            <a href="#services" onClick={(e) => { e.preventDefault(); smoothTo("#services"); }}>
              Services
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); smoothTo("#about"); }}>
              About
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); smoothTo("#contact"); }}>
              Contact Us
            </a>
          </nav>

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
            The application assistant that <span className={styles.accent}> optimizes every detail</span>
          </p>
        </div>
      </section>

      {/* ===== ABOUT (Full-screen slides; gradient only here) ===== */}
      <section
        className={styles.aboutFS}
        id="about"
        ref={aboutRef}
        tabIndex={0}
        /* let scroll chain to the page when at first/last slide */
        style={{ touchAction: "auto" }}
      >
        <div className={styles.aboutFSInner}>
          {aboutSlides.map((content, i) => (
            <div
              key={i}
              className={`${styles.aboutSlide} ${i === aboutStep ? styles.aboutSlideActive : ""}`}
              aria-hidden={i === aboutStep ? "false" : "true"}
            >
              {content}
            </div>
          ))}

          <div className={styles.aboutDots} aria-hidden="true">
            {aboutSlides.map((_, i) => (
              <span
                key={i}
                className={`${styles.aboutDot} ${i === aboutStep ? styles.aboutDotActive : ""}`}
              />
            ))}
          </div>

          {aboutStep < aboutSlides.length - 1 && (
            <div className={styles.aboutHint}>Scroll or swipe to continue</div>
          )}
        </div>
      </section>

      {/* ===== INTERACTIVE SERVICES (unchanged) ===== */}
      <section className={styles.caeliServices} id="services">
        <div className={styles.caeliContainer}>
          {/* LEFT OPTIONS */}
          <div className={styles.caeliLeft}>
            {[
              { id: "resume", label: "Resume Tailoring" },
              { id: "letters", label: "Cover Letters" },
              { id: "portfolio", label: "Profile & Portfolio" },
            ].map((item) => (
              <div
                key={item.id}
                className={`${styles.caeliOption} ${active === item.id ? styles.active : ""}`}
                onClick={() => setActive(item.id)}
                onMouseEnter={() => setActive(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* RIGHT VISUAL */}
          <div className={styles.caeliRight}>
            <div className={styles.caeliImageWrap}>
              <img
                src={
                  active === "resume"
                    ? "/assets/resume.png"
                    : active === "letters"
                    ? "/assets/letter.png"
                    : "/assets/portfolio.png"
                }
                alt={active}
                className={styles.caeliImage}
              />
              <div className={styles.caeliCard}>
                {active === "resume" && (
                  <p>
                    Optimize your resume with AI precision. We analyze job descriptions,
                    highlight relevant skills, and format your experience for maximum recruiter impact.
                  </p>
                )}
                {active === "letters" && (
                  <p>
                    Create tailored cover letters that match tone, intent, and key values.
                    Impress hiring managers with clarity and confidence — every word counts.
                  </p>
                )}
                {active === "portfolio" && (
                  <p>
                    Present your personal brand beautifully. Refine your LinkedIn, GitHub,
                    and project showcases for consistent, professional storytelling.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== MEET THE TEAM ===== */}
      <section className={styles.team} id="team">
        <div className={`${styles["angle2-container"]} ${styles.teamInner}`}>
          <header className={styles.teamHeader}>
            <p className={styles.eyebrow}>Meet the Team</p>
            <h2 className={styles.teamTitle}>
              The people behind <span className={styles.titleStrongAlt}>HireHub</span>
            </h2>
            <p className={styles.teamSubtitle}>
              Builders, designers, and career nerds obsessed with helping you land faster.
            </p>
          </header>

          <div className={styles.teamGrid}>
            {/* Card 1 */}
            <article className={styles.memberCard} data-reveal>
              <img
                className={styles.memberAvatar}
                src="/assets/h4.PNG"
                alt="Alex Johnson"
                loading="lazy"
              />
              <h3 className={styles.memberName}>Haris Akbar</h3>
              <p className={styles.memberRole}>Co-founder & CEO</p>
              <p className={styles.memberBio}>
                Product & growth. Previously led job-search tools used by 3M+ applicants.
              </p>
              <div className={styles.memberSocials}>
                <a href="https://harisakbar03.github.io/" aria-label="Haris's Portfolio">Portfolio</a>
                <a href="https://github.com/HarisAkbar03" aria-label="Haris's Github">Github</a>
              </div>
            </article>

            {/* Card 2 */}
            <article className={styles.memberCard} data-reveal>
              <img
                className={styles.memberAvatar}
                src="/assets/JPR.png"
                alt="Jonatan Paulino"
                loading="lazy"
              />
              <h3 className={styles.memberName}>Jonatan Paulino</h3>
              <p className={styles.memberRole}>Co-founder & CTO</p>
              <p className={styles.memberBio}>
                ML & systems. Ships ranking models and keeps the pixels fast.
              </p>
              <div className={styles.memberSocials}>
                <a href="https://github.com/JPR420" aria-label="Jonatan GitHub">GitHub</a>
                <a href="https://www.linkedin.com/in/jonatan-paulino-8b0269303/" aria-label="Jonatan LinkedIn">LinkedIn</a>
              </div>
            </article>

            {/* Card 3 */}
            <article className={styles.memberCard} data-reveal>
              <img
                className={styles.memberAvatar}
                src="/assets/OS.png"
                alt="Olha Sorych"
                loading="lazy"
              />
              <h3 className={styles.memberName}>Olha Sorych</h3>
              <p className={styles.memberRole}>Design Lead</p>
              <p className={styles.memberBio}>
                Design systems, accessibility, and crisp micro-interactions.
              </p>
              <div className={styles.memberSocials}>
                <a href="https://github.com/colaola20" aria-label="olha Github">Github</a>
                <a href="https://www.linkedin.com/in/olha-sorych/" aria-label="Olha LinkedIn">LinkedIn</a>
              </div>
            </article>

            {/* Card 4 */}
            <article className={styles.memberCard} data-reveal>
              <img
                className={styles.memberAvatar}
                src="/assets/mike.png"
                alt="Mike Moradi"
                loading="lazy"
              />
              <h3 className={styles.memberName}>Mike Moradi</h3>
              <p className={styles.memberRole}>Head of Career Success</p>
              <p className={styles.memberBio}>
                Ex-recruiter. Turns “meh” bullets into measurable wins.
              </p>
              <div className={styles.memberSocials}>
                <a href="https://github.com/PracticalEscapement" aria-label="Mike Github">Github</a>
                <a href="https://www.linkedin.com/in/michael-moradi/" aria-label="Mike Github">LinkedIn</a>
              </div>
            </article>
                 {/* Card 5 */}
            <article className={styles.memberCard} data-reveal>
              <img
                className={styles.memberAvatar}
                src="/assets/hasim.png"
                alt="Hashim Kazmi"
                loading="lazy"
              />
              <h3 className={styles.memberName}>Hashim Kazmi</h3>
              <p className={styles.memberRole}>QA Tester</p>
              <p className={styles.memberBio}>
                Specializes in end-to-end testing, catching edge cases, and ensuring stable performance across features.
              </p>
              <div className={styles.memberSocials}>
                <a href="https://github.com/kazmha" aria-label="Hashim GitHub">GitHub</a>
                {/* <a href="" aria-label="Hashim LinkedIn">LinkedIn</a> */}
              </div>
            </article>

            
          </div>
        </div>
      </section>

              
      <Contact />
      <Footer />
    </div>
  );
};

export default AngleLanding;
