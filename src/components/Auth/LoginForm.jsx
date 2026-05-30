import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

const LoginForm = ({ onLoginSuccess, onToggleToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        // Save the session details inside the web browser's local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert(data.msg || "Login successful!");
        
        // Pass session details up to App.jsx global state manager
        if (onLoginSuccess) {
          onLoginSuccess(data.token, data.user); 
        }

        // Direct Adaptive Routing based on Database User Role
        if (data.user && data.user.role === "admin") {
          navigate("/yogaadmin");
        } else {
          navigate("/studentdashboard");
        }
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Error logging in");
    }
  };

  return (
    <div className={styles.authForm}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        <div className={styles.buttonRow}>
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </button>
        </div>
      </form>

      <p className={styles.toggleAuth}>
        Don’t have an account?{" "}
        {/* 🎯 FIXED: Changed onClick to trigger react-router navigation directly to /register */}
        <button type="button" onClick={() => navigate("/newuser")}>
          New User
        </button>
      </p>
    </div>
  );
};

export default LoginForm;