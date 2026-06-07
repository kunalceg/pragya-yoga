import React from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

export default function CouponsReferrals({ form, setForm, coupons }) {
  const fallbackCoupons = coupons?.length ? coupons : [
    { code: 'FESTIVE20', value: 20, discountType: 'Percentage' },
    { code: 'REFER100',  value: 100, discountType: 'Flat'      },
  ];

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Coupons & Referral Rewards</h2>
          <p className={s.pageSub}>Promotions, discount codes & referral loops</p>
        </div>
      </div>
      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}>✦ Generate Coupon Code</h3>
          <div className={s.formStack}>
            <input type="text" placeholder="Code (e.g. FESTIVE20)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
            <input type="number" placeholder="Discount value (%)" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
            <label className={s.checkLabel}>
              <input type="checkbox" checked={form.isReferral} onChange={e => setForm({ ...form, isReferral: e.target.checked })} className={s.checkInput} />
              Designate as Referral Tracking Code
            </label>
            <button type="button" className={`${s.btn} ${s.btnPrimary}`} style={{ width: 'fit-content' }}>Activate Coupon</button>
          </div>
        </div>
        <div className={s.card}>
          <h3 className={s.cardTitle}>◎ Active Promotions</h3>
          {fallbackCoupons.map((cp, i) => (
            <div key={i} className={s.couponCard}>
              <div>
                <div className={s.couponCode}>{cp.code}</div>
                <div className={s.couponMeta}>{cp.value}{cp.discountType === 'Percentage' ? '%' : '₹'} Off · {cp.discountType}</div>
              </div>
              <Badge label={cp.discountType === 'Flat' ? 'Referral' : 'Active'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}