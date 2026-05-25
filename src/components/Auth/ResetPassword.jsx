import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { token } = useParams(); // read token from URL
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ check new and confirm password match
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match!");
      setIsError(true);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.msg || "Password reset successful!");
        setIsError(false);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "Error resetting password");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
      setIsError(true);
    }
  };

  return (
    <div className={styles.resetContainer}>
      <h2>Reset Password</h2>
      <form className={styles.resetForm} onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>

      {message && (
        <p className={isError ? styles.errorMessage : styles.successMessage}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
