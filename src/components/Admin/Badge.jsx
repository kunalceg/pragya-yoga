import React from 'react';
import s from './YogaAdmin.module.css';

export default function Badge({ label }) {
  const map = {
    Active: s.badgeGreen, Completed: s.badgeGreen, Settled: s.badgeGreen, 'Free Preview': s.badgeGreen,
    Expiring: s.badgeAmber, Pending: s.badgeAmber, Upcoming: s.badgeAmber, 'Plan-Specific': s.badgeAmber,
    Cold: s.badgeBlue, Referral: s.badgeBlue, 'All Members': s.badgeBlue,
  };
  return <span className={`${s.badge} ${map[label] || s.badgeBlue}`}>{label}</span>;
}