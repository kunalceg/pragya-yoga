import React, { useState, useEffect } from "react";
import styles from "./StudentDashboard.module.css";
import { getStudentProfile } from "../api/StudentServices";

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
  
  // 🎯 State controlling whether the sidebar template is compressed
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getStudentProfile();
        setStudent(data);
        setUnreadNotifs(data.unreadNotifications ?? 0);
      } catch (err) {
        console.error("Failed to load student profile:", err);
        setFetchError("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (fetchError || !student) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>{fetchError || "Please log in to access your dashboard."}</p>
      </div>
    );
  }

  const initials = student.name
    ? student.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const ActivePage = PAGE_MAP[activePage] ?? ProfilePage;

  function handleNav(id) {
    setActivePage(id);
    if (id === "notifications") setUnreadNotifs(0);
  }

  function handleStudentUpdate(updatedStudent) {
    setStudent(updatedStudent);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof onLogout === "function") onLogout();
  }

  return (
    // 🎯 The shell wrapper needs both class styles based on the active state value
    <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>
      
      {/* ── SIDEBAR CONTAINER ── */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
        
        {/* Toggle Collapse and Expand Header */}
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

        {/* Profile Card Summary Section */}
        <div className={styles.sbProfile} onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.profileMeta}>
            <div className={styles.sbName}>{student.name || "Student"}</div>
            <div className={styles.sbPlan}>
              Plan: <span className={styles.sbPlanHighlight}>{student.planMonths ?? 1}-mo</span>
            </div>
          </div>
        </div>

        {/* Dynamic Buttons List */}
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

        {/* Side Draw Footer Action Controls */}
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

      {/* ── MAIN LAYOUT INTERFACE VIEWPORT ── */}
      <main className={styles.main}>
        <ActivePage
          student={student}
          onUpdateSuccess={handleStudentUpdate}
        />
      </main>
    </div>
  );
}