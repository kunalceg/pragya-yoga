import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./StudentDashboard.module.css";
import { getStudentProfile } from "../api/StudentServices.js";

import ProfilePage from "./ProfilePage";
import ActivePlanPage from "./ActivePlanPage";
import AttendancePage from "./AttendancePage";
import PaymentsPage from "./PaymentsPage";
import ClassesPage from "./ClassesPage";
import DownloadsPage from "./DownloadsPage";
import ConsultationPage from "./ConsultationPage";
import WorkshopsPage from "./WorkshopsPage";
import ReferralPage from "./ReferralPage";
import NotificationsPage from "./NotificationsPage";

const NAV = [
  { id: "profile",       label: "Profile",         icon: "ti-user"           },
  { id: "plan",          label: "Active plan",     icon: "ti-shield-check"   },
  { id: "attendance",    label: "Attendance",      icon: "ti-calendar-check" },
  { id: "payments",      label: "Payments",        icon: "ti-receipt"        },
  { id: "classes",       label: "Classes",         icon: "ti-yoga"           },
  { id: "downloads",     label: "Downloads",       icon: "ti-download"       },
  { id: "consultations", label: "Consultations",   icon: "ti-stethoscope"    },
  { id: "workshops",     label: "Workshops",       icon: "ti-award"          },
  { id: "referral",      label: "Referral",        icon: "ti-share"          },
  { id: "notifications", label: "Notifications",   icon: "ti-bell"           },
];

const PAGE_MAP = {
  profile:       ProfilePage,
  plan:          ActivePlanPage,
  attendance:    AttendancePage,
  payments:      PaymentsPage,
  classes:       ClassesPage,
  downloads:     DownloadsPage,
  consultations: ConsultationPage,
  workshops:     WorkshopsPage,
  referral:      ReferralPage,
  notifications: NotificationsPage,
};

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

export default function StudentDashboard({ onLogout }) {
  const [student, setStudent]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState("");
  const [activePage, setActivePage]   = useState("profile");
  const [activeParams, setActiveParams] = useState({});
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, [navigate]);

  async function loadProfile() {
      try {
        // ─── 1. SECURITY TIER GUARD ───
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (!savedUser) {
          setFetchError("Please log in to access your dashboard.");
          setLoading(false);
          return;
        }

        // 🎯 FIX FOR ADMINS: If an admin hits this route, redirect to the Admin Portal.
        if (savedUser.role === "admin") {
          navigate("/yogaadmin", { replace: true });
          return;
        }

        // ─── 2. ATTEMPT SERVICE FETCH ───
        try {
          const data = await getStudentProfile();
          setStudent(data);
          setUnreadNotifs(data.unreadNotifications ?? 0);
        } catch (apiErr) {
          // Fall back to the cached login session so the screen never crashes.
          console.warn("Profile fetch failed, using cached session:", apiErr.message);
          setStudent(savedUser);
          setUnreadNotifs(savedUser.unreadNotifications ?? 0);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        setFetchError(`Failed to load profile details: ${err.message}`);
      } finally {
        setLoading(false);
      }
  }

  // Re-fetch the aggregated dashboard after any mutating action so every
  // widget reflects the new MongoDB state.
  async function reloadStudent() {
    try {
      const data = await getStudentProfile();
      setStudent(data);
      setUnreadNotifs(data.unreadNotifications ?? 0);
      return data;
    } catch (err) {
      console.warn("reloadStudent failed:", err.message);
    }
  }

  if (loading) {
    return (
      <div className={styles.bootScreen}>
        <div className={styles.bootCard}>
          <span className={styles.bootSpinner} aria-hidden="true" />
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (fetchError || !student) {
    return (
      <div className={styles.bootScreen}>
        <div className={styles.bootCard}>
          <span className={styles.bootIcon} aria-hidden="true"><i className="ti ti-lock" /></span>
          <p>{fetchError || "Access Denied."}</p>
          <button onClick={handleLogout} className={styles.bootBtn}>Back to Login</button>
        </div>
      </div>
    );
  }

  // Safely extract names for initials calculation without crashing
  const studentName = student.name || student.email?.split("@")[0] || "User";
  const initials = studentName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const ActivePage = PAGE_MAP[activePage] ?? ProfilePage;

  function handleNav(id, params = {}) {
    setActivePage(id);
    setActiveParams(params);
    if (id === "notifications") setUnreadNotifs(0);
  }

  function handleStudentUpdate(updatedStudent) {
    setStudent(updatedStudent);
    localStorage.setItem("user", JSON.stringify(updatedStudent)); // Keep storage synced
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof onLogout === "function") {
      onLogout();
    }
    navigate("/");
  }

  return (
    <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>

      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>

        <div className={styles.toggleHeader}>
          <span className={styles.brandMark} aria-hidden="true"><i className="ti ti-lotus" /></span>
          {!isCollapsed && <span className={styles.brandTitle}>Workspace</span>}
          <button
            type="button"
            className={styles.toggleCollapseBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`ti ${isCollapsed ? "ti-layout-sidebar-right-expand" : "ti-layout-sidebar-left-collapse"}`} />
          </button>
        </div>

        <button type="button" className={styles.sbProfile} onClick={() => handleNav("profile")}>
          <div className={styles.avatar}>
            {initials}
            <span className={styles.avatarDot} aria-hidden="true" />
          </div>
          <div className={styles.profileMeta}>
            <div className={styles.sbName}>{studentName}</div>
            <div className={styles.sbPlan}>
              Plan: <span className={styles.sbPlanHighlight}>{student.planMonths ?? 0}-mo</span>
            </div>
          </div>
        </button>

        <nav className={styles.nav} aria-label="Dashboard Navigation">
          {NAV.map(({ id, label, icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navActive : ""}`}
                onClick={() => handleNav(id)}
                aria-current={isActive ? "page" : undefined}
                title={isCollapsed ? label : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="studentNavPill"
                    className={styles.navPill}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden="true"
                  />
                )}
                <i className={`ti ${icon}`} aria-hidden="true" />
                <span className={styles.navLabel}>{label}</span>
                {id === "notifications" && unreadNotifs > 0 && !isCollapsed && (
                  <span className={styles.notifBadge} role="status">{unreadNotifs}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={styles.sbFooter}>
          <button type="button" className={styles.enrollBtn} onClick={() => handleNav("classes")}>
            <i className="ti ti-plus" aria-hidden="true" />
            <span className={styles.navLabel}>Enroll / Book</span>
          </button>
          <button type="button" className={styles.navItem} onClick={() => navigate("/")} title={isCollapsed ? "Back to Website" : undefined}>
            <i className="ti ti-arrow-left" aria-hidden="true" />
            <span className={styles.navLabel}>Back to Website</span>
          </button>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <i className="ti ti-logout" aria-hidden="true" />
            <span className={styles.navLabel}>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ActivePage
                student={student}
                onUpdateSuccess={handleStudentUpdate}
                reload={reloadStudent}
                onNavigate={handleNav}
                workshopId={activeParams.workshopId}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
