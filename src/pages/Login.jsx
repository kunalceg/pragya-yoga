import React from "react";
import LoginForm from "../components/Auth/LoginForm";

// 🎯 FIX: Explicitly accept the onLoginSuccess prop from App.jsx
const Login = ({ onLoginSuccess }) => {
  return (
    <div>
      {/* 🎯 FIX: Pass that prop straight down to LoginForm */}
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default Login;