// LoginPage.jsx
// This component renders the login page for HireHub, including branding, login form, and info section.
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./login_Page.module.css";
import jwt_decode from "jwt-decode";
import githubLogo from "../../public/assets/github.png";
import linkedinLogo from "../../public/assets/linkedin.png";
import googleLogo from "../../public/assets/google.png";
import placeholderImg from "../../public/assets/login_reg_Place_holder1.png";
import ErrorMessage from "../components/UsersMessages/Error.jsx";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setErrorMessage] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const error = searchParams.get("error");

    if (error) {
      handleErrorMessage("OAuth Login Failed", error);
      return;
    }

    if (token && username) {
      localStorage.setItem("token", token);

      navigate(`/${username}`);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Flask sends "access_token", not "token"
        localStorage.setItem("token", data.access_token);

        try {
          
          const username = data.data?.username;
          if (username) {
            navigate(`/${username}`);
          } else {
            navigate("/");
          }
        } catch (err) {
          console.warn("Failed to decode token:", err);
          navigate("/");
        }

      } else {
        handleErrorMessage("Login Failed", data.message || "Login failed. Please try again.");
        
      }
    } catch (error) {
      console.error("Backend not available:", error);
      navigate("/home"); // fallback while backend isn’t ready
    }
  };

const handleErrorMessage = (title, description) => {
    setErrorTitle(title);
    setErrorDescription(description);
    setErrorMessage(true);
  }

const handleCloseError = () => {
    setErrorMessage(false);
  }

  console.log(styles.signUpLink);

  
  return (
  <div className={styles.container}>
    <div className={styles["login-box"]}>
      <div className={styles["login-form-section"]}>
        <Link to="/" className={styles.brand} style={{ textDecoration: "none" }}>
        <div className={styles.logo}>H</div>
        <div className={styles["brand-text"]}>
          <h2 className={styles["brand-title"]}>ireHub</h2>
          <p className={styles["brand-tagline"]}>Your AI Career Companion</p>
        </div>
      </Link>


        <form className={styles["login-form"]} onSubmit={handleSubmit}>
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

          <button type="submit" className={styles["login-btn"]}>
            Login
          </button>

          <div style={{ color: "black", padding: "0 0 0 20px " }}>
            or login with
          </div>
          <div className={styles["buttons-wrapper"]}>
            <button
              type="button"
              className={styles["google-btn"]}
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:5001/api/login/google")
              }
            >
              <img src={googleLogo} alt="Google logo" className={styles.Buttonlogo} />
            </button>

            <button
              type="button"
              className={styles["github-btn"]}
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:5001/api/login/github")
              }
            >
              <img src={githubLogo} alt="GitHub logo" className={styles.Buttonlogo} />
            </button>

            <button
              type="button"
              className={styles["linkedIn-btn"]}
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:5001/api/login/linkedin")
              }
            >
              <img
                src={linkedinLogo}
                alt="LinkedIn logo"
                className={styles.Buttonlogo}
              />
            </button>
          </div>
        </form>

        <div className={styles["login-options"]}>
          <Link className={styles.forgotPs} to="/forgot_password">Forgot Password?</Link>
        </div>

        <p className={styles["no-account"]}>
          <span style={{ color: "black" }}>Don’t have an account?</span>{" "}
          <Link className={styles.signUpLink} to="/registration">Sign up</Link>
        </p>
      </div>

      <div className={styles["login-info-section"]}>
        <h1>Smarter Job Applications</h1>
        <p>
          Tailor your resume & cover letter instantly with AI to land your
          dream job faster.
        </p>
        <div className={styles.illustration}>
          <img src={placeholderImg} alt="AI Assistant" />
        </div>
      </div>
    </div>

    <>
      {error && (
      <ErrorMessage
          title={errorTitle}
          description={errorDescription}
          handleClose={handleCloseError}
        />
      )}
    </>

  </div>

);
};

export default Login;
