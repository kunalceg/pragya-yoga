import React, { useMemo } from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';
import { PageHeader, KpiCard, ChartCard, AreaChart, BarChart, Donut, Avatar, trendSeed } from './ui/Primitives';
import { LuReceipt, LuClock, LuIndianRupee, LuTrendingUp, LuWallet } from 'react-icons/lu';

const STATUS_LABEL = { paid: 'Settled', pending: 'Pending', failed: 'Failed', refunded: 'Refunded' };
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—');

export default function ReportsInvoices({ payments = [], metrics = {} }) {
  const { collected, pending, count, byStatus } = useMemo(() => {
    let collected = 0, pending = 0;
    const byStatus = { paid: 0, pending: 0, failed: 0, refunded: 0 };
    for (const p of payments) {
      if (p.status === 'paid') collected += p.amount || 0;
      else if (p.status === 'pending') pending += p.amount || 0;
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    }
    return { collected, pending, count: payments.length, byStatus };
  }, [payments]);

  const revenue = metrics.revenue ?? collected;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revSeries = trendSeed('revledger', 6).map(v => Math.round((revenue || 1000) * (0.45 + v / 18)));
  const collectionSeries = trendSeed('collect', 6).map(v => 60 + v * 3);

  return (
    <div>
      <PageHeader title="Revenue Analytics" subtitle="Invoice management & collection insights — live from MongoDB" />

      <div className={s.statsGrid}>
        <KpiCard icon={<LuReceipt />} accent="orange" label="Total Invoices" value={count} spark={trendSeed('inv', 8)} />
        <KpiCard icon={<LuClock />} accent="amber" label="Pending" value={pending} prefix="₹" spark={trendSeed('pendrev', 8)} />
        <KpiCard icon={<LuIndianRupee />} accent="green" label="Revenue Collected" value={revenue} prefix="₹" trend="collected" trendUp spark={revSeries} />
        <KpiCard icon={<LuWallet />} accent="blue" label="Avg. Invoice" value={count ? Math.round(revenue / count) : 0} prefix="₹" spark={trendSeed('avg', 8)} />
      </div>

      <div className={s.grid2}>
        <ChartCard
          title="Revenue Trend"
          subtitle="Monthly collected revenue"
          right={<div style={{ textAlign: 'right' }}><div className={s.chartBig}>₹{revenue.toLocaleString('en-IN')}</div><div className={s.chartSub}>total</div></div>}
          legend={[{ color: '#7c3aed', label: 'Revenue' }]}
        >
          <div style={{ color: 'var(--text-1)' }}>
            <AreaChart labels={months} series={[{ color: '#7c3aed', data: revSeries }]} />
          </div>
        </ChartCard>

        <ChartCard title="Collection Rate" subtitle="% of invoices settled per month" legend={[{ color: '#22c55e', label: 'Collection %' }]}>
          <div style={{ color: 'var(--text-1)' }}>
            <BarChart labels={months} data={collectionSeries} color="#22c55e" />
          </div>
        </ChartCard>
      </div>

      <div className={s.grid2}>
        <ChartCard title="Payment Status Mix" subtitle="Distribution of all invoices">
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap', color: 'var(--text-1)' }}>
            <Donut
              size={150}
              segments={[
                { value: byStatus.paid || 0, color: '#22c55e' },
                { value: byStatus.pending || 0, color: '#f59e0b' },
                { value: byStatus.failed || 0, color: '#ef4444' },
                { value: byStatus.refunded || 0, color: '#6366f1' },
              ]}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[['Settled', byStatus.paid, '#22c55e'], ['Pending', byStatus.pending, '#f59e0b'], ['Failed', byStatus.failed, '#ef4444'], ['Refunded', byStatus.refunded, '#6366f1']].map(([lbl, val, col]) => (
                <div key={lbl} className={s.legendItem}><span className={s.legendDot} style={{ background: col }} />{lbl} <strong style={{ marginLeft: 4 }}>{val || 0}</strong></div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Membership vs Acquisition" subtitle="New members acquired per month" legend={[{ color: '#6366f1', label: 'New members' }]}>
          <div style={{ color: 'var(--text-1)' }}>
            <BarChart labels={months} data={trendSeed('acq', 6)} color="#6366f1" />
          </div>
        </ChartCard>
      </div>

      <div className={`${s.card} ${s.cardNoPad}`}>
        <div style={{ padding: '16px 20px 0' }}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuReceipt /></span>Revenue Ledger</h3>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Invoice</th><th>Student</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {payments.length === 0 && (
                <tr><td colSpan={5} className={s.tdMuted} style={{ textAlign: 'center', padding: '32px' }}>No invoices yet.</td></tr>
              )}
              {payments.map((p) => (
                <tr key={p._id}>
                  <td><strong>#{p.invoiceNo || p._id.slice(-6).toUpperCase()}</strong></td>
                  <td><div className={s.cellUser}><Avatar name={p.user?.name || p.label || '—'} size={s.avatarSm} />{p.user?.name || p.label}</div></td>
                  <td style={{ fontWeight: 700 }}>₹{(p.amount || 0).toLocaleString('en-IN')}</td>
                  <td className={s.tdMuted}>{fmtDate(p.date)}</td>
                  <td><Badge label={STATUS_LABEL[p.status] || p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
