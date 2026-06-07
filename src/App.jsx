import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Classes from './pages/Classes';
import YTTC from './pages/YTTC';
import Events from './pages/Events';
import Login from './pages/Login';
import NewUser from './pages/New';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Profile from './components/Profile/Profile';
import StudentDashboard from './components/Profile/StudentDashboard';
import YogaAdmin from './components/Admin/YogaAdmin';
import PaymentPage from './components/Payment/PaymentPage';







const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Restore user authentication state from localStorage when the app boots up
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user session data:", e);
      }
    }
    setLoading(false);
  }, []);

  // 2. Shared state modifiers passed down to Login & Dashboard child components
  const handleLoginSuccess = (token, userPayload) => {
    setUser(userPayload);
  };

  const handleLogout = () => {
    // Automatically flush storage clean on manual triggers to prevent role mixups
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Prevent UI flashing while reading localStorage on page reload
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#111", color: "#fff" }}>
        <p>Booting Workspace Engine…</p>
      </div>
    );
  }

  // Determine if the viewport path belongs to a secure dashboard layout panel
  const isDashboard = user && (user.role === "student" || user.role === "admin");

  return (
    <BrowserRouter>
      {/* Only display public header elements if the client is NOT browsing a workspace dashboard */}
      {!isDashboard && <Navbar user={user} onLogout={handleLogout} />}
      
      <Routes>
        {/* 🎯 FIX: Removed the tasks={tasks} prop that was causing the blank screen crash */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/yttc" element={<YTTC />} />
        <Route path="/events" element={<Events />} />
        <Route path="/payment" element={<PaymentPage />} />        
        {/* Pass the login status handler down to your Login form component */}
        <Route 
          path="/login" 
          element={
            !user ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : user.role === "admin" ? (
              <Navigate to="/yogaadmin" replace />
            ) : (
              <Navigate to="/studentdashboard" replace />
            )
          } 
        />
        
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />

        {/* 🔒 PROTECTED ROUTE: Student Workspace Layout Viewport */}
        <Route 
          path='/studentdashboard' 
          element={
            user && user.role === "student" ? (
              <StudentDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* 🔒 PROTECTED ROUTE: Admin Workspace Control Dashboard */}
        <Route 
          path='/yogaadmin' 
          element={
            user && user.role === "admin" ? (
              <YogaAdmin onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch-all global fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Drop out the marketing footer structure context entirely when dashboard views render */}
      {!isDashboard && <Footer />}
    </BrowserRouter>
  );
};

export default App;