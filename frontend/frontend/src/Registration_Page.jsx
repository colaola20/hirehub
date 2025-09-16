// RegisterPage.jsx
import React from "react";
import "./Registration_Page.css";

const RegisterPage = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        {/* Left Section - Registration Form */}
        <div className="register-form-section">
          <div className="brand">
            <div className="logo">H</div>
            <h1 className="brand-name">HireHub</h1>
          </div>
          <p className="brand-tagline">Your AI Career Companion</p>

          {/* Registration Form */}
          <form className="form">
            <input type="text" placeholder="Full Name" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <input type="password" placeholder="Confirm Password" className="input" />

            <button type="submit" className="btn-primary">Sign Up</button>

            <button type="button" className="btn-google">
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google logo" 
                className="google-icon"
              />
              Continue with Google
            </button>
          </form>

          <div className="form-footer">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>

        {/* Right Section - Info */}
        <div className="register-info-section">
          <h2>Create Your Account</h2>
          <p>
            Join HireHub and let AI help you tailor your resume & cover letter 
            for every job application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
