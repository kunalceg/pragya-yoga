import React from "react";
import styles from "./PricingBanner.module.css";

const PricingBanner = () => {
  return (
    <div className={styles.container}>
      
      <h2 className={styles.title}>Join the Pragya Yoga Community</h2>
      <p className={styles.subtitle}>
        Over 10,000 members have transformed their lives with Pragya Yoga
      </p>

      <div className={styles.pricingWrapper}>

        {/* Monthly */}
        <div className={styles.card}>
          <h3>Monthly Membership</h3>
          <p className={styles.price}>₹999 / month</p>
          <p className={styles.desc}>Unlimited Classes & Meditations</p>
        </div>

        {/* Profile Image */}
        <div className={styles.profileWrapper}>
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="member"
            className={styles.profileImg}
          />
        </div>

        {/* Annual */}
        <div className={styles.card}>
          <h3>Annual Membership</h3>
          <p className={styles.price}>₹9,999 / year</p>
          <p className={styles.desc}>Save 20% + Exclusive Workshops</p>
        </div>

      </div>

      <button className={styles.ctaBtn}>
        Start 7-Day Free Trial
      </button>

    </div>
  );
};

export default PricingBanner;