import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Contact_Us.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // 'sending', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        
        // Clear success message after 5 seconds
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.loginFormSection}>
          <Link to="/" className={styles.backHome}>
            ← Back to Home
          </Link>

          <h1 className={styles.pageTitle}>Contact Us</h1>
          <p className={styles.pageSubtitle}>
            We're here to help you with anything related to HireHub.
          </p>

          {/* Status Messages */}
          {status === "success" && (
            <div className={styles.successMessage}>
              ✓ Message sent successfully! We'll get back to you within 24 hours.
            </div>
          )}

          {status === "error" && (
            <div className={styles.errorMessage}>
              ✗ {errorMessage}
            </div>
          )}

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
              disabled={status === "sending"}
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
              disabled={status === "sending"}
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
              disabled={status === "sending"}
            ></textarea>

            <button 
              className={styles.loginBtn} 
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className={styles.loginInfoSection}>
          <h1>HireHub Support</h1>
          <p>Our team will respond within 24 hours.</p>

          <p><strong>Email:</strong> h1r3hub@gmail.com</p>
          <p><strong>Phone:</strong> 904-820-4696</p>
          <p><strong>Address:</strong> Farmingdale State College, NY</p>
        </div>
      </div>
    </div>
  );
}