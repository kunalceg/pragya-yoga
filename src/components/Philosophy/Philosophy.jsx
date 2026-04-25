import React from "react";
import styles from "./Philosophy.module.css";

const Philosophy = () => {
  return (
    <section className={styles.philosophy}>
      <div className={styles.container}>

        {/* LEFT CONTENT */}
        <div className={styles.left}>
          <h2 className={styles.title}>Our Philosophy</h2>

          <p className={styles.text}>
            We believe yoga is a journey toward balance, mindfulness, and inner peace.
            By combining ancient yogic wisdom with modern practices, we help individuals
            improve their physical, mental, and spiritual well-being.
          </p>

          <p className={styles.text}>
            Our goal is to create a supportive community where people grow, connect,
            and inspire each other. Through yoga, we aim to spread positivity,
            harmony, and a healthier lifestyle for a better society.
          </p>

          <button className={styles.btn}>Learn More</button>
        </div>

        {/* RIGHT IMAGE */}
        <div className={styles.right}>
          <img
            src="/images/services/yoga5.png"
            alt="Yoga meditation philosophy"
            className={styles.image}
          />
        </div>

      </div>
    </section>
  );
};

export default Philosophy;