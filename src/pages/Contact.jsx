import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Newsletter from "../components/Newsletter/Newsletter";
import "./Contact.css";

const STUDIO = {
  address:
    "Plot No. 56, Mauji Colony, Pradhan Marg, Malviya Nagar, Jaipur - 302017, Rajasthan",
  phone: "+91 9675547597",
  phoneHref: "+919675547597",
  email: "pragyayogaofficial@gmail.com",
  hours: "Mon – Sat · 6:00 AM – 8:00 PM",
};

const mapsQuery =
  "Pragya Yoga, Mauji Colony, Pradhan Marg, Malviya Nagar, Jaipur, Rajasthan 302017";
const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
  mapsQuery
)}&output=embed`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  mapsQuery
)}`;

const socials = [
  { href: "https://www.facebook.com/pragyayoga.in", label: "Facebook", icon: <FaFacebookF /> },
  { href: "https://www.instagram.com/pragyayogaofficial/", label: "Instagram", icon: <FaInstagram /> },
  { href: "https://www.youtube.com/c/KapilKesari", label: "YouTube", icon: <FaYoutube /> },
  { href: "https://twitter.com/PragyayogaIn", label: "Twitter/X", icon: <FaXTwitter /> },
];

const infoCards = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Visit the Studio",
    lines: [STUDIO.address],
    action: { label: "Get Directions", href: mapsLink, external: true },
  },
  {
    icon: <FaPhoneAlt />,
    title: "Call or WhatsApp",
    lines: [STUDIO.phone],
    action: { label: "Call Now", href: `tel:${STUDIO.phoneHref}` },
  },
  {
    icon: <MdEmail />,
    title: "Email Us",
    lines: [STUDIO.email],
    action: { label: "Send Email", href: `mailto:${STUDIO.email}` },
  },
  {
    icon: <FaClock />,
    title: "Studio Hours",
    lines: [STUDIO.hours, "Sunday · Closed"],
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint wired yet — open the user's mail client with a
    // prefilled enquiry so the form is functional out of the box.
    const subject = encodeURIComponent(`Enquiry from ${form.name || "website visitor"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${STUDIO.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="contact-page">
      {/* ── Header ── */}
      <header className="contact-hero">
        <div className="contact-hero-glow" />
        <motion.div
          className="contact-hero-inner"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="contact-eyebrow" variants={item}>
            <span className="contact-eyebrow-dot" /> We'd love to hear from you
          </motion.span>
          <motion.h1 className="contact-title" variants={item}>
            Get in Touch
          </motion.h1>
          <motion.p className="contact-lead" variants={item}>
            Questions about classes, teacher training, or memberships? Reach out and
            our team will get back to you within one working day.
          </motion.p>
        </motion.div>
      </header>

      {/* ── Info cards ── */}
      <section className="contact-info-section">
        <motion.div
          className="contact-info-grid"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {infoCards.map((card) => (
            <motion.div className="contact-card" key={card.title} variants={item}>
              <div className="contact-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              {card.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {card.action && (
                <a
                  className="contact-card-link"
                  href={card.action.href}
                  {...(card.action.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {card.action.label} →
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Form + Map ── */}
      <section className="contact-main">
        <div className="contact-main-grid">
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>Send us a message</h2>
            <p className="contact-form-sub">
              Fill in the form below and we'll respond as soon as possible.
            </p>

            {sent && (
              <div className="contact-form-note" role="status">
                Thanks! Your email client should have opened with your message ready
                to send.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field-row">
                <label className="contact-field">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </label>
                <label className="contact-field">
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 ..."
                  />
                </label>
              </div>
              <label className="contact-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="contact-field">
                <span>Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="How can we help you?"
                  required
                />
              </label>
              <motion.button
                type="submit"
                className="contact-submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Send Message
              </motion.button>
            </form>

            <div className="contact-quick">
              <a className="contact-quick-btn" href={`tel:${STUDIO.phoneHref}`}>
                <FaPhoneAlt /> Call
              </a>
              <a
                className="contact-quick-btn whatsapp"
                href={`https://wa.me/${STUDIO.phoneHref.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <div className="contact-quick-social">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-map-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="contact-map-head">
              <FaMapMarkerAlt />
              <div>
                <h3>Pragya Yoga Studio</h3>
                <p>{STUDIO.address}</p>
              </div>
            </div>
            <iframe
              className="contact-map"
              title="Pragya Yoga location map"
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
};

export default Contact;
