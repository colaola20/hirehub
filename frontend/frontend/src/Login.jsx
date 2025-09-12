import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the credentials
    console.log("Username:", username);
    console.log("Password:", password);
    alert("Login submitted!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #6e8efb, #a777e3)",
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          width: "350px",
          padding: "2.5rem 2rem",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        <h2 style={{
          textAlign: "center",
          marginBottom: "1rem",
          color: "#6e8efb",
          fontWeight: 700,
          letterSpacing: "1px",
        }}>Welcome Back</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #6e8efb, #a777e3)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.1rem",
            cursor: "pointer",
            boxShadow: "0 4px 16px 0 rgba(110, 142, 251, 0.2)",
            transition: "background 0.2s",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
