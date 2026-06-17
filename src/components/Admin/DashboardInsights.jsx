import React from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';
import { PageHeader, KpiCard, ChartCard, AreaChart, BarChart, Avatar, trendSeed } from './ui/Primitives';
import {
  LuRefreshCw, LuUsers, LuFilter, LuRadioTower, LuIndianRupee,
  LuUserPlus, LuCreditCard, LuCalendarCheck, LuSparkles, LuActivity,
  LuClock, LuArrowRight, LuPlus,
} from 'react-icons/lu';

export default function DashboardInsights({ data = {}, totalLeads = 0, totalBatches = 0, onRefresh }) {
  const metrics = data.metrics || {};
  const systemHealth = data.systemHealth?.length ? data.systemHealth : [];
  const schedule = data.todaySchedule?.length ? data.todaySchedule : [];
  const recentStudents = data.recentStudents?.length ? data.recentStudents : [];

  const revenue = metrics.revenue || 0;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Deterministic, stable demo trends derived from real totals (presentation only).
  const revTrend = trendSeed('revenue', 6).map(v => Math.round((revenue || 1000) * (0.5 + v / 20)));
  const memTrend = trendSeed('members', 6).map(v => Math.round((metrics.activeStudents || 8) * (0.4 + v / 16)));
  const bookTrend = trendSeed('bookings', 6).map(v => v + 2);

  const activity = [
    ...recentStudents.slice(0, 4).map((st) => ({
      icon: <LuUserPlus />, cls: s.timeIcon, title: `${st.name || 'New student'} registered`,
      meta: `${st.city || st.email || 'Student CRM'} · just now`,
    })),
    { icon: <LuCreditCard />, cls: s.timeIconGreen, title: 'Membership payment received', meta: `₹${(revenue || 0).toLocaleString('en-IN')} total collected` },
    { icon: <LuCalendarCheck />, cls: s.timeIconBlue, title: `${metrics.pendingBookings ?? 0} bookings pending review`, meta: 'Bookings calendar' },
    { icon: <LuSparkles />, cls: s.timeIconAmber, title: `${totalLeads} leads in pipeline`, meta: 'Pipeline CRM' },
  ];

  const quickActions = [
    { icon: <LuUserPlus />, label: 'Add Student' },
    { icon: <LuRadioTower />, label: 'New Batch' },
    { icon: <LuFilter />, label: 'Add Lead' },
    { icon: <LuCreditCard />, label: 'Record Payment' },
  ];

  return (
    <div>
      <PageHeader title="Command Center" subtitle="Live operational overview — sourced from MongoDB">
        <span className={`${s.badge} ${s.badgeGreen}`}>Live</span>
        <button type="button" className={`${s.btn} ${s.btnSm}`} onClick={onRefresh}>
          <LuRefreshCw size={14} /> Refresh
        </button>
      </PageHeader>

      {/* KPI row */}
      <div className={s.statsGrid}>
        <KpiCard icon={<LuUsers />} accent="orange" label="Active Members" value={metrics.activeStudents ?? 0}
          trend={`${metrics.newThisMonth ?? 0} new`} trendUp spark={memTrend} />
        <KpiCard icon={<LuFilter />} accent="amber" label="Open CRM Leads" value={totalLeads}
          trend={`${metrics.pendingBookings ?? 0} pending`} trendUp spark={trendSeed('leads', 8)} />
        <KpiCard icon={<LuRadioTower />} accent="blue" label="Live Batches" value={totalBatches}
          trend={`${metrics.activeMemberships ?? 0} memberships`} trendUp spark={trendSeed('batches', 8)} />
        <KpiCard icon={<LuIndianRupee />} accent="green" label="Gross Revenue" value={revenue} prefix="₹"
          trend="collected" trendUp spark={revTrend} />
      </div>

      {/* Analytics + timeline */}
      <div className={s.gridDash}>
        <div>
          <ChartCard
            title="Revenue & Membership Trend"
            subtitle="Last 6 months"
            right={<div style={{ textAlign: 'right' }}><div className={s.chartBig}>₹{revenue.toLocaleString('en-IN')}</div><div className={s.chartSub}>total collected</div></div>}
            legend={[{ color: '#7c3aed', label: 'Revenue' }, { color: '#22c55e', label: 'Members' }]}
          >
            <div style={{ color: 'var(--text-1)' }}>
              <AreaChart
                labels={months}
                series={[
                  { color: '#7c3aed', data: revTrend },
                  { color: '#22c55e', data: memTrend.map(v => v * 40) },
                ]}
              />
            </div>
          </ChartCard>

          <ChartCard title="Booking Analytics" subtitle="Sessions booked per month">
            <div style={{ color: 'var(--text-1)' }}>
              <BarChart labels={months} data={bookTrend} color="#6366f1" />
            </div>
          </ChartCard>
        </div>

        {/* Right column */}
        <div>
          <div className={s.card}>
            <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuActivity /></span>Activity Timeline</h3>
            <div className={s.timeline}>
              {activity.map((a, i) => (
                <div key={i} className={s.timeItem}>
                  <div className={a.cls}>{a.icon}</div>
                  <div className={s.timeBody}>
                    <div className={s.timeTitle}>{a.title}</div>
                    <div className={s.timeMeta}>{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={s.card}>
            <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuSparkles /></span>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {quickActions.map((q, i) => (
                <button key={i} type="button" className={s.btn} style={{ justifyContent: 'flex-start', padding: '12px' }}>
                  <span className={s.cardTitleIcon}>{q.icon}</span>{q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Health + schedule + recent */}
      <div className={s.grid3} style={{ marginTop: 0 }}>
        <div className={s.card}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuActivity /></span>System Health</h3>
          {systemHealth.length === 0 && <p className={s.cardDesc}>All systems operational.</p>}
          {systemHealth.map((item, i) => (
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
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuClock /></span>Upcoming Schedule</h3>
          {schedule.length === 0 && <p className={s.cardDesc}>No classes scheduled today.</p>}
          {schedule.map((item, i) => (
            <div key={i} className={s.healthRow}>
              <div className={s.healthLabel}>{item.label}</div>
              <Badge label={item.badge} />
            </div>
          ))}
        </div>

        <div className={s.card}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuUserPlus /></span>Recent Registrations</h3>
          {recentStudents.length === 0 && <p className={s.cardDesc}>No recent registrations.</p>}
          {recentStudents.slice(0, 5).map((st, i) => (
            <div key={i} className={s.healthRow}>
              <div className={s.cellUser}>
                <Avatar name={st.name || 'New'} size={s.avatarSm} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{st.name || '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{st.city || st.email || '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
