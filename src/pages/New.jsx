import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import { useNavigate } from "react-router-dom";

const NewUser = () => {
  const navigate = useNavigate();

  return (
    <RegisterForm
      onToggleToLogin={() => navigate("/login")}
      onRegisterSuccess={() => navigate("/login")}
    />
  );
};

export default NewUser;
