import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClassesServices.css';

const services = [
  { title: "Offline Group Yoga",       desc: "Community sessions in studio to enhance motivation.",       time: "Mon-Fri, 6:30 AM / 7:30 AM / 5 PM", price: "₹2,000 / Month"          },
  { title: "Online Group Yoga",        desc: "Holistic online practice for fitness & clarity.",            time: "Mon-Fri, 6-7 AM IST",                price: "₹2,000 / Month"          },
  { title: "Personal Yoga (Center)",   desc: "Tailored one-on-one sessions for your goals.",              time: "Flexible scheduling",                price: "₹10,000 / 20 sessions"   },
  { title: "Yoga at Home",             desc: "Personalized instruction at your convenience.",             time: "Flexible scheduling",                price: "₹12,000 / 20 sessions"   },
  { title: "Kids Yoga",                desc: "Fun & engaging classes for children's well-being.",         time: "Saturday, 4-6 PM",                   price: "₹600 / Month"            },
  { title: "Pregnancy Yoga",           desc: "Safe practices for expectant mothers.",                     time: "Flexible scheduling",                price: "₹12,000 / 20 sessions"   },
  { title: "Pranayama & Meditation",   desc: "Breathing & meditation for clarity.",                       time: "Mon, Wed, Fri, 8-8:30 AM",           price: "₹6,000 / Month"          },
  { title: "Yoga for Stress",          desc: "Targeted sessions for stress relief.",                      time: "Flexible scheduling",                price: "₹800 / Session"          },
  { title: "Corporate Yoga",           desc: "Customized workplace wellness programs.",                   time: "Flexible scheduling",                price: "Contact for pricing"     },
];

const ClassesServices = () => {
  const navigate = useNavigate();

  const handleBook = (service) => {
    navigate('/payment', {
      state: {
        name:  service.title,
        price: service.price,
        time:  service.time,
      }
    });
  };

  return (
    <section className="classes-services">
      <h2 className="section-title">Our Yoga Services</h2>
      <div className="services-grid">
        {services.map((s, i) => (
          <div className="service-card" key={i}>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <span className="service-time">{s.time}</span>
            <span className="service-price">{s.price}</span>
            <button
              className="service-cta"
              onClick={() => handleBook(s)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClassesServices;
