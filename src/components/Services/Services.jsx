import React, { useState } from "react";
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

/* ── Styles of Yoga Slider Data ── */
const YOGA_STYLES = [
  {
    title: "Hatha Yoga",
    img: "/images/services/Hatha_yoga.png",
    alt: "Hatha Yoga class in Jaipur",
    desc: "Classical foundations of breath, posture, and alignment for all levels.",
    href: "/styles/hatha",
  },
  {
    title: "Power Yoga",
    img: "/images/services/Power_Yoga.png",
    alt: "Power Yoga session in Jaipur",
    desc: "Dynamic, strength-building sequences that energise body and mind.",
    href: "/styles/power",
  },
  {
    title: "Vinyasa Yoga",
    img: "/images/services/Vinyasa_Yoga.jpg",
    alt: "Vinyasa Yoga practice in Jaipur",
    desc: "Flowing movement synchronised with breath for grace and endurance.",
    href: "/styles/vinyasa",
  },
  {
    title: "Iyengar Yoga",
    img: "/images/services/Iyengar_Yoga.jpg",
    alt: "Iyengar Yoga class in Jaipur",
    desc: "Precision alignment using props to deepen awareness and stability.",
    href: "/styles/iyengar",
  },
  {
    title: "Therapy Yoga",
    img: "/images/styles/therapy.jpg",
    alt: "Therapy Yoga session in Jaipur",
    desc: "Gentle, restorative practice tailored for healing and recovery.",
    href: "/styles/therapy",
  },
];

/* ── Core Services Offerings Data ── */
const SERVICES = [
  { icon: "🧘", tag: "Most Popular", title: "Yoga Classes", shortDesc: "Authentic Indian yoga practice", desc: "Experience yoga rooted in Bharat's timeless tradition...", benefits: ["Traditional Asanas","Scientific wellness approach","Global recognition"], img: "/images/services/yoga1.png", alt: "Yoga classes in Jaipur", href: "/classes", cta: "Explore Classes", featured: true },
  { icon: "🕉️", tag: "Mindfulness", title: "Meditation", shortDesc: "Cultivate inner calm", desc: "Guided meditation sessions rooted in yogic philosophy...", benefits: ["Mental clarity","Stress reduction","Better sleep"], img: "/images/services/yoga_class.png", alt: "Meditation sessions in Jaipur", href: "/meditation", cta: "Start Meditating", featured: false },
  { icon: "📚", tag: "Immersive", title: "Workshops", shortDesc: "Deepen your practice", desc: "Immersive workshops blending authentic Indian yoga tradition...", benefits: ["Expert instruction","Certification available","Holistic learning"], img: "/images/services/workshop.jpg", alt: "Yoga workshops in Jaipur", href: "/workshops", cta: "View Workshops", featured: false },
  { icon: "🤝", tag: "Connect", title: "Community", shortDesc: "Grow together", desc: "Join a warm, inclusive yoga community...", benefits: ["Peer support","Group events","Shared growth"], img: "/images/services/yoga2.png", alt: "Yoga community in Jaipur", href: "/community", cta: "Join Community", featured: false },
];

/* ── Standard Service Card Component ── */
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

/* ── Refactored Slide-Wise Yoga Traditions Card ── */
const StylesOfYogaCard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (e) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev === YOGA_STYLES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev === 0 ? YOGA_STYLES.length - 1 : prev - 1));
  };

  return (
    <article className={`${styles.card} ${styles.stylesCard}`}>
      <div className={styles.cardBody}>
        <p className={styles.cardShort}>Explore Traditions</p>
        <h3 className={styles.cardTitle}>Styles of Yoga</h3>
        <p className={styles.cardDesc}>
          Discover the full spectrum of yogic disciplines — from classical foundations to dynamic flows and healing therapies.
        </p>

        {/* Carousel Framework Container */}
        <div className={styles.sliderViewport}>
          
          {/* Left Navigation Control Arrow */}
          <button type="button" className={`${styles.sliderNavBtn} ${styles.prevBtn}`} onClick={prevSlide} aria-label="Previous slide">
            ‹
          </button>

          {/* Sliding Track View Wrapper */}
          <div 
            className={styles.sliderTrack} 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {YOGA_STYLES.map((style) => (
              <a key={style.title} href={style.href} className={styles.styleSubCard}>
                <div className={styles.styleSubCardImg}>
                  <img src={style.img} alt={style.alt} loading="lazy" decoding="async" width="200" height="140" />
                </div>
                <div className={styles.styleSubCardBody}>
                  <h4 className={styles.styleSubCardTitle}>{style.title}</h4>
                  <p className={styles.styleSubCardDesc}>{style.desc}</p>
                </div>
                <span className={styles.styleSubCardArrow}>→</span>
              </a>
            ))}
          </div>

          {/* Right Navigation Control Arrow */}
          <button type="button" className={`${styles.sliderNavBtn} ${styles.nextBtn}`} onClick={nextSlide} aria-label="Next slide">
            ›
          </button>
        </div>

        {/* Dynamic Pagination Dot Bars */}
        <div className={styles.dotsContainer}>
          {YOGA_STYLES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.dot} ${idx === currentSlide ? styles.dotActive : ""}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Navigate to slide panel ${idx + 1}`}
            />
          ))}
        </div>

        <a href="/styles" className={styles.btnOutline}>View All Styles →</a>
      </div>
    </article>
  );
};

/* ── Main Layout Controller ── */
const Services = () => (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    <section className={styles.section} id="services">
      <header className={styles.header}>
        <p className={styles.headerLabel}>Our Offerings</p>
        <h2 className={styles.headerTitle}>Authentic Indian Yoga & Global Wellness</h2>
        <p className={styles.headerSub}>
          Rooted in Bharat's timeless yogic tradition and supported by modern scientific wellness practices,
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