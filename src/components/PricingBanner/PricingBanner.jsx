import React from "react";
import styles from "./PricingBanner.module.css";

const Membership = () => (
  <section className={styles.section} id="membership">
    <header className={styles.header}>
      <p className={styles.headerLabel}>Join Our Community</p>
      <h2 className={styles.headerTitle}>
        Transform Your Life with Pragya Yoga
      </h2>
      <p className={styles.headerSub}>
        Over <strong>10,000 members</strong> have embraced <strong>authentic Indian wellness yoga</strong> 
        with Pragya Yoga Alliance in Jaipur. Rooted in <strong>Bharat’s timeless tradition</strong> and 
        supported by <strong>modern scientific wellness practices</strong>, our memberships give you 
        unlimited access to classes, meditations, and exclusive workshops.
      </p>
    </header>

    <div className={styles.grid}>
      <article className={styles.card}>
        <h3 className={styles.cardTitle}>Monthly Membership</h3>
        <p className={styles.cardPrice}>₹999 / month</p>
        <p className={styles.cardDesc}>
          Unlimited yoga classes and meditation sessions. Perfect for beginners and regular practitioners.
        </p>
        <ul className={styles.cardBenefits}>
          <li>Unlimited classes</li>
          <li>Guided meditations</li>
          <li>Community support</li>
        </ul>
        <a href="/membership/monthly" className={styles.btnPrimary}>Start 7-Day Free Trial →</a>
      </article>

      <article className={styles.card}>
        <h3 className={styles.cardTitle}>Annual Membership</h3>
        <p className={styles.cardPrice}>₹9,999 / year</p>
        <p className={styles.cardDesc}>
          Save 20% and enjoy exclusive workshops. Best value for dedicated seekers of holistic wellness.
        </p>
        <ul className={styles.cardBenefits}>
          <li>Unlimited classes</li>
          <li>Exclusive workshops</li>
          <li>Priority community events</li>
        </ul>
        <a href="/membership/annual" className={styles.btnPrimary}>Start 7-Day Free Trial →</a>
      </article>
    </div>
  </section>
);

export default Membership;
