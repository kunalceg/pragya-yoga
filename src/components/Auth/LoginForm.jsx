import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
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
          // clear form after registration
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setIsRegister(false);
        } else {
          alert(data.error || "Error registering user");
        }
      } catch (err) {
        console.error("Register error:", err);
        alert("Error registering user");
      }
    } else {
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert(data.msg || "Login successful!");
          navigate("/studentdashboard");
        } else {
          alert(data.error || "Invalid credentials");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Error logging in");
      }
    }
  };

  return (
    <div className={styles.authForm}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

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

        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}

        {!isRegister ? (
          <div className={styles.buttonRow}>
            <button type="submit">Login</button>
            <button type="button" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </button>
          </div>
        ) : (
          <button type="submit">Register</button>
        )}
      </form>

      <p className={styles.toggleAuth}>
        {isRegister ? (
          <>
            Already have an account?{" "}
            <button type="button" onClick={() => setIsRegister(false)}>
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button type="button" onClick={() => setIsRegister(true)}>
              Register
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default LoginForm;
