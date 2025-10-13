import React, { useEffect, useState } from 'react';
import styles from '../pages/Home_Page.module.css';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/b2.jpg';

const Contact = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('contact');
      if (section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const windowHeight = window.innerHeight;
        
        // Calculate how far into the section we've scrolled (0 to 1)
        let progress = 1 - (rect.top / windowHeight);
        // Clamp the value between 0 and 1
        progress = Math.max(0, Math.min(1, progress));
        
        setScroll(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.heroContact} id="contact">
      <div className={styles.heroContactOverlay}
        style={{
          width: `${100 - (scroll * 20)}%`,
          marginLeft: `${scroll * 10}%`
        }}
      >
        <img 
          src={backgroundImage} 
          alt="Nature background"
          className={styles.heroContactImage}
        />
        <div className={styles.heroContactGradient} />
      </div>
      <div className={styles.heroContactContent}>
        <h1 
          className={styles.heroContactTitle}
          style={{
            transform: `translateY(${scroll * -100}px)`,
          }}
        >
          ENTER THE NEW
          <br />
          ERA
        </h1>
        <Link to="/contact" className={styles.contactButton}>
          Contact us →
        </Link>
      </div>
    </section>
  );
};

export default Contact;
