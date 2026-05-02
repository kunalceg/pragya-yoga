import React from "react";
import styles from "./Services.module.css";

/* ── JSON-LD Structured Data for SEO ── */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Pragya Yoga Services",
  "description":
    "Authentic Indian yoga classes, meditation sessions, workshops, and community programs offered by Pragya Yoga Alliance in Jaipur, India.",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Yoga Classes", "url": "https://pragyayoga.in/classes" },
    { "@type": "ListItem", "position": 2, "name": "Meditation Sessions", "url": "https://pragyayoga.in/meditation" },
    { "@type": "ListItem", "position": 3, "name": "Yoga Workshops", "url": "https://pragyayoga.in/workshops" },
    { "@type": "ListItem", "position": 4, "name": "Yoga Community", "url": "https://pragyayoga.in/community" },
    { "@type": "ListItem", "position": 5, "name": "Styles of Yoga", "url": "https://pragyayoga.in/styles" }
  ],
};

/* ── Styles of Yoga Data ── */
const YOGA_STYLES = [
  { title: "Hatha Yoga", img: "/images/styles/hatha.jpg", alt: "Hatha Yoga class in Jaipur" },
  { title: "Power Yoga", img: "/images/styles/power.jpg", alt: "Power Yoga session in Jaipur" },
  { title: "Vinyasa Yoga", img: "/images/styles/vinyasa.jpg", alt: "Vinyasa Yoga practice in Jaipur" },
  { title: "Iyengar Yoga", img: "/images/styles/iyengar.jpg", alt: "Iyengar Yoga class in Jaipur" },
  { title: "Therapy Yoga", img: "/images/styles/therapy.jpg", alt: "Therapy Yoga session in Jaipur" },
];

/* ── Existing Services Data ── */
const SERVICES = [
  { icon: "🧘", tag: "Most Popular", title: "Yoga Classes", shortDesc: "Authentic Indian yoga practice", desc: "Experience yoga rooted in Bharat’s timeless tradition...", benefits: ["Traditional Asanas","Scientific wellness approach","Global recognition"], img: "/images/services/yoga1.png", alt: "Yoga classes in Jaipur", href: "/classes", cta: "Explore Classes", featured: true },
  { icon: "🕉️", tag: "Mindfulness", title: "Meditation", shortDesc: "Cultivate inner calm", desc: "Guided meditation sessions rooted in yogic philosophy...", benefits: ["Mental clarity","Stress reduction","Better sleep"], img: "/images/services/yoga_class.png", alt: "Meditation sessions in Jaipur", href: "/meditation", cta: "Start Meditating", featured: false },
  { icon: "📚", tag: "Immersive", title: "Workshops", shortDesc: "Deepen your practice", desc: "Immersive workshops blending authentic Indian yoga tradition...", benefits: ["Expert instruction","Certification available","Holistic learning"], img: "/images/services/workshop.jpg", alt: "Yoga workshops in Jaipur", href: "/workshops", cta: "View Workshops", featured: false },
  { icon: "🤝", tag: "Connect", title: "Community", shortDesc: "Grow together", desc: "Join a warm, inclusive yoga community...", benefits: ["Peer support","Group events","Shared growth"], img: "/images/services/yoga2.png", alt: "Yoga community in Jaipur", href: "/community", cta: "Join Community", featured: false },
];

/* ── Sub-components ── */
const ServiceCard = ({ icon, tag, title, shortDesc, desc, benefits, img, alt, href, cta, featured, index }) => (
  <article className={`${styles.card} ${featured ? styles.cardFeatured : ""}`} itemScope itemType="https://schema.org/Service">
    <div className={styles.cardImgWrap}>
      <img src={img} alt={alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" width="400" height="300" />
      <span className={styles.cardTag}>{tag}</span>
      {featured && <span className={styles.cardBadge}>★ Popular</span>}
      <div className={styles.cardIcon}>{icon}</div>
    </div>
    <div className={styles.cardBody}>
      <p className={styles.cardShort}>{shortDesc}</p>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
      <ul className={styles.cardBenefits}>{benefits.map((b) => <li key={b}>{b}</li>)}</ul>
      <a href={href} className={featured ? styles.btnPrimary : styles.btnOutline}>{cta} →</a>
    </div>
  </article>
);

const StylesOfYogaCard = () => (
  <article className={styles.card}>
    <div className={styles.cardBody}>
      <h3 className={styles.cardTitle}>Styles of Yoga</h3>
      <p className={styles.cardDesc}>
        Explore different yoga traditions — Hatha, Power, Vinyasa, Iyengar, and Therapy Yoga.
      </p>
      <div className={styles.carousel}>
        {YOGA_STYLES.map((style) => (
          <div key={style.title} className={styles.carouselItem}>
            <img src={style.img} alt={style.alt} loading="lazy" />
            <p className={styles.carouselLabel}>{style.title}</p>
          </div>
        ))}
      </div>
    </div>
  </article>
);

/* ── Main Component ── */
const Services = () => (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    <section className={styles.section} id="services">
      <header className={styles.header}>
        <p className={styles.headerLabel}>Our Offerings</p>
        <h2 className={styles.headerTitle}>Authentic Indian Yoga & Global Wellness</h2>
        <p className={styles.headerSub}>
          Rooted in Bharat’s timeless yogic tradition and supported by modern scientific wellness practices,
          Pragya Yoga Alliance in Jaipur brings authentic Indian yoga to the world.
        </p>
      </header>

      <div className={styles.grid}>
        {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} index={i} />)}
        <StylesOfYogaCard />
      </div>

      <div className={styles.cta}>
        <a href="/classes" className={styles.btnPrimary}>Join a Class →</a>
        <a href="/schedule" className={styles.btnOutline}>View Full Schedule</a>
      </div>
    </section>
  </>
);

export default Services;
