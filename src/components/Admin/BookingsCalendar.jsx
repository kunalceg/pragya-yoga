import React from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

export default function BookingsCalendar({ consultations }) {
  const fallbackConsultations = consultations?.length ? consultations : [
    { clientName: 'Priya Sharma', dateTime: '7:00 PM', mode: 'Zoom',   status: 'Upcoming'  },
    { clientName: 'Deepa Nair',   dateTime: '10:00 AM', mode: 'Studio', status: 'Completed' },
  ];

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Bookings & Therapy Calendar</h2>
          <p className={s.pageSub}>Today's consultation agenda</p>
        </div>
      </div>
      <div className={s.card}>
        <h3 className={s.cardTitle}>◷ Today's Therapy Agenda</h3>
        <div className={s.consultList}>
          {fallbackConsultations.map((c, i) => (
            <div key={i} className={`${s.consultRow} ${c.status === 'Completed' ? s.consultDone : s.consultPending}`}>
              <div>
                <strong>{c.clientName}</strong>
                <span className={s.consultTime}> — {c.dateTime}</span>
                <span className={s.consultMode}> ({c.mode})</span>
              </div>
              <Badge label={c.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}