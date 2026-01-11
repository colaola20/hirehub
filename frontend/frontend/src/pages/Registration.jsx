// RegistrationPage.jsx
// Registration page for HireHub
import React, { useState } from "react";
import styles from "./Registration_Page.module.css"; // ⬅️ CSS Module
import { Link,useNavigate } from "react-router-dom";
import ErrorMessage from "../components/UsersMessages/Error.jsx";
import SuccessMessage from "../components/UsersMessages/Success.jsx";
import placeholderImg from "../../public/assets/login_reg_Place_holder1.png";

const RegistrationPage = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Regex patterns
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    const nameRegex = /^[A-Za-z]{2,30}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    // Disallow spaces in username
    if (/\s/.test(username)) {
      setInfoForModal("Invalid Username","Username cannot contain spaces!");
      return;
    }
    // Validation checks
    if (!usernameRegex.test(username)) {
      setInfoForModal("Invalid Username","Username must be 3-15 characters and only contain letters, numbers, and underscores.");
    
      return;
    }
    if (!nameRegex.test(firstName)) {
       setInfoForModal("Invalid First Name","First name must be 2-30 alphabetic characters.");
      return;
    }

    if (!nameRegex.test(lastName)) {
      setInfoForModal("Invalid Last Name","Last name must be 2-30 alphabetic characters.");
      return;
    }
    if (!emailRegex.test(email)) { // The <input> tag already implemented email regex but just as a double check
      setInfoForModal("Invalid Email","Please enter a valid email address.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setInfoForModal("Weak Password","Password must be at least 8 characters, include an uppercase letter, lowercase letter, number, and special character.");
      return;
    }
    if (password !== confirmPassword) {
      setInfoForModal("Password Mismatch","Passwords do not match!");
      return;
    }
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);

      } else {
        setInfoForModal("Registration Failed", data.message ||"Registration failed. Try again.");
             }
    } catch (error) {
      setInfoForModal("Registration Error", "Unable to register at this time. Please try again later.");
      }
  };

const setInfoForModal = (title ,description) => {
    setErrorTitle(title);
    setErrorDescription(description);
    setError(true);
  }

  const handleCloseError = () => {
    setError(false);
  };

  const handleCloseSuccessAndNavigateToLogin = () => {
    setSuccess(false);
     navigate("/login"); 
  };


  return (
    <div className={styles.container}>
      <div className={styles["register-box"]}>
        {/* Left Side: Registration Form */}
        <div className={styles["register-form-section"]}>
         <Link to="/" className={styles.brand} style={{ textDecoration: "none" }}>
          
          <div className={styles.logo}>H</div>
          <div className={styles["brand-text"]}>
            <h2 className={styles["brand-title"]}>ireHub</h2>
            <p className={styles["brand-tagline"]}>Your AI Career Companion</p>
          </div>

        </Link>


          <form className={styles["register-form"]} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className={styles["register-btn"]}>
              Register
            </button>
          </form>

          <p className={styles["have-account"]}>
            <span style={{ color: "black" }}>Already have an account?</span>{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Side Info */}
        <div className={styles["register-info-section"]}>
          <h1>Join HireHub</h1>
          <p>
            Sign up to access our AI-powered career tools, resume tailoring, and
            smarter job applications.
          </p>
          <div className={styles.illustration}>
            <img src={placeholderImg} alt="AI Assistant" />
          </div>
        </div>

      </div>

      {error && (
        <ErrorMessage
          title={errorTitle}
          description={errorDescription}
          handleClose={handleCloseError}
        />
      )} {success && (
        <SuccessMessage
          title="Registration Successful"
          description="You can now login with your credentials."
          handleClose={handleCloseSuccessAndNavigateToLogin}
          />)}

    </div>


  );
};

export default RegistrationPage;
