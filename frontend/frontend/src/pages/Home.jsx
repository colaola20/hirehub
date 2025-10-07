import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./home.css";

const AngleLanding = () => {
  const bgRef = useRef(null);
  const [vanta, setVanta] = useState(null);

  useEffect(() => {
    let cancelled = false;

    // lazy-load the effect so your bundle stays small
    import("vanta/dist/vanta.net.min").then((mod) => {
      if (cancelled) return;
      const NET = mod.default;

      const effect = NET({
        el: bgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        points: 10.0,
        maxDistance: 20.0,
        spacing: 15.0,
        showDots: false,
        backgroundAlpha: 0.0,
        // colors from your Vanta URL (converted to 0xRRGGBB)
        backgroundColor: 0x192164, // 1646948
        color:  0xFF80B5,           // 11604372
      });

      setVanta(effect);
    });

    return () => {
      cancelled = true;
      if (vanta) vanta.destroy();
    };
    // we intentionally omit vanta from deps to avoid re-creating on HMR
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="angle2-root">
      <div className="angle2-landing">
        {/* fixed, full-viewport background (Vanta mounts here) */}
        <div className="angle2-bg-container" aria-hidden="true">
          <div ref={bgRef} className="angle2-bg" aria-hidden="true" />
          </div>
        

        {/* ambient ornaments (optional, keep if you still want them) */}
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
              The application assistant
              <br />
              that optimizes<span className="accent"> every detail</span>
            </h1>

            <p className="angle2-hero__lead">
              Tailor your <strong>resume &amp; cover letter</strong> instantly
              with AI to land your dream job faster.
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
