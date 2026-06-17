import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";
import { EASE, spring, usePrefersReducedMotion } from "../../lib/motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const Hero = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);

  // Scroll-linked parallax: layers drift at different speeds as the hero
  // scrolls out, creating depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 40]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0]);

  // Pointer parallax: the visual subtly follows the cursor for a tactile,
  // alive feel (disabled for reduced-motion users).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), spring.gentle);
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), spring.gentle);

  const handlePointer = (e) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetPointer = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.section ref={sectionRef} className={styles.hero} style={{ opacity: heroOpacity }}>
      <div className={styles.bgGradient} />
      <div className={styles.bgPattern} />
      {/* Animated gradient mesh — soft ambient lighting */}
      {!reduced && (
        <motion.div
          className={styles.mesh}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Floating decorative elements */}
      <motion.div className={styles.floatingCircle} style={{ y: orbY }} animate={reduced ? undefined : { y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className={styles.floatingCircle2} animate={reduced ? undefined : { y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className={styles.floatingCircle3} animate={reduced ? undefined : { x: [0, 10, 0], y: [0, -10, 0], opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />

      <div className={styles.content}>
        <motion.div className={styles.textSection} style={{ y: textY }} variants={container} initial="hidden" animate="visible">
          <motion.span className={styles.badge} variants={fadeUp}>
            <span className={styles.badgeDot} /> Authentic Indian Yoga Since 2012
          </motion.span>

          <motion.h1 className={styles.title} variants={fadeUp}>
            <span className={styles.highlight}>Unite Mind, Body & Spirit</span>{" "}
            with Pragya Yoga
          </motion.h1>

          <motion.p className={styles.subtitle} variants={fadeUp}>
            Bringing the transformative power of yoga to everyone.
          </motion.p>

          <motion.div className={styles.buttons} variants={fadeUp}>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} transition={spring.snappy}>
              <Link to="/classes" className={styles.primaryBtn}>
                Get Started
                <motion.svg className={styles.btnArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></motion.svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} transition={spring.snappy}>
              <Link to="/about" className={styles.secondaryBtn}>
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className={styles.trustBar} variants={fadeUp}>
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>500+</span>
              <span className={styles.trustLabel}>Lives Transformed</span>
            </div>
            <div className={styles.trustDot} />
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>18+</span>
              <span className={styles.trustLabel}>Years Experience</span>
            </div>
            <div className={styles.trustDot} />
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>4.9★</span>
              <span className={styles.trustLabel}>Average Rating</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.visualSection}
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          onPointerMove={handlePointer}
          onPointerLeave={resetPointer}
        >
          <motion.div
            className={styles.imageWrapper}
            style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }}
          >
            <img src="/images/services/Home_about.jpg" alt="Pragya Yoga — authentic Indian yoga practice" className={styles.heroImage} />
            <div className={styles.imageShine} />
            <div className={styles.imageAccent} />
            <div className={styles.imageAccent2} />
          </motion.div>

          <motion.div className={styles.floatingCard} initial={{ opacity: 0, x: -20, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ ...spring.soft, delay: 0.9 }}>
            <motion.div className={styles.floatingCardIcon} animate={reduced ? undefined : { y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>🧘</motion.div>
            <div>
              <div className={styles.floatingCardTitle}>Yoga Alliance Certified</div>
              <div className={styles.floatingCardSub}>Globally Recognized</div>
            </div>
          </motion.div>

          <motion.div className={`${styles.floatingCard} ${styles.floatingCard2}`} initial={{ opacity: 0, x: 20, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ ...spring.soft, delay: 1.1 }}>
            <motion.div className={styles.floatingCardIcon} animate={reduced ? undefined : { y: [0, -4, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>🕉️</motion.div>
            <div>
              <div className={styles.floatingCardTitle}>200+ Yoga Sessions</div>
              <div className={styles.floatingCardSub}>Monthly Classes</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      {!reduced && (
        <motion.div className={styles.scrollCue} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} aria-hidden="true">
          <span className={styles.scrollCueLabel}>Scroll</span>
          <motion.span className={styles.scrollCueDot} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      )}
    </motion.section>
  );
};

export default Hero;
