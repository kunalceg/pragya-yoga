import React from "react";
import styles from "./NextBatch.module.css";

export default function NextBatch() {
  return (
    <section className={styles.nextBatch}>
      <div className={styles.container}>
        {/* Left Side: Batch Info */}
        <div className={styles.details}>
          <h2 className={styles.sectionTitle}>
            Next Batch Details – Yoga Teacher Training in Jaipur, India
          </h2>
          <ul className={styles.list}>
            <li><strong>Start Date:</strong> November 15, 2024</li>
            <li><strong>Duration:</strong> 200 Hours</li>
            <li><strong>Class Timing:</strong> According to the batch</li>
            <li><strong>Mode:</strong> Online & Offline</li>
            <li><strong>Orientation:</strong> November 12, 2024</li>
          </ul>
          <button className={styles.cta}>Book Your Slot</button>
        </div>

        {/* Right Side: Promo */}
        <div className={styles.promo}>
          <h3 className={styles.promoTitle}>
            Join Our Internationally Accredited 200 Hour Yoga TTC
          </h3>
          <p className={styles.promoDesc}>
            Basic to Advanced Level • 19th Batch • Online & Offline • 
            November 15 – December 30, 2024
          </p>
          <img src="/assets/yoga-pose.jpg" alt="Yoga student practicing asana" className={styles.image}/>
        </div>
      </div>

      {/* ✅ SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "200 Hour Yoga Teacher Training – Next Batch",
          "provider": {
            "@type": "Organization",
            "name": "Pragya Yoga Alliance",
            "url": "https://pragyayoga.in"
          },
          "startDate": "2024-11-15",
          "endDate": "2024-12-30",
          "educationalCredentialAwarded": "Yoga Alliance 200 Hour Certification",
          "courseMode": "Online & Offline",
          "description": "Join the 19th batch of internationally accredited 200 Hour Yoga Teacher Training in Jaipur, India. Includes orientation, flexible timings, and Yoga Alliance certification."
        })}
      </script>
    </section>
  );
}
