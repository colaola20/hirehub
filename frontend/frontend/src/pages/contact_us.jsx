import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Contact_Us.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.container}>

      {/* MAIN WHITE BOX IDENTICAL TO LOGIN */}
      <div className={styles.loginBox}>

        {/* LEFT PANEL (form) */}
        <div className={styles.loginFormSection}>
          
          <Link to="/" className={styles.backHome}>
            ← Back to Home
          </Link>

          <h1 className={styles.pageTitle}>Contact Us</h1>
          <p className={styles.pageSubtitle}>
            We're here to help you with anything related to HireHub.
          </p>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            
            <label>Your Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={styles.input}
              required
            />

            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={styles.input}
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="6"
              className={styles.textarea}
              required
            ></textarea>

            <button className={styles.loginBtn}>Send Message</button>
          </form>
        </div>

        {/* RIGHT PANEL (support info) */}
        <div className={styles.loginInfoSection}>
          <h1>HireHub Support</h1>
          <p>Our team will respond within 24 hours.</p>

          <p><strong>Email:</strong> h1r3hub@gmail.com</p>
          <p><strong>Phone:</strong> (555) 321-9876</p>
          <p><strong>Address:</strong> Farmingdale State College, NY</p>
        </div>

      </div>
    </div>
  );
}
