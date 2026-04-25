import React from "react";
import styles from "./Services.module.css";

const services = [
  {
    title: "Yoga Classes",
    desc: "Find your flow",
    img: "/images/services/yoga1.png"
  },
  {
    title: "Meditation",
    desc: "Cultivate mindfulness",
    img: "/images/services/yoga_class.png",
  },
  {
    title: "Workshops",
    desc: "Deepen your practice",
    img: "/images/services/workshop.jpg",
  },
  {
    title: "Community",
    desc: "Connect & grow",
    img: "/images/services/yoga2.png",
  },
];

const Services = () => {
  return (
    <section className={styles.services}>
      <h2 className={styles.heading}>
        Transform Mind, Body, and Spirit with Pragya Yoga
      </h2>

      <div className={styles.cardContainer}>
        {services.map((item, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.imageWrapper}>
              <img src={item.img} alt={item.title} />
            </div>

            <div className={styles.cardContent}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button>Explore</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;