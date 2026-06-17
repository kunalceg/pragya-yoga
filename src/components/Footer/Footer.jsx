import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import "./Footer.css";

const columnVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const socials = [
  { href: "https://www.facebook.com/pragyayoga.in", label: "Facebook", icon: <FaFacebookF /> },
  { href: "https://www.instagram.com/pragyayogaofficial/", label: "Instagram", icon: <FaInstagram /> },
  { href: "https://www.youtube.com/c/KapilKesari", label: "YouTube", icon: <FaYoutube /> },
  { href: "https://twitter.com/PragyayogaIn", label: "Twitter/X", icon: <FaXTwitter /> },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bg" />
      <div className="footer-glow" />
      <div className="footer-container">
        <motion.div className="footer-grid" variants={gridVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          {/* ── About ── */}
          <motion.div className="footer-about" variants={columnVariants}>
            <img src="/images/services/logo.png" alt="Pragya Yoga Logo" className="footer-logo" />
            <p>
              Pragya Yoga Alliance was founded with a deep commitment to bringing
              the transformative power of yoga to individuals seeking holistic
              wellness of mind, body &amp; spirit.
            </p>
            <div className="footer-social">
              {socials.map((s) => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Quick Links ── */}
          <motion.div className="footer-links" variants={columnVariants}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/classes">Classes</Link></li>
              <li><Link to="/yttc">YTTC</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </motion.div>

          {/* ── Contact ── */}
          <motion.div className="footer-contact" variants={columnVariants}>
            <h3>Contact Info</h3>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><FaMapMarkerAlt /></div>
              <span>Plot No. 56, Mauji Colony, Pradhan Marg, Malviya Nagar, Jaipur - 302017 Rajasthan</span>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><MdEmail /></div>
              <span>pragyayogaofficial@gmail.com</span>
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon"><FaPhone /></div>
              <span>+91 9675547597</span>
            </div>
          </motion.div>

          {/* ── Newsletter ── */}
          <motion.div className="footer-newsletter" variants={columnVariants}>
            <h3>Stay Connected</h3>
            <p>Get exclusive updates, insights, and offers directly to your inbox.</p>
            <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" required />
              <motion.button type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>Subscribe</motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>Copyright © 2026 <strong>Pragya Yoga</strong> · All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
