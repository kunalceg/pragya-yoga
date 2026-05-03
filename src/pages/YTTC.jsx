import React from "react";
import TeacherHero from "../components/Hero/TeacherHero";
import TeacherTraining from "../components/Services/TeacherTraining";
import TeacherCourse from "../components/Services/TeacherCourse";
import CourseFeatures from "../components/Services/CourseFeature";
import NextBatch from "../components/Newsletter/NextBatch";
import ChooseUs from "../components/Achievements/ChooseUs";
import FAQSection from "../components/Testimonial/FAQSection";

const YTTC = () => {
  return (
    <div>
      <TeacherHero />
      <TeacherTraining />
      <TeacherCourse />
      <CourseFeatures />
      <NextBatch />
      <ChooseUs />
      <FAQSection />
    </div>
  );
};

export default YTTC;
