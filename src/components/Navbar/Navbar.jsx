// 🎯 FIX: Added 'useRef' to the React import line
import React, { useState, useEffect, useRef } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Home",    path: "/"        },
  { label: "About",   path: "/about"   },
  { label: "Classes", path: "/classes" },
  { label: "YTTC",    path: "/yttc"    },
  { label: "Events",  path: "/events"  },
  { label: "Contact", path: "/contact" },
];

const socialLinks = [
  { href: "https://www.facebook.com/pragyayoga.in",         label: "Facebook",  icon: <FaFacebookF /> },
  { href: "https://www.instagram.com/pragyayogaofficial/", label: "Instagram", icon: <FaInstagram /> },
  { href: "https://www.youtube.com/c/KapilKesari",          label: "YouTube",   icon: <FaYoutube />   },
  { href: "https://twitter.com/PragyayogaIn",               label: "Twitter/X", icon: <FaXTwitter />  },
];

const Navbar = ({ user, onLogout }) => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  // Close dropdown menu if user clicks anywhere outside of it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Auto-collapse mobile navbar and desktop dropdown overlays when changing pages
  useEffect(() => {
    setDropOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Extract first two letters cleanly from the user's name string
  const initials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "YS";

  const handleLogoutClick = () => {
    setDropOpen(false);
    onLogout?.(); // This triggers our parent cleanup engine in App.jsx
    navigate("/login");
  };

  // 🎯 FIX 1: Dynamically determine dashboard home path based on active user security roles
  const dashboardPath = user?.role === "admin" ? "/yogaadmin" : "/studentdashboard";

  // Sub-menu structure map array loop configuration for dashboard tools
  const dropdownItems = [
    { label: "Dashboard", path: dashboardPath, icon: <DashIcon />, hasBadge: user?.role !== "admin" && user?.planActive },
    { label: "Profile",   path: "/profile",     icon: <UserIcon /> },
    { label: "Payments",  path: user?.role === "admin" ? "/yogaadmin" : "/studentdashboard", icon: <ReceiptIcon /> },
    { label: "Settings",  path: "/settings",    icon: <SettingsIcon /> },
  ];

  return (
    <header className={styles.root}>
      {/* ── Top Info Bar ── */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <a className={styles.topbarItem} href="tel:+919675547597"><span>📞</span> +91 9675547597</a>
          <a className={styles.topbarItem} href="mailto:pragyayogaofficial@gmail.com"><span>✉️</span> pragyayogaofficial@gmail.com</a>
        </div>
        <div className={styles.topbarRight}>
          {socialLinks.map(({ href, label, icon }) => (
            <a key={label} className={styles.socialBtn} href={href} target="_blank" rel="noreferrer" aria-label={label}>
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Main Site Navigation Bar ── */}
      <nav className={styles.navbar}>
        <Link className={styles.logo} to="/">
          <img src="/images/services/logo.png" alt="Pragya Yoga Logo" className={styles.logoImg} />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Pragya Yoga</span>
            <span className={styles.logoTagline}>समत्वं योग उच्यते</span>
          </div>
        </Link>

        {/* Links Navigation Matrix */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          {navLinks.map(({ label, path }) => (
            <Link key={path} className={`${styles.navLink} ${location.pathname === path ? styles.active : ""}`} to={path} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          
          {!user && (
            <>
              <Link className={`${styles.navLink} ${location.pathname === "/login" ? styles.active : ""}`} to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </>
          )}
        </div>

        {/* User Auth Context Cluster Control */}
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userCluster} ref={dropRef}>
              <button className={styles.clusterBtn} onClick={() => setDropOpen(!dropOpen)} aria-expanded={dropOpen} aria-haspopup="true">
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.clusterText}>
                  <span className={styles.clusterName}>{user.name}</span>
                  <span className={styles.clusterPlan}>
                    {user.role === "admin" ? "Administrator" : (user.planMonths ? `${user.planMonths}-month plan` : "Student")}
                  </span>
                </div>
                <ChevronIcon className={`${styles.chevron} ${dropOpen ? styles.chevronOpen : ""}`} />
              </button>

              {/* Dynamic Sub-navigation Dropdown Card */}
              {dropOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.ddHeader}>
                    <div className={styles.ddAvatar}>{initials}</div>
                    <div>
                      <p className={styles.ddName}>{user.name}</p>
                      <p className={styles.ddPlan}>
                        {user.role === "admin" ? "Admin Access" : (user.planMonths ? `${user.planMonths}-month` : "Student")}
                        
                        {/* 🎯 FIX 2: Only check for expired plans if the logged-in identity is NOT an administrator */}
                        {user.role !== "admin" && (
                          <>
                            {" · "}
                            <span className={user.planMonths > 0 ? styles.ddActive : styles.ddExpired}>
                              {user.planMonths > 0 ? "Active" : "Expired"}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Clean Loop Render for Main Navigation Items */}
                  {dropdownItems.map((item, index) => (
                    <button key={index} className={styles.ddItem} onClick={() => navigate(item.path)}>
                      {item.icon}
                      {item.label}
                      {item.hasBadge && <span className={styles.ddBadge}>Active</span>}
                    </button>
                  ))}

                  <div className={styles.ddDivider} />
                  <button className={`${styles.ddItem} ${styles.ddDanger}`} onClick={handleLogoutClick}>
                    <LogoutIcon /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.guestBtns}>
              <Link className={styles.btnGhost} to="/login">Login</Link>
              <Link className={styles.btnOrange} to="/newuser">New User</Link>
            </div>
          )}
        </div>

        {/* Mobile Layout Hamburger Button Menu Toggle */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;

/* ─── SVG Layout Icons Vector Icons ─── */
const ChevronIcon = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const DashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 2h16v20l-4-2-4 2-4-2-4 2V2z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="14" y2="13" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);