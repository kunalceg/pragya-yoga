import React, { useState, useCallback } from 'react';
import styles from './Testimonial.module.css';

/* ─────────────────────────────────────
   JSON-LD Structured Data for SEO
   Helps Google show star ratings in
   search results (rich snippets)
───────────────────────────────────── */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Pragya Yoga Alliance",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "500",
    "bestRating": "5",
    "worstRating": "1",
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Kreety Dang" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Pragya Yoga has completely transformed my life. Dr. Kapil's guidance and the supportive community made every session truly special.",
      "name": "Transformative Story",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Aariana" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "The yoga classes here go far beyond physical practice. I found mental clarity and inner peace I had been searching for years.",
      "name": "Transformative Story",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Komal Panwar" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "My wellness journey started here. Therapy yoga sessions helped me recover from chronic back pain completely.",
      "name": "Voice of Wellness",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Vikas Sharma" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "Joining Pragya Yoga was the best investment in my health. The instructors are world-class and the curriculum is outstanding.",
      "name": "Transformative Story",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Pragya Yoga Student" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "An incredible wellness journey at Pragya Yoga Alliance. The holistic approach to yoga changed my perspective on health and well-being.",
      "name": "Wellness Journey",
    },
  ],
};

/* ─────────────────────────────────────
   REVIEWS DATA
   Real YouTube video IDs wired in.
   Shorts use /embed/{id} — same as
   regular videos, YouTube handles it.
   Thumbnails use hqdefault from YT CDN.
───────────────────────────────────── */

// Helper: YouTube HQ thumbnail from video ID
const ytThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

// Helper: YouTube embed URL (works for both Shorts & regular videos)
const ytEmbed = (id) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

const REVIEWS = [
  {
    id: 1,
    category: "Transformative Story",
    videoTitle: "Kreety's Yoga Journey",
    quote: "Pragya Yoga has completely transformed my life. Dr. Kapil's expert guidance and the warmth of the community made every session deeply special and enriching.",
    name: "Kreety Dang",
    role: "Hatha Yoga · Jaipur",
    videoId: "UNn2uSFeGCE",
    isShort: true,
    stars: 5,
  },
  {
    id: 2,
    category: "Transformative Story",
    videoTitle: "Aariana's Path to Wellness",
    quote: "The yoga classes here go far beyond physical practice. I found mental clarity and inner peace I had been searching for years. Truly life-changing.",
    name: "Aariana",
    role: "Vinyasa Flow · Delhi",
    videoId: "IZdubp4t0P0",
    isShort: true,
    stars: 5,
  },
  {
    id: 3,
    category: "Voice of Wellness",
    videoTitle: "Komal's Recovery Story",
    quote: "My wellness journey started here. The therapy yoga sessions helped me recover from chronic back pain completely. I am pain-free and stronger than ever.",
    name: "Komal Panwar",
    role: "Therapy Yoga · Jaipur",
    videoId: "C98XQgUVbLM",
    isShort: true,
    stars: 5,
  },
  {
    id: 4,
    category: "Transformative Story",
    videoTitle: "Vikas's Strength Journey",
    quote: "Joining Pragya Yoga was the best investment in my health. The instructors are world-class and the structured curriculum is outstanding in every way.",
    name: "Vikas Sharma",
    role: "Ashtanga Yoga · Mumbai",
    videoId: "QQUvaPoazM0",
    isShort: true,
    stars: 5,
  },
  {
    id: 5,
    category: "Wellness Journey",
    videoTitle: "A Holistic Yoga Experience",
    quote: "An incredible wellness journey at Pragya Yoga Alliance. The holistic approach changed my perspective on health completely. Every class is a transformative experience.",
    name: "Pragya Yoga Student",
    role: "Yoga Student · India",
    videoId: "0Ku1eMLaoL4",
    isShort: false,
    stars: 5,
  },
].map(r => ({
  ...r,
  thumbSrc: ytThumb(r.videoId),
  avatarSrc: ytThumb(r.videoId),
  videoSrc: ytEmbed(r.videoId),
}));

const TRUST_STATS = [
  { num: "500+", label: "Happy Students" },
  { num: "4.9 ★", label: "Average Rating" },
  { num: "18+",  label: "Years Teaching" },
  { num: "100%", label: "Recommend Us" },
];

/* ── Mandala SVG ── */
const MandalaSVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g transform="translate(100,100)" fill="none" stroke="#f25c05">
      {[80, 65, 50, 35, 20].map((r) => (
        <circle key={r} r={r} strokeOpacity="0.6" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="0" y1="-80" x2="0" y2="80"
          strokeOpacity="0.35" strokeWidth="0.4"
          transform={`rotate(${i * 30})`} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} rx="7" ry="18" strokeOpacity="0.5" strokeWidth="0.4"
          transform={`rotate(${i * 45}) translate(0,-65)`} />
      ))}
      <circle r="4" fill="#f25c05" fillOpacity="0.5" strokeWidth="0" />
    </g>
  </svg>
);

/* ── Video Modal ── */
const VideoModal = ({ review, onClose }) => {
  if (!review) return null;
  return (
    <div
      className={styles.modal}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Video testimonial by ${review.name}`}
    >
      <div
        className={`${styles.modal__inner} ${review.isShort ? styles.modal__inner_short : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modal__close} onClick={onClose} aria-label="Close video">✕</button>
        <iframe
          className={review.isShort ? styles.modal__video_short : styles.modal__video}
          src={review.videoSrc}
          title={`${review.videoTitle} — ${review.name} | Pragya Yoga Alliance Student Testimonial`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <div className={styles.modal__info}>
          <p className={styles.modal__name}>{review.videoTitle}</p>
          <p className={styles.modal__role}>{review.name} · {review.role} · Pragya Yoga Alliance</p>
        </div>
      </div>
    </div>
  );
};

/* ── Review Card ── */
const ReviewCard = ({ review, onPlay }) => {
  const { category, videoTitle, quote, name, role, thumbSrc, avatarSrc, stars } = review;
  return (
    <article
      className={styles.card}
      onClick={() => onPlay(review)}
      role="listitem"
      itemScope
      itemType="https://schema.org/Review"
      aria-label={`Watch video testimonial: ${videoTitle} by ${name}`}
    >
      <meta itemProp="author" content={name} />
      <meta itemProp="reviewBody" content={quote} />

      {/* Thumbnail */}
      <div className={styles.card__thumb}>
        <img
          className={styles.card__thumbImg}
          src={thumbSrc}
          alt={`${name} — ${category} at Pragya Yoga Alliance, Jaipur`}
          loading="lazy"
          width="400"
          height="250"
        />
        <div className={styles.card__mandala}><MandalaSVG /></div>
        <div className={styles.card__overlay} aria-hidden="true" />
        <span className={styles.card__badge}>{category}</span>
        <div className={styles.card__logoBadge} aria-hidden="true">🕉️</div>
        <div className={styles.card__play} aria-label={`Play ${videoTitle}`}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className={styles.card__avatar}>
          <img src={avatarSrc} alt={`${name}, Pragya Yoga student`} width="52" height="52" />
        </div>
      </div>

      {/* Body */}
      <div className={styles.card__body}>
        <p className={styles.card__category}>{category}</p>
        <h3 className={styles.card__videoTitle}>{videoTitle}</h3>
        <div className={styles.card__divider} aria-hidden="true" />
        <div
          className={styles.card__stars}
          aria-label={`${stars} out of 5 stars`}
          itemScope itemType="https://schema.org/Rating"
        >
          <meta itemProp="ratingValue" content={String(stars)} />
          <meta itemProp="bestRating" content="5" />
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} className={styles.card__star} aria-hidden="true">★</span>
          ))}
        </div>
        <blockquote
          className={styles.card__quote}
          cite={`https://pragyayoga.in/testimonials`}
          itemProp="reviewBody"
        >
          "{quote}"
        </blockquote>
        <footer className={styles.card__author}>
          <div className={styles.card__authorLine} aria-hidden="true" />
          <div>
            <p className={styles.card__authorName} itemProp="author">{name}</p>
            <p className={styles.card__authorSub}>{role}</p>
          </div>
        </footer>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
const Testimonials = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeDot, setActiveDot]     = useState(0);
  const openModal  = useCallback((r) => setActiveModal(r), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <section
        className={styles.section}
        id="testimonials"
        aria-labelledby="testimonials-heading"
        itemScope
        itemType="https://schema.org/LocalBusiness"
      >
        <meta itemProp="name" content="Pragya Yoga Alliance" />
        <meta itemProp="address" content="Malviya Nagar, Jaipur, Rajasthan 302017, India" />

        <div className={styles.glow} aria-hidden="true" />

        {/* Header */}
        <header className={styles.header}>
          <p className={styles.header__label} aria-hidden="true">Student Voices</p>
          <h2 id="testimonials-heading" className={styles.header__title}>
            Real <em>Stories,</em> Real<br />Transformations
          </h2>
          <p className={styles.header__sub}>
            Hear directly from our students. Over{" "}
            <strong>500 lives transformed</strong> through expert-guided{" "}
            <strong>yoga classes in Jaipur</strong> — watch their journeys and
            discover the power of{" "}
            <strong>holistic yoga practice at Pragya Yoga Alliance</strong>.
          </p>
        </header>

        {/* Cards */}
        <div
          className={styles.grid}
          role="list"
          aria-label="Video testimonials from Pragya Yoga students"
        >
          {REVIEWS.map((r) => (
            <ReviewCard key={r.id} review={r} onPlay={openModal} />
          ))}
        </div>

        {/* Dot nav */}
        <nav className={styles.nav} aria-label="Testimonial pages">
          <button className={styles.nav__btn} aria-label="Previous" onClick={() => setActiveDot(d => Math.max(0, d - 1))}>‹</button>
          <div className={styles.nav__dots} role="group">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                className={`${styles.nav__dot} ${activeDot === i ? styles.active : ''}`}
                aria-label={`Review ${i + 1}`}
                aria-current={activeDot === i ? 'true' : undefined}
                onClick={() => setActiveDot(i)}
              />
            ))}
          </div>
          <button className={styles.nav__btn} aria-label="Next" onClick={() => setActiveDot(d => Math.min(REVIEWS.length - 1, d + 1))}>›</button>
        </nav>

        {/* Trust bar */}
        <div className={styles.trust} role="list" aria-label="Student satisfaction stats">
          {TRUST_STATS.map(({ num, label }) => (
            <div key={label} className={styles.trust__item} role="listitem">
              <span className={styles.trust__num}>{num}</span>
              <span className={styles.trust__label}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {activeModal && <VideoModal review={activeModal} onClose={closeModal} />}
    </>
  );
};

export default Testimonials;
