import React from "react";
import styles from "./Services.module.css";

/* ── JSON-LD Structured Data for SEO ── */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Pragya Yoga Services",
  "description":
    "Authentic Indian yoga classes, meditation sessions, workshops, and community programs offered by Pragya Yoga Alliance in Jaipur, India. Rooted in tradition, supported by science, and aligned with global wellness.",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Yoga Classes",
      "description":
        "Traditional yoga classes in Jaipur, India — guided by certified instructors to improve flexibility, strength, and holistic wellness.",
      "url": "https://pragyayoga.in/classes",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Meditation Sessions",
      "description":
        "Mindfulness and meditation rooted in Bharat’s yogic tradition, reducing stress and enhancing mental clarity.",
      "url": "https://pragyayoga.in/meditation",
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Yoga Workshops",
      "description":
        "Immersive workshops blending authentic Indian yoga tradition with modern scientific wellness practices.",
      "url": "https://pragyayoga.in/workshops",
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Yoga Community",
      "description":
        "A supportive yoga community in Jaipur, India — connecting practitioners globally for shared growth and authentic wellness.",
      "url": "https://pragyayoga.in/community",
    },
  ],
};
const YOGA_STYLES = [
  { title: "Hatha Yoga", img: "/images/styles/hatha.jpg", alt: "Hatha Yoga class in Jaipur" },
  { title: "Power Yoga", img: "/images/styles/power.jpg", alt: "Power Yoga session in Jaipur" },
  { title: "Vinyasa Yoga", img: "/images/styles/vinyasa.jpg", alt: "Vinyasa Yoga practice in Jaipur" },
  { title: "Iyengar Yoga", img: "/images/styles/iyengar.jpg", alt: "Iyengar Yoga class in Jaipur" },
  { title: "Therapy Yoga", img: "/images/styles/therapy.jpg", alt: "Therapy Yoga session in Jaipur" },
];


/* ── DATA ── */
const SERVICES = [
  {
    icon: "🧘",
    tag: "Most Popular",
    title: "Yoga Classes",
    shortDesc: "Authentic Indian yoga practice",
    desc: "Experience yoga rooted in Bharat’s timeless tradition, guided by certified instructors. Improve flexibility, build strength, and nurture holistic well-being with practices recognized worldwide.",
    benefits: ["Traditional Asanas", "Scientific wellness approach", "Global recognition"],
    img: "/images/services/yoga1.png",
    alt: "Yoga classes in Jaipur — authentic Indian yoga tradition with Pragya Yoga",
    href: "/classes",
    cta: "Explore Classes",
    featured: true,
  },
  {
    icon: "🕉️",
    tag: "Mindfulness",
    title: "Meditation",
    shortDesc: "Cultivate inner calm",
    desc: "Guided meditation sessions rooted in yogic philosophy of Bharat. Reduce stress, sharpen focus, and connect with authentic Indian mindfulness practices recognized globally.",
    benefits: ["Mental clarity", "Stress reduction", "Better sleep"],
    img: "/images/services/yoga_class.png",
    alt: "Meditation sessions in Jaipur — authentic Indian mindfulness and stress relief",
    href: "/meditation",
    cta: "Start Meditating",
    featured: false,
  },
  {
    icon: "📚",
    tag: "Immersive",
    title: "Workshops",
    shortDesc: "Deepen your practice",
    desc: "Immersive workshops blending authentic Indian yoga tradition with modern scientific wellness. Learn pranayama, meditation, and holistic techniques for global well-being.",
    benefits: ["Expert instruction", "Certification available", "Holistic learning"],
    img: "/images/services/workshop.jpg",
    alt: "Yoga workshops in Jaipur — authentic Indian yoga and scientific wellness",
    href: "/workshops",
    cta: "View Workshops",
    featured: false,
  },
  {
    icon: "🤝",
    tag: "Connect",
    title: "Community",
    shortDesc: "Grow together",
    desc: "Join a warm, inclusive yoga community in Jaipur, India. Connect with practitioners globally, share authentic Indian wellness traditions, and thrive together.",
    benefits: ["Peer support", "Group events", "Shared growth"],
    img: "/images/services/yoga2.png",
    alt: "Yoga community in Jaipur — authentic Indian yoga and global wellness",
    href: "/community",
    cta: "Join Community",
    featured: false,
  },
];

/* ── SUB-COMPONENTS ── */
const ServiceCard = ({ icon, tag, title, shortDesc, desc, benefits, img, alt, href, cta, featured, index }) => (
  <article
    className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
    itemScope
    itemType="https://schema.org/Service"
  >
    <meta itemProp="provider" content="Pragya Yoga Alliance" />
    <meta itemProp="areaServed" content="Jaipur, Rajasthan, India" />
    <meta itemProp="serviceType" content={title} />

    <div className={styles.cardImgWrap}>
      <img
        src={img}
        alt={alt}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        width="400"
        height="300"
        itemProp="image"
      />
      <span className={styles.cardTag}>{tag}</span>
      {featured && <span className={styles.cardBadge}>★ Popular</span>}
      <div className={styles.cardIcon}>{icon}</div>
    </div>

    <div className={styles.cardBody}>
      <p className={styles.cardShort}>{shortDesc}</p>
      <h3 className={styles.cardTitle} itemProp="name">{title}</h3>
      <p className={styles.cardDesc} itemProp="description">{desc}</p>

      <ul className={styles.cardBenefits}>
        {benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <a href={href} className={featured ? styles.btnPrimary : styles.btnOutline} itemProp="url">
        {cta} →
      </a>
    </div>
  </article>
);
const StylesOfYogaCard = () => (
  <article className={styles.card} itemScope itemType="https://schema.org/Service">
    <meta itemProp="provider" content="Pragya Yoga Alliance" />
    <meta itemProp="areaServed" content="Jaipur, Rajasthan, India" />
    <meta itemProp="serviceType" content="Styles of Yoga" />

    <div className={styles.cardBody}>
      <h3 className={styles.cardTitle} itemProp="name">Styles of Yoga</h3>
      <p className={styles.cardDesc} itemProp="description">
        Explore different yoga traditions — Hatha, Power, Vinyasa, Iyengar, and Therapy Yoga. 
        Each style offers unique benefits for flexibility, strength, healing, and mindfulness.
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


/* ── MAIN COMPONENT ── */
const Services = () => (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    <section className={styles.section} id="services">
      <header className={styles.header}>
        <p className={styles.headerLabel}>Our Offerings</p>
        <h2 className={styles.headerTitle}>
          Authentic Indian Yoga & Global Wellness
        </h2>
        <p className={styles.headerSub}>
                Rooted in <strong>Bharat’s timeless yogic tradition</strong> and supported by 
      <strong>modern scientific wellness practices</strong>, Pragya Yoga Alliance in Jaipur 
      brings <strong>authentic Indian yoga</strong> to the world. Our offerings — 
      <strong>yoga classes</strong>, <strong>meditation sessions</strong>, 
      <strong>holistic workshops</strong>, and a thriving <strong>community</strong> — 
      help you achieve balance of mind, body, and spirit while connecting with 
      <strong>global wellness seekers</strong>.
    </p>
  </header>

      <div className={styles.grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} {...s} index={i} />
        ))}
      </div>
      <div className={styles.grid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} {...s} index={i} />
        ))}
      <StylesOfYogaCard />
      </div>
    <div className={styles.carousel}>
      {YOGA_STYLES.map((style) => (
      <div key={style.title} className={styles.carouselItem}>
      <img src={style.img} alt={style.alt} loading="lazy" />
      <p className={styles.carouselLabel}>{style.title}</p>
      </div>
      ))}
    </div>



      <div className={styles.cta}>
        <a href="/classes" className={styles.btnPrimary}>Join a Class →</a>
        <a href="/schedule" className={styles.btnOutline}>View Full Schedule</a>
      </div>
    </section>
  </>
);

export default Services;
