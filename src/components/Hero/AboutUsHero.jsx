import React from "react";
import "./AboutUsHero.css";

const AboutUsHero = () => {
  return (
    <section className="hero">
      <div className="overlay">
        <div className="content center-content">
          <h1 className="fadeUp">
            <span className="hero-title">About Us</span>
          </h1>
          <p className="fadeUpDelay">
            Discover balance, mindfulness, and holistic wellness with our yoga community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHero;