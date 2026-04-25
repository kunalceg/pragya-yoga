import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ── Left: About ── */}
        <div className="footer-section about">
          <img src="/images/services/logo.png" alt="Pragya Yoga Logo" className="footer-logo" />
          <p>
            Pragya Yoga Alliance was founded with a deep commitment to bringing
            the transformative power of yoga to individuals seeking holistic
            wellness of mind, body &amp; spirit.
          </p>
        </div>

        {/* ── Middle: Quick Links ── */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/class">Classes</a></li>
            <li><a href="/yttc">YTTC</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* ── Right: Contact ── */}
        <div className="footer-section contact">
          <h3>Contact Info</h3>

          <div className="contact-item">
            <div className="contact-icon"><FaMapMarkerAlt /></div>
            <span>Plot No. 56, Mauji Colony, Pradhan Marg, Malviya Nagar, Jaipur - 302017 Rajasthan</span>
          </div>

          <div className="contact-item">
            <div className="contact-icon"><MdEmail /></div>
            <span>pragyayogaofficial@gmail.com</span>
          </div>

          <div className="contact-item">
            <div className="contact-icon"><FaPhone /></div>
            <span>+91 9675547597</span>
          </div>

          <div className="socialIcons">
            <a href="https://www.facebook.com/pragyayoga.in" target="_blank">
            <FaFacebookF /> </a>
            <a href="https://www.instagram.com/pragyayogaofficial/" target="_blank">
            <FaInstagram /> </a>
            <a href="https://www.youtube.com/c/KapilKesari" target="_blank">
            <FaYoutube /> </a>
            <a href="https://twitter.com/PragyayogaIn" target="_blank">
            <FaXTwitter /> </a>
          </div>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <p>Copyright © 2026 <span>Pragya Yoga</span> · All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
