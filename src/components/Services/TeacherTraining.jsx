import React from "react";
import styles from "./TeacherTraining.module.css";

const TeacherTraining = () => (
  <section className={styles.section} id="teacher-training">
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>200 Hours Yoga Teacher Training Course</h2>
        <p className={styles.desc}>
          Our <strong>200‑Hour Yoga Teacher Training Course (YTTC)</strong> at Pragya Yoga 
          is designed for those who wish to deepen their practice, gain a thorough understanding 
          of yoga philosophy, and embark on the journey of becoming a certified yoga teacher.
        </p>
        <p className={styles.desc}>
          This comprehensive course is <strong>Certified by Yoga Alliance</strong> — the most 
          recognizable organization of teachers in the world — ensuring that our graduates are 
          recognized globally and equipped with the knowledge and skills to teach yoga safely 
          and effectively.
        </p>
        <div className={styles.actions}>
          <a href="/register" className={styles.btnPrimary}>Register →</a>
        </div>
      </div>
      <div className={styles.imageWrap}>
        <img 
          src="/images/training/teacher-training.jpg" 
          alt="Yoga Teacher Training Course at Pragya Yoga" 
          loading="lazy" 
        />
      </div>
    </div>
  </section>
);

export default TeacherTraining;
