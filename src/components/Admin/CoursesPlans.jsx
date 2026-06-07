import React from 'react';
import s from './YogaAdmin.module.css';

export default function CoursesPlans({ courses, plans }) {
  const fallbackCourses = courses.length ? courses : [
    { title: '21-Day Detox Sadhana',    duration: '3 Weeks',   mode: 'Online',  price: '4,500'  },
    { title: '200hr Teacher Training',  duration: '3 Months',  mode: 'Hybrid',  price: '42,000' },
    { title: 'Weekend Yin Retreat',     duration: '2 Days',    mode: 'Studio',  price: '3,200'  },
  ];

  const fallbackPlans = plans.length ? plans : [
    { name: 'Monthly Pass',    price: '2,200',  durationMonths: 1  },
    { name: 'Quarterly Pass',  price: '6,000',  durationMonths: 3  },
    { name: 'Annual Pass',     price: '20,000', durationMonths: 12 },
  ];

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Courses, Plans & Workshops</h2>
          <p className={s.pageSub}>Manage curriculum and membership tiers</p>
        </div>
      </div>
      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}>◉ Course Matrix</h3>
          {fallbackCourses.map((c, i) => (
            <div key={i} className={s.curriculumRow}>
              <div>
                <strong className={s.curriculumName}>{c.title}</strong>
                <div className={s.curriculumMeta}>{c.duration} · {c.mode}</div>
              </div>
              <div className={s.curriculumPrice}>₹{c.price}</div>
            </div>
          ))}
        </div>
        <div className={s.card}>
          <h3 className={s.cardTitle}>◈ Membership Passes</h3>
          {fallbackPlans.map((p, i) => (
            <div key={i} className={s.curriculumRow}>
              <div>
                <strong className={s.curriculumName}>{p.name}</strong>
                <div className={s.curriculumMeta}>{p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''} access</div>
              </div>
              <div className={`${s.curriculumPrice} ${s.priceGreen}`}>₹{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}