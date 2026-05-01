import React from "react";
import styles from "./Philosophy.module.css";

const Philosophy = () => (
  <section className={styles.section} id="philosophy">
    <header className={styles.header}>
      <p className={styles.headerLabel}>Our Philosophy</p>
      <h2 className={styles.headerTitle}>
        Rooted in Tradition, Guided by Science
      </h2>
      <p className={styles.headerSub}>
        At Pragya Yoga Alliance, our philosophy blends <strong>Bharat’s timeless yogic wisdom</strong> 
        with <strong>modern scientific wellness practices</strong>. We believe yoga is not just exercise, 
        but a <em>holistic path</em> to balance mind, body, and spirit. Through <strong>authentic Indian yoga</strong>, 
        <strong>meditation</strong>, and <strong>community connection</strong>, we share India’s wellness heritage 
        with seekers across the globe.
      </p>
    </header>

    {/* Layout container: image left, content right */}
    <div className={styles.layout}>
      <div className={styles.imageWrap}>
        <img
          src="/images/services/Home_about.jpg"
          alt="Philosophy of Pragya Yoga — authentic Indian wellness"
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Authenticity</h3>
          <p className={styles.cardDesc}>
            Practices rooted in Bharat’s yogic tradition — Asanas, Pranayama, and Dhyana — 
            passed down with integrity and respect.
          </p>
        </article>

        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Science</h3>
          <p className={styles.cardDesc}>
            Supported by modern research on stress reduction, flexibility, and holistic health, 
            making yoga relevant for today’s lifestyle.
          </p>
        </article>

        <article className={styles.card}>
          <h3 className={styles.cardTitle}>Global Wellness</h3>
          <p className={styles.cardDesc}>
            Connecting communities worldwide, sharing India’s wellness heritage, and promoting 
            balance of mind, body, and spirit.
          </p>
        </article>
      </div>
    </div>

    <div className={styles.cta}>
      <a href="/about" className={styles.btnPrimary}>Learn More →</a>
      <a href="/classes" className={styles.btnOutline}>Join a Class</a>
    </div>
  </section>
);

export default Philosophy;
