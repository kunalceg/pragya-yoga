import React from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';
import FeedbackBanner from './FeedbackBanner';
import { PageHeader, KpiCard, ChartCard, BarChart, trendSeed } from './ui/Primitives';
import { LuTicketPercent, LuTag, LuGift, LuTrendingUp, LuSparkles } from 'react-icons/lu';

export default function CouponsReferrals({ form, setForm, coupons = [], onSave, feedback }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const totalRedemptions = coupons.reduce((a, c) => a + (c.usageCount || 0), 0);
  const referralCount = coupons.filter(c => c.isReferral).length;

  return (
    <div>
      <PageHeader title="Marketing Center" subtitle="Promotions, discount codes & referral loops" />

      {feedback?.message && <FeedbackBanner message={feedback.message} type={feedback.type} />}

      <div className={s.statsGrid} style={{ marginBottom: 20 }}>
        <KpiCard icon={<LuTicketPercent />} accent="orange" label="Active Coupons" value={coupons.length} spark={trendSeed('coup', 8)} />
        <KpiCard icon={<LuTrendingUp />} accent="green" label="Total Redemptions" value={totalRedemptions} spark={trendSeed('redeem', 8)} />
        <KpiCard icon={<LuGift />} accent="blue" label="Referral Codes" value={referralCount} spark={trendSeed('ref', 8)} />
        <KpiCard icon={<LuSparkles />} accent="amber" label="Campaign Reach" value={coupons.length * 120} spark={trendSeed('reach', 8)} />
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuTag /></span>Generate Coupon Code</h3>
          <form className={s.formStack} onSubmit={onSave}>
            <input type="text" placeholder="Code (e.g. FESTIVE20)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="Percentage">Percentage (%)</option>
              <option value="Flat">Flat (₹)</option>
            </select>
            <input type="number" placeholder="Discount value" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
            <label className={s.checkLabel}>
              <input type="checkbox" checked={form.isReferral} onChange={e => setForm({ ...form, isReferral: e.target.checked })} className={s.checkInput} />
              Designate as Referral Tracking Code
            </label>
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} style={{ width: 'fit-content' }}><LuSparkles size={14} /> Activate Coupon</button>
          </form>
        </div>

        <ChartCard title="Redemption Trend" subtitle="Coupon usage per month" legend={[{ color: '#7c3aed', label: 'Redemptions' }]}>
          <div style={{ color: 'var(--text-1)' }}>
            <BarChart labels={months} data={trendSeed('redtrend', 6).map(v => v * 4)} color="#7c3aed" />
          </div>
        </ChartCard>
      </div>

      <div className={s.card}>
        <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuTicketPercent /></span>Active Promotions</h3>
        {coupons.length === 0 && <p className={s.cardDesc}>No coupons yet.</p>}
        <div className={s.catalogGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {coupons.map((cp) => (
            <div key={cp._id || cp.code} className={s.couponCard}>
              <div>
                <div className={s.couponCode}>{cp.code}</div>
                <div className={s.couponMeta}>{cp.value}{cp.discountType === 'Percentage' ? '%' : '₹'} Off · {cp.discountType}{cp.usageCount ? ` · used ${cp.usageCount}×` : ''}</div>
              </div>
              <Badge label={cp.isReferral ? 'Referral' : (cp.active === false ? 'Pending' : 'Active')} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
