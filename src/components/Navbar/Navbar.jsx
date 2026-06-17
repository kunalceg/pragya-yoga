import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
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

const sidebarVariants = {
  closed: { x: "100%", transition: { type: "spring", damping: 30, stiffness: 260 } },
  open: {
    x: 0,
    transition: { type: "spring", damping: 28, stiffness: 240, when: "beforeChildren", staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const drawerLinkVariants = {
  closed: { opacity: 0, x: 24 },
  open: { opacity: 1, x: 0, transition: { type: "spring", damping: 22, stiffness: 280 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } },
};

const Navbar = ({ user, onLogout }) => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef(null);
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setDropOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "YS";

  const handleLogoutClick = () => {
    setDropOpen(false);
    onLogout?.();
    navigate("/login");
  };

  // Pages whose hero sits directly under the fixed header. Keep the navbar on a
  // solid beige-glass surface here so the links never blend into the image.
  const solidNavPages = ["/about", "/classes", "/yttc", "/events", "/contact"];
  const solidNav = solidNavPages.includes(location.pathname);

  const dashboardPath = user?.role === "admin" ? "/yogaadmin" : "/studentdashboard";

  const dropdownItems = [
    { label: "Dashboard", path: dashboardPath, icon: <DashIcon /> },
    { label: "Profile",   path: "/profile",     icon: <UserIcon /> },
  ];

  return (
    <>
      <header className={`${styles.root} ${scrolled ? styles.scrolled : ""} ${solidNav ? styles.solid : ""}`}>
        {/* ── Top Info Bar ── */}
        <div className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div className={styles.topbarLeft}>
              <a className={styles.topbarItem} href="tel:+919675547597">
                <PhoneIcon /> +91 9675547597
              </a>
              <a className={styles.topbarItem} href="mailto:pragyayogaofficial@gmail.com">
                <MailIcon /> pragyayogaofficial@gmail.com
              </a>
            </div>
            <div className={styles.topbarRight}>
              {socialLinks.map(({ href, label, icon }) => (
                <a key={label} className={styles.socialBtn} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Navigation ── */}
        <nav className={styles.navbar}>
          <div className={styles.navInner}>
            <Link className={styles.logo} to="/">
              <img src="/images/services/logo.png" alt="Pragya Yoga Logo" className={styles.logoImg} />
              <div className={styles.logoText}>
                <span className={styles.logoName}>Pragya Yoga</span>
                <span className={styles.logoTagline}>समत्वं योग उच्यते</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className={styles.navLinks}>
              {navLinks.map(({ label, path }) => (
                <motion.div key={path} whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                  <Link
                    className={`${styles.navLink} ${location.pathname === path ? styles.active : ""}`}
                    to={path}
                  >
                    {label}
                    {location.pathname === path && <motion.div layoutId="nav-indicator" className={styles.navIndicator} transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Theme Toggle */}
            <button className={styles.themeToggle} onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* User Section / Auth */}
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

                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        className={styles.dropdown}
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className={styles.ddHeader}>
                          <div className={styles.ddAvatar}>{initials}</div>
                          <div>
                            <p className={styles.ddName}>{user.name}</p>
                            <p className={styles.ddPlan}>
                              {user.role === "admin" ? "Admin Access" : (user.planMonths ? `${user.planMonths}-month` : "Student")}
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

                        {dropdownItems.map((item, index) => (
                          <button key={index} className={styles.ddItem} onClick={() => navigate(item.path)}>
                            {item.icon}
                            {item.label}
                          </button>
                        ))}

                        <div className={styles.ddDivider} />
                        <button className={`${styles.ddItem} ${styles.ddDanger}`} onClick={handleLogoutClick}>
                          <LogoutIcon /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className={styles.guestBtns}>
                  <Link className={styles.btnGhost} to="/login">Login</Link>
                  <Link className={styles.btnOrange} to="/newuser">New User</Link>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className={styles.drawer}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className={styles.drawerHeader}>
                <span className={styles.drawerTitle}>Menu</span>
                <button className={styles.drawerClose} onClick={() => setMenuOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className={styles.drawerLinks}>
                {navLinks.map(({ label, path }) => (
                  <motion.div key={path} variants={drawerLinkVariants}>
                    <Link
                      className={`${styles.drawerLink} ${location.pathname === path ? styles.drawerActive : ""}`}
                      to={path}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
                {!user && (
                  <motion.div variants={drawerLinkVariants}>
                    <Link className={`${styles.drawerLink} ${location.pathname === "/login" ? styles.drawerActive : ""}`} to="/login" onClick={() => setMenuOpen(false)}>
                      Login
                    </Link>
                  </motion.div>
                )}
              </div>
              <div className={styles.drawerThemeRow}>
                <span className={styles.drawerThemeLabel}>Theme</span>
                <button className={styles.drawerThemeBtn} onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>
              <div className={styles.drawerSocial}>
                {socialLinks.map(({ href, label, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                    {icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

/* ── Theme Icons ── */
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ─── Icons ─── */
const ChevronIcon = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
