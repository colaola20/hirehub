import React, { useEffect, useState } from 'react';
import styles from '../pages/Home_Page.module.css';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/b1.png';

const Contact = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('contact');
      if (section) {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Only start the effect when 50% of the section is in view
        if (rect.top <= windowHeight * 0.5) {
          // Calculate scroll progress starting from 50% visibility
          const progress = Math.min(
            1,
            Math.max(0, (windowHeight * 0.5 - rect.top) / (windowHeight * 0.5))
          );
          setScroll(progress);
        } else {
          // Reset when section is not sufficiently visible
          setScroll(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.heroContact} id="contact">
      <div className={styles.heroContactBackground}>
        <div 
          className={styles.heroContactOverlay}
          style={{
            transform: `scale(${1 - (scroll * 0.08)})`,
            opacity: 1 - (scroll * 0.2)
          }}
        >
          <img 
            src={backgroundImage} 
            alt="AI robot"
            className={styles.heroContactImage}
          />
        </div>
      </div>
      <div className={styles.heroContactContent}>
        <h1 className={styles.heroContactText}>HireHub</h1>
        <Link to="/contact" className={styles.contactButton}>
          Contact us →
        </Link>
      </div>
    </section>
  );
};

export default Contact;
