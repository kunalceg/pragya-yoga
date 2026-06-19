import React, { useEffect, useState } from 'react';
import AdminQueryProvider from './components/Admin/AdminQueryClient';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from "./components/Navbar/Navbar";
import Footer from './components/Footer/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import BackToTop from './components/common/BackToTop';
import PageTransition from './components/common/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Classes from './pages/Classes';
import YTTC from './pages/YTTC';
import Events from './pages/Events';
import Contact from './pages/Contact';
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

  // Restore session from localStorage on boot
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        const parsed = JSON.parse(savedUser);
        // Only restore if role exists — prevents bad sessions from persisting
        if (parsed && parsed.role) {
          setUser(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved session:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token, userPayload) => {
    // Persist to state — role must exist for protected routes to work
    setUser(userPayload);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#111", color: "#fff" }}>
        <p>Booting Workspace Engine…</p>
      </div>
    );
  }

  const isAdmin   = user?.role === "admin";
  const isStudent = user?.role === "student";
  const isDashboard = isAdmin || isStudent;

  return (
    <BrowserRouter>
      <AppShell
        user={user}
        isAdmin={isAdmin}
        isStudent={isStudent}
        isDashboard={isDashboard}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />
    </BrowserRouter>
  );
};

/* ── Routed shell (lives inside BrowserRouter so it can read the location) ──
 * Adds the global premium scroll experience — progress bar, back-to-top, and
 * graceful page transitions — without touching any routing logic or content. */
const AppShell = ({ user, isAdmin, isStudent, isDashboard, onLogout, onLoginSuccess }) => {
  const location = useLocation();

  // Reset scroll position on every navigation (instant — avoids fighting the
  // page-transition animation).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  // Hide the public chrome (navbar, footer, etc.) only on the actual dashboard
  // routes — not merely because a student/admin is logged in. This lets logged-in
  // users still navigate the public site; the Navbar adapts to show their account.
  const dashboardRoutes = ["/yogaadmin", "/studentdashboard"];
  const onDashboardRoute = dashboardRoutes.includes(location.pathname);

  return (
    <>
      {!onDashboardRoute && <ScrollProgress />}
      {!onDashboardRoute && <Navbar user={user} onLogout={onLogout} />}

      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            {/* ── Public routes ── */}
            <Route path="/"        element={<Home />} />
            <Route path="/about"   element={<About />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/yttc"    element={<YTTC />} />
            <Route path="/events"  element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/newuser"          element={<NewUser />} />
            <Route path="/forgot-password"  element={<ForgotPassword />} />
            <Route path="/reset-password"   element={<ResetPassword />} />
            <Route path="/profile"          element={<Profile />} />

            {/* ── Login: redirect if already logged in ── */}
            <Route
              path="/login"
              element={
                isAdmin   ? <Navigate to="/yogaadmin"        replace /> :
                isStudent ? <Navigate to="/studentdashboard" replace /> :
                            <Login onLoginSuccess={onLoginSuccess} />
              }
            />

            {/* ── Protected: Student ── */}
            <Route
              path="/studentdashboard"
              element={
                isStudent ? <StudentDashboard onLogout={onLogout} /> :
                isAdmin   ? <Navigate to="/yogaadmin" replace /> :
                            <Navigate to="/login"     replace />
              }
            />

            {/* ── Protected: Admin ── */}
            <Route
              path="/yogaadmin"
              element={
                isAdmin   ? <AdminQueryProvider><YogaAdmin onLogout={onLogout} /></AdminQueryProvider> :
                isStudent ? <Navigate to="/studentdashboard" replace /> :
                            <Navigate to="/login"             replace />
              }
            />

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>

      {!onDashboardRoute && <Footer />}
      {!onDashboardRoute && <BackToTop />}
    </>
  );
};

export default App;
