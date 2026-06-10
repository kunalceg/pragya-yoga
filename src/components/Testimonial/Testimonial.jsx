import React, { useState, useCallback, useRef } from 'react';
import styles from './Testimonial.module.css';

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
};

const ytThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
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
  { num: "500+",  label: "Lives Transformed",  icon: "🌸" },
  { num: "4.9★",  label: "Average Rating",      icon: "✦" },
  { num: "18+",   label: "Years of Teaching",   icon: "🕉️" },
  { num: "100%",  label: "Would Recommend",     icon: "🙏" },
];

/* ── Mandala SVG ── */
const MandalaSVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g transform="translate(100,100)" fill="none" stroke="#f25c05">
      {[80, 65, 50, 35, 20].map((r) => (
        <circle key={r} r={r} strokeOpacity="0.5" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1="0" y1="-80" x2="0" y2="80"
          strokeOpacity="0.3" strokeWidth="0.4"
          transform={`rotate(${i * 30})`} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} rx="7" ry="18" strokeOpacity="0.45" strokeWidth="0.4"
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
    <div className={styles.modal} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`${styles.modal__inner} ${review.isShort ? styles.modal__inner_short : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modal__close} onClick={onClose} aria-label="Close">✕</button>
        <iframe
          className={review.isShort ? styles.modal__video_short : styles.modal__video}
          src={review.videoSrc}
          title={`${review.videoTitle} — ${review.name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen loading="lazy"
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
const ReviewCard = ({ review, onPlay, isActive }) => {
  const { category, videoTitle, quote, name, role, thumbSrc, avatarSrc, stars } = review;
  return (
    <article
      className={`${styles.card} ${isActive ? styles.card__active : ''}`}
      onClick={() => onPlay(review)}
      role="listitem"
      aria-label={`Watch: ${videoTitle} by ${name}`}
    >
      {/* Thumbnail */}
      <div className={styles.card__thumb}>
        <img
          className={styles.card__thumbImg}
          src={thumbSrc}
          alt={`${name} — ${category}`}
          loading="lazy" width="400" height="520"
        />
        <div className={styles.card__mandala}><MandalaSVG /></div>
        <div className={styles.card__overlay} />

        {/* Top badge */}
        <span className={styles.card__badge}>{category}</span>

        {/* Logo badge */}
        <div className={styles.card__logoBadge}>🕉️</div>

        {/* Play button */}
        <div className={styles.card__play}>
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </div>

        {/* Gradient footer on thumb */}
        <div className={styles.card__thumbFooter}>
          <div className={styles.card__thumbTitle}>{videoTitle}</div>
        </div>

        {/* Avatar */}
        <div className={styles.card__avatar}>
          <img src={avatarSrc} alt={name} width="48" height="48" />
        </div>
      </div>

      {/* Body */}
      <div className={styles.card__body}>
        {/* Stars */}
        <div className={styles.card__stars} aria-label={`${stars} out of 5`}>
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} className={styles.card__star}>★</span>
          ))}
        </div>

        {/* Quote */}
        <blockquote className={styles.card__quote}>
          <span className={styles.card__quoteOpen}>"</span>
          {quote}
          <span className={styles.card__quoteClose}>"</span>
        </blockquote>

        {/* Author */}
        <footer className={styles.card__author}>
          <div className={styles.card__authorDot} />
          <div>
            <p className={styles.card__authorName}>{name}</p>
            <p className={styles.card__authorSub}>{role}</p>
          </div>
          <div className={styles.card__watchCta}>
            <span>Watch</span>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </footer>
      </div>
    </article>
  );
};

/* ── Main Component ── */
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

      <section className={styles.section} id="testimonials" aria-labelledby="testimonials-heading">
        <div className={styles.glow} aria-hidden="true" />

        {/* ── Header ── */}
        <header className={styles.header}>
          <p className={styles.header__label}>Student Voices</p>
          <h2 id="testimonials-heading" className={styles.header__title}>
            Real <em>Stories,</em> Real Transformations
          </h2>
          <p className={styles.header__sub}>
            Hear directly from our students. Over{" "}
            <strong>500 lives transformed</strong> through expert-guided{" "}
            <strong>yoga classes in Jaipur</strong> — watch their journeys and
            discover the power of{" "}
            <strong>holistic yoga practice at Pragya Yoga Alliance</strong>.
          </p>
        </header>

        {/* ── Cards ── */}
        <div className={styles.grid} role="list">
          {REVIEWS.map((r, i) => (
            <ReviewCard
              key={r.id}
              review={r}
              onPlay={openModal}
              isActive={activeDot === i}
            />
          ))}
        </div>

        {/* ── Dot Nav ── */}
        <nav className={styles.nav} aria-label="Testimonials navigation">
          <button className={styles.nav__btn} onClick={() => setActiveDot(d => Math.max(0, d - 1))} aria-label="Previous">‹</button>
          <div className={styles.nav__dots}>
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                className={`${styles.nav__dot} ${activeDot === i ? styles.active : ''}`}
                onClick={() => setActiveDot(i)}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>
          <button className={styles.nav__btn} onClick={() => setActiveDot(d => Math.min(REVIEWS.length - 1, d + 1))} aria-label="Next">›</button>
        </nav>

        {/* ── Trust Bar ── */}
        <div className={styles.trust} role="list">
          {TRUST_STATS.map(({ num, label, icon }) => (
            <div key={label} className={styles.trust__item} role="listitem">
              <span className={styles.trust__icon}>{icon}</span>
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
