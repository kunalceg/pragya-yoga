import { useState } from "react";
import styles from "./StudentDashboard.module.css";

import ProfilePage from "./ProfilePage";
import ActivePlanPage    from "./ActivePlanPage";
import AttendancePage    from "./AttendancePage";
import PaymentsPage      from "./PaymentsPage";
import ClassesPage       from "./ClassesPage";
import DownloadsPage     from "./DownloadsPage";
import ConsultationPage  from "./ConsultationPage";
import WorkshopsPage     from "./WorkshopsPage";
import ReferralPage      from "./ReferralPage";
import NotificationsPage from "./NotificationsPage";

const NAV = [
  { id: "profile",       label: "Profile",        icon: "ti-user"           },
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

export default function StudentDashboard({ student }) {
  const [activePage, setActivePage]           = useState("profile");
  const [unreadNotifs, setUnreadNotifs]       = useState(3);

  const initials = student?.name
    ? student.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "YS";

  const ActivePage = PAGE_MAP[activePage];

  function handleNav(id) {
    setActivePage(id);
    if (id === "notifications") setUnreadNotifs(0);
  }

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sbProfile}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <div className={styles.sbName}>{student?.name ?? "Student"}</div>
            <div className={styles.sbPlan}>
              Plan:{" "}
              <span className={styles.sbPlanHighlight}>
                {student?.planMonths ?? 1}-month
              </span>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`${styles.navItem} ${activePage === id ? styles.navActive : ""}`}
              onClick={() => handleNav(id)}
            >
              <i className={`ti ${icon}`} aria-hidden="true" />
              <span>{label}</span>
              {id === "notifications" && unreadNotifs > 0 && (
                <span className={styles.notifBadge}>{unreadNotifs}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.sbFooter}>
          <button className={styles.enrollBtn} onClick={() => handleNav("classes")}>
            <i className="ti ti-plus" aria-hidden="true" />
            Enroll / Book
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className={styles.main}>
        <ActivePage student={student} />
      </main>
    </div>
  );
}
