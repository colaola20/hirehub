import React, { useState } from "react";
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
      <div className={styles.contactWrapper}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>
          We're here to help you with anything related to HireHub.
        </p>

        <div className={styles.contentWrapper}>
          {/* LEFT — FORM */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>Your Name</label>
            <input
              className={styles.input}
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <label className={styles.label}>Message</label>
            <textarea
              className={styles.textarea}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="6"
              required
            ></textarea>

            <button className={styles.submitBtn}>Send Message</button>
          </form>

          {/* RIGHT — INFO BOX */}
          <div className={styles.infoBox}>
            <h3>HireHub Support</h3>
            <p>Our team will respond within 24 hours.</p>

            <div className={styles.infoItem}>
              <strong>Email:</strong>
              <span>support@hirehub.com</span>
            </div>

            <div className={styles.infoItem}>
              <strong>Phone:</strong>
              <span>(555) 321-9876</span>
            </div>

            <div className={styles.infoItem}>
              <strong>Address:</strong>
              <span>Farmingdale State College, NY</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
