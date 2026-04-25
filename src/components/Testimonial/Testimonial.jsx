import React from "react";
import styles from "./Testimonial.module.css";

const Testimonial = () => {
  return (
    <section className={styles.section}>
      
      {/* Background text layer */}
      <div className={styles.bgText}></div>

      {/* Testimonial Card */}
      <div className={styles.card}>

        <p className={styles.text}>
          Pragya Yoga completely changed my life. The meditation and
          breathing practices helped me find calm and clarity in my
          daily routine.
        </p>

        <div className={styles.profileArea}>
          <span className={styles.name}>– Anjali S.</span>

          <img
            src="https://randomuser.me/api/portraits/women/65.jpg"
            alt="profile"
            className={styles.profile}
          />
        </div>

        {/* Slider Dots */}
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.active}`}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>

      </div>

    </section>
  );
};

export default Testimonial;