import React from "react";
import styles from "./EventBooking.module.css";

const EventBooking = () => (
  <section className={styles.section} id="event-booking">
    <header className={styles.header}>
      <h2 className={styles.title}>Book Your Spot</h2>
      <p className={styles.sub}>
        Reserve your place in upcoming yoga classes or special events at Pragya Yoga.
      </p>
    </header>

    <div className={styles.container}>
      {/* Calendar Placeholder */}
      <div className={styles.calendar}>
        <p className={styles.calendarText}>[Calendar Component Here]</p>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <a href="/classes" className={styles.btnPrimary}>Booking Classes →</a>
        <a href="/events" className={styles.btnOutline}>Booking Events →</a>
      </div>
    </div>
  </section>
);

export default EventBooking;
