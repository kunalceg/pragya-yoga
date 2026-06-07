import React from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

export default function ReportsInvoices() {
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Reports & Revenue Ledger</h2>
          <p className={s.pageSub}>Attendance analytics & invoice management</p>
        </div>
      </div>
      <div className={s.statsGrid} style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className={`${s.statCard} ${s.statOrange}`}><div className={s.statLabel}>Floor Attendance</div><div className={`${s.statVal} ${s.valOrange}`}>84.6%</div></div>
        <div className={`${s.statCard} ${s.statBlue}`}><div className={s.statLabel}>Stream Completion</div><div className={`${s.statVal} ${s.valBlue}`}>91.2%</div></div>
        <div className={`${s.statCard} ${s.statGreen}`}><div className={s.statLabel}>Revenue Collected</div><div className={`${s.statVal} ${s.valGreen}`}>₹1.1L</div></div>
      </div>
      <div className={`${s.card} ${s.cardNoPad}`}>
        <table className={s.table}>
          <thead><tr><th>Invoice</th><th>Student</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><strong>#INV-2026-001</strong></td><td>Priya Sharma</td><td>₹4,500</td><td className={s.tdMuted}>May 12</td><td><Badge label="Settled" /></td></tr>
            <tr><td><strong>#INV-2026-002</strong></td><td>Rahul Mehta</td><td>₹6,500</td><td className={s.tdMuted}>May 18</td><td><Badge label="Settled" /></td></tr>
            <tr><td><strong>#INV-2026-003</strong></td><td>Anjali Verma</td><td>₹2,200</td><td className={s.tdMuted}>Jun 01</td><td><Badge label="Pending" /></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}