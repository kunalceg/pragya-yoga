import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Send authentication request to Express API
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        // 2. 🎯 FIX: Formulate a comprehensive payload layout.
        // This guarantees that dashboard metrics (flexibility, badges, etc.)
        // have structure variables to read, completely avoiding blank page runtime crashes.
        const cleanUser = {
          id: data.user?.id || data.user?._id || "mock-id",
          email: data.user?.email || email,
          name: data.user?.name || email.split("@")[0].toUpperCase(), // Falls back to email prefix (e.g. "RAM")
          role: data.user?.role || "student",
          planMonths: data.user?.planMonths || 0,
          planActive: data.user?.planActive || (data.user?.planMonths > 0) || false,
          referralCount: data.user?.referralCount || 0,
          months: data.user?.months || 0,
          certifs: data.user?.certifs || 0,
          
          // Default data structures to guard against "Cannot read property of undefined" errors
          stats: data.user?.stats || { 
            classes: 0, 
            attendancePct: 0 
          },
          progress: data.user?.progress || { 
            flexibility: 0, 
            strength: 0, 
            breathing: 0, 
            meditation: 0 
          },
          badges: data.user?.badges || [] 
        };

        const safeToken = data.token || "mock-valid-token";

        // 3. Persist session tracking credentials to client browser storage memory
        localStorage.setItem("token", safeToken);
        localStorage.setItem("user", JSON.stringify(cleanUser));
        
        alert(data.msg || "Login successful!");
        
        // 🔍 DEV LOGGERS (Inspect console to verify incoming properties)
        console.log("👤 Structured safe client-user profile instance:", cleanUser);
        console.log("🛡️ Authenticated security role tier:", cleanUser.role);

        // 4. Update the global application tracking state inside App.jsx
        if (onLoginSuccess) {
          onLoginSuccess(safeToken, cleanUser); 
        }

        // 5. Explicitly route the page views based on calculated client role states
        setTimeout(() => {
          if (cleanUser.role === "admin") {
            console.log("➡️ Redirecting to admin panel controller...");
            navigate("/yogaadmin", { replace: true });
          } else {
            console.log("➡️ Redirecting to secure student dashboard view...");
            navigate("/studentdashboard", { replace: true });
          }
        }, 100);

      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Engine Fault: ", err);
      alert("Error matching network socket channel destination. Check server terminal instance.");
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
        <button type="button" onClick={() => navigate("/newuser")}>
          New User
        </button>
      </p>
    </div>
  );
};

export default LoginForm;