import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./PricingBanner.module.css";

const Membership = () => (
  <section className={styles.section} id="membership">
    <div className={styles.container}>
      <motion.header className={styles.header} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className={styles.headerLabel}>Join Our Community</p>
        <h2 className={styles.headerTitle}>Transform Your Life with Pragya Yoga</h2>
        <p className={styles.headerSub}>
          Over <strong>10,000 members</strong> have embraced{" "}
          <strong>authentic Indian wellness yoga</strong> with Pragya Yoga
          Alliance in Jaipur. Rooted in{" "}
          <strong>Bharat's timeless tradition</strong> and supported by{" "}
          <strong>modern scientific wellness practices</strong>, our memberships
          give you unlimited access to classes, meditations, and exclusive
          workshops.
        </p>
      </motion.header>

      <div className={styles.grid}>
        <motion.article className={styles.card} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -8 }}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Monthly Membership</h3>
            <p className={styles.cardPrice}>
              <span className={styles.priceCurrency}>₹</span>
              <span className={styles.priceAmount}>999</span>
              <span className={styles.pricePeriod}>/ month</span>
            </p>
          </div>
          <p className={styles.cardDesc}>Unlimited yoga classes and meditation sessions. Perfect for beginners and regular practitioners.</p>
          <ul className={styles.cardBenefits}>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Unlimited classes</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Guided meditations</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Community support</li>
          </ul>
          <Link to="/membership/monthly" className={styles.btnPrimary}>Start 7-Day Free Trial →</Link>
        </motion.article>

        <motion.article className={`${styles.card} ${styles.cardFeatured}`} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -10 }}>
          <div className={styles.cardBadge}>Best Value</div>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Annual Membership</h3>
            <p className={styles.cardPrice}>
              <span className={styles.priceCurrency}>₹</span>
              <span className={styles.priceAmount}>9,999</span>
              <span className={styles.pricePeriod}>/ year</span>
            </p>
          </div>
          <p className={styles.cardDesc}>Save 20% and enjoy exclusive workshops. Best value for dedicated seekers of holistic wellness.</p>
          <ul className={styles.cardBenefits}>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Unlimited classes</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Exclusive workshops</li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Priority community events</li>
          </ul>
          <Link to="/membership/annual" className={styles.btnPrimary}>Start 7-Day Free Trial →</Link>
        </motion.article>
      </div>
    </div>
  </section>
);

export default Membership;
