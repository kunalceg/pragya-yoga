import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import { useNavigate } from "react-router-dom";

const NewUser = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* You can easily add page-specific layouts here later (like a background banner) */}
      <RegisterForm 
        onToggleToLogin={() => navigate("/login")} 
        onRegisterSuccess={() => navigate("/login")}
      />
    </div>
  );
};

export default NewUser;