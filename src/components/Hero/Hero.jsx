import React from "react";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.fadeUp}>
            <span className={styles.highlight}>Unite Mind, Body & Spirit</span>{" "}
            with Pragya Yoga
          </h1>

          <p className={styles.fadeUpDelay}>
            Bringing the transformative power of yoga to everyone.
          </p>

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Get Started</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;