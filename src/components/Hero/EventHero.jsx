import React from "react";
import styles from "./EventHero.module.css";

const EventHero = () => (
  <section className={styles.hero} id="event-hero">
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h1 className={styles.title}>Upcoming Yoga Events</h1>
        <p className={styles.desc}>
          Join Pragya Yoga for immersive workshops, retreats, and community
          gatherings. Our events bring together practitioners from around the
          world to celebrate authentic Indian yoga, mindfulness, and holistic
          wellness.
        </p>
        <p className={styles.desc}>
          Whether you’re seeking deeper practice, spiritual connection, or
          simply a rejuvenating experience, our events are designed to inspire
          and transform.
        </p>
        <div className={styles.actions}>
          <a href="/events" className={styles.btnPrimary}>View All Events →</a>
          <a href="/register-event" className={styles.btnOutline}>Register Now</a>
        </div>
      </div>
    </div>
  </section>
);

export default EventHero;
