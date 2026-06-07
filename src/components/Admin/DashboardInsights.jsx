import React from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

export default function DashboardInsights({ data, totalLeads, totalBatches }) {
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Dashboard Aggregator Engine</h2>
          <p className={s.pageSub}>Live operational overview — updated in real-time</p>
        </div>
        <button type="button" className={`${s.btn} ${s.btnSm}`}>↺ Refresh</button>
      </div>

      <div className={s.statsGrid}>
        <div className={`${s.statCard} ${s.statOrange}`}>
          <div className={s.statLabel}>Active Members</div>
          <div className={`${s.statVal} ${s.valOrange}`}>{data.metrics.activeStudents || 248}</div>
          <div className={s.statTrend}>↑ +12 this month</div>
        </div>
        <div className={`${s.statCard} ${s.statAmber}`}>
          <div className={s.statLabel}>Open CRM Leads</div>
          <div className={`${s.statVal} ${s.valAmber}`}>{totalLeads}</div>
          <div className={`${s.statTrend} ${s.trendAmber}`}>⏱ 3 follow-ups due</div>
        </div>
        <div className={`${s.statCard} ${s.statBlue}`}>
          <div className={s.statLabel}>Live Batches</div>
          <div className={`${s.statVal} ${s.valBlue}`}>{totalBatches}</div>
          <div className={`${s.statTrend} ${s.trendBlue}`}>▶ 2 streaming now</div>
        </div>
        <div className={`${s.statCard} ${s.statGreen}`}>
          <div className={s.statLabel}>Gross Revenue</div>
          <div className={`${s.statVal} ${s.valGreen}`}>₹{(data.metrics.revenue || 180000).toLocaleString('en-IN')}</div>
          <div className={`${s.statTrend} ${s.trendGreen}`}>↑ +8.4% vs last month</div>
        </div>
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}>⬡ System Health Snapshot</h3>
          {[
            { label: 'Payment Gateway API', status: 'Operational', ok: true },
            { label: 'Zoom Streaming Bridge', status: 'Live', ok: true },
            { label: 'WhatsApp Business API', status: 'Connected', ok: true },
            { label: 'Email SMTP Node', status: 'Degraded', ok: false },
          ].map((item, i) => (
            <div key={i} className={s.healthRow}>
              <div className={s.healthLabel}>
                <span className={`${s.healthDot} ${item.ok ? s.dotGreen : s.dotAmber}`} />
                {item.label}
              </div>
              <Badge label={item.status} />
            </div>
          ))}
        </div>
        <div className={s.card}>
          <h3 className={s.cardTitle}>◷ Today's Schedule</h3>
          {[
            { label: 'Morning Vinyasa — 6:00 AM', badge: '18 enrolled' },
            { label: 'Pranayama — 7:30 AM', badge: 'Completed' },
            { label: 'Restorative — 5:30 PM', badge: 'Upcoming' },
            { label: 'Private — Priya S. — 7 PM', badge: 'Upcoming' },
          ].map((item, i) => (
            <div key={i} className={s.healthRow}>
              <div className={s.healthLabel}>{item.label}</div>
              <Badge label={item.badge} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}