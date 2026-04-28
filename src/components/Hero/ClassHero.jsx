// ClassesHero.jsx
import React from 'react';
import './ClassHero.css';

const ClassHero = () => {
  return (
    <section className="classes-hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Our Yoga Classes</h1>
          <p className="hero-subtitle">
            Explore pathways to balance, strength, and inner peace with guided sessions for all levels.
          </p>
          <a href="#schedule" className="hero-cta">View Schedule</a>
        </div>
      </div>
    </section>
  );
};

export default ClassHero;