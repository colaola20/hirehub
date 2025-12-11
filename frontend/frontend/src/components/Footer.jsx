import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../components/Footer.module.css';

const Footer = () => {


  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerColumn}>
            <h2 className={styles.footerLogo}>HireHub</h2>
            <p className={styles.footerAbout}>
              Your AI-powered career partner, revolutionizing the way you search and apply for jobs.
              Let us help you take the next step in your career journey.
            </p>
          </div>
          
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Navigate</h3>
            <Link
              to="#top"
              className={styles.footerLink}
              onClick={(e) => {
                e.preventDefault(); 
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </Link>
            <Link to="/dashboard" className={styles.footerLink}>Dashboard</Link>
            <Link to="/dashboard/profile" className={styles.footerLink}>Profile</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Resources</h3>
            <Link to="/resume_form" className={styles.footerLink}>Resume Builder</Link>
            <Link to="/dashboard" className={styles.footerLink}>Find Jobs</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Connect</h3>
            <Link
                to="#team"
                className={styles.footerLink}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("team");
                  if (!el) return;
                  const navH =
                    parseInt(
                      getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
                    ) || 60; 
                  const y = el.getBoundingClientRect().top + window.scrollY - navH;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }}
              >
                About Us
              </Link>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} HireHub. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link to="/terms" className={styles.footerLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;