import React from "react";
import styles from "./TeacherHero.module.css";

const TeacherHero = () => (
  <section className={styles.hero} id="teacher-hero">
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h1 className={styles.title}>200 Hours Yoga Teacher Training Course</h1>
        <p className={styles.desc}>
          Our <strong>200‑Hour Yoga Teacher Training Course (YTTC)</strong> at Pragya Yoga 
          is designed for those who wish to deepen their practice, gain a thorough understanding 
          of yoga philosophy, and embark on the journey of becoming a certified yoga teacher.
        </p>
        <p className={styles.desc}>
          This comprehensive course is <strong>certified by Yoga Alliance</strong>, ensuring 
          that our graduates are recognized globally and equipped with the knowledge and skills 
          to teach yoga safely and effectively.
        </p>
      </div>
    </div>
  </section>
);

export default TeacherHero;
