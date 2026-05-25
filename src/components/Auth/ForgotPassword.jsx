import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.msg || "Password reset link sent to your email.");
        setIsError(false);
      } else {
        setMessage(data.error || "Error sending reset link.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
      setIsError(true);
    }
  };

  return (
    <div className={styles.forgotContainer}>
      <h2>Forgot Password</h2>
      <form className={styles.forgotForm} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>

      {message && (
        <p className={isError ? styles.errorMessage : styles.successMessage}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
