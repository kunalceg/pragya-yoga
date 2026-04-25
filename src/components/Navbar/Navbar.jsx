import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Classes', path: '/classes' },
  { label: 'YTTC', path: '/yttc' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
  { label: 'Login', path: '/login' },
];

const socialLinks = [
  { href: 'https://www.facebook.com/pragyayoga.in', label: 'Facebook', icon: <FaFacebookF /> },
  { href: 'https://www.instagram.com/pragyayogaofficial/', label: 'Instagram', icon: <FaInstagram /> },
  { href: 'https://www.youtube.com/c/KapilKesari', label: 'YouTube', icon: <FaYoutube /> },
  { href: 'https://twitter.com/PragyayogaIn', label: 'Twitter/X', icon: <FaXTwitter /> },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.root}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <a className={styles.topbarItem} href="tel:+919675547597">
            <span className={styles.icon}>📞</span>
            +91 9675547597
          </a>
          <a className={styles.topbarItem} href="mailto:pragyayogaofficial@gmail.com">
            <span className={styles.icon}>✉️</span>
            pragyayogaofficial@gmail.com
          </a>
        </div>
        <div className={styles.topbarRight}>
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={label}
              className={styles.socialBtn}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <Link className={styles.logo} to="/">
          <img src="/images/services/logo.png" alt="Pragya Yoga Logo" className={styles.logoImg} />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Pragya Yoga</span>
            <span className={styles.logoTagline}>Mind · Body · Spirit</span>
          </div>
        </Link>

        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              className={`${styles.navLink} ${location.pathname === path ? styles.active : ''}`}
              to={path}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>

        <a className={styles.navCta} href="tel:+919675547597">
          📞 +91 9675547597
        </a>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`}></span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
