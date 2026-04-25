// src/pages/About.jsx
import React from "react";
import AboutUsHero from "../components/Hero/AboutUsHero";
import AboutSection from "../components/Philosophy/AboutPhilosophy";
import Achievements from "../components/Achievements/Achievements";
import Instructor from "../components/Instructor/Instructor";
import StudioSection from "../components/Studio/Studio";
import PartnersSection from "../components/Partner/Partners";
const About = () => {
  return (
    <div>
        <AboutUsHero />
        <AboutSection />
        <Achievements />
        <Instructor />
        <StudioSection />
        <PartnersSection />
    </div>
  )
}

export default About