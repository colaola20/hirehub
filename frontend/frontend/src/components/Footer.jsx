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
            <Link to="/" className={styles.footerLink}>Home</Link>
            <Link to="/dashboard" className={styles.footerLink}>Dashboard</Link>
            <Link to="/jobs" className={styles.footerLink}>Find Jobs</Link>
            <Link to="/profile" className={styles.footerLink}>Profile</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Resources</h3>
            <Link to="/resume-builder" className={styles.footerLink}>Resume Builder</Link>
            <Link to="/cover-letter" className={styles.footerLink}>Cover Letter AI</Link>
            <Link to="/interview-prep" className={styles.footerLink}>Interview Prep</Link>
            <Link to="/career-advice" className={styles.footerLink}>Career Advice</Link>
          </div>
          
          <div className={styles.footerColumn}>
            <h3 className={styles.footerColumnTitle}>Connect</h3>
            <a href="mailto:support@hirehub.com" className={styles.footerLink}>Email Us</a>
            <Link to="/help" className={styles.footerLink}>Help Center</Link>
            <Link to="/about" className={styles.footerLink}>About Us</Link>
            <div className={styles.footerSocial}>
              <a href="https://twitter.com/hirehub" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                Twitter
              </a>
              <a href="https://linkedin.com/company/hirehub" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                LinkedIn
              </a>
            </div>
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