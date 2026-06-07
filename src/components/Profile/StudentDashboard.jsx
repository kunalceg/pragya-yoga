import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
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

export default function StudentDashboard({ onLogout }) {
  const [student, setStudent]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState("");
  const [activePage, setActivePage]   = useState("profile");
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    async function loadProfile() {
      try {
        // ─── 1. SECURITY TIER GUARD ───
        const savedUser = JSON.parse(localStorage.getItem("user"));
        
        if (!savedUser) {
          setFetchError("Please log in to access your dashboard.");
          setLoading(false);
          return;
        }

        // 🎯 FIX FOR ADMINS: If an admin hits this route, intercept and redirect them to the Admin Portal immediately!
        if (savedUser.role === "admin") {
          console.log("🛡️ Admin account detected in Student space. Redirecting to Management Panel...");
          navigate("/yogaadmin", { replace: true });
          return;
        }

        console.log("Log: Attempting to fetch profile with token:", localStorage.getItem("token"));
        
        // ─── 2. ATTEMPT SERVICE FETCH ───
        try {
          const data = await getStudentProfile();
          console.log("✅ Profile data fetched successfully:", data);
          setStudent(data);
          setUnreadNotifs(data.unreadNotifications ?? 0);
        } catch (apiErr) {
          console.warn("⚠️ API profile fetch failed, using localized cloud login session backup instead:", apiErr.message);
          
          // 🎯 FIX FOR STUDENTS: If the API endpoint fails with an HTML string error, 
          // fall back to our login token data so the screen never displays a crash code!
          setStudent(savedUser);
          setUnreadNotifs(savedUser.unreadNotifications ?? 0);
        }

      } catch (err) {
        console.error("🔥 CRITICAL DASHBOARD LOAD ERROR:", err);
        setFetchError(`Failed to load profile details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#111", color: "#fff" }}>
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (fetchError || !student) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#111", color: "#fff" }}>
        <p>{fetchError || "Access Denied."}</p>
        <button onClick={handleLogout} style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer" }}>Back to Login</button>
      </div>
    );
  }

  // Safely extract names for initials calculation without crashing
  const studentName = student.name || student.email?.split("@")[0] || "User";
  const initials = studentName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const ActivePage = PAGE_MAP[activePage] ?? ProfilePage;

  function handleNav(id) {
    setActivePage(id);
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
          {!isCollapsed && <span className={styles.brandTitle}>Workspace</span>}
          <button 
            type="button"
            className={styles.toggleCollapseBtn} 
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`ti ${isCollapsed ? "ti-layout-sidebar-expand" : "ti-layout-sidebar-collapse"}`} />
          </button>
        </div>

        <div className={styles.sbProfile} onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.profileMeta}>
            <div className={styles.sbName}>{studentName}</div>
            <div className={styles.sbPlan}>
              Plan: <span className={styles.sbPlanHighlight}>{student.planMonths ?? 0}-mo</span>
            </div>
          </div>
        </div>

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
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <i className="ti ti-logout" aria-hidden="true" />
            <span className={styles.navLabel}>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <ActivePage
          student={student}
          onUpdateSuccess={handleStudentUpdate}
        />
      </main>
    </div>
  );
}