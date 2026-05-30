import React, { useState } from "react";
import styles from "./LoginForm.module.css"; // Uses the same style variables module sheet cleanly

const RegisterForm = ({ onRegisterSuccess, onToggleToLogin }) => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.msg || "Registered successfully!");
        
        // Clear all field values out of view state
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Optional callback hook or switch the view instantly back to login frame
        if (onRegisterSuccess) {
          onRegisterSuccess();
        } else {
          onToggleToLogin();
        }
      } else {
        alert(data.error || "Error registering user");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Error registering user");
    }
  };

  return (
    <div className={styles.authForm}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        <button type="submit">Register</button>
      </form>

      <p className={styles.toggleAuth}>
        Already have an account?{" "}
        <button type="button" onClick={onToggleToLogin}>
          Login
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;