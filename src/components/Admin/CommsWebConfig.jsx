import React from 'react';
import s from './YogaAdmin.module.css';

export default function CommsWebConfig({ form, setForm }) {
  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Broadcast & Web Config</h2>
          <p className={s.pageSub}>Notifications & landing page management</p>
        </div>
      </div>
      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}>◈ Mass Notification</h3>
          <div className={s.formStack}>
            <select value={form.segment} onChange={e => setForm({ ...form, segment: e.target.value })}>
              <option value="All">All Registered Profiles</option>
              <option value="Expired">Expired Members</option>
            </select>
            <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
              <option value="WhatsApp">WhatsApp Business API</option>
              <option value="Email">Email SMTP</option>
            </select>
            <textarea placeholder="Broadcast message payload..." value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className={s.textarea} />
            <button type="button" className={`${s.btn} ${s.btnPrimary}`} style={{ width: 'fit-content' }}>↗ Dispatch Notification</button>
          </div>
        </div>
        <div className={s.card}>
          <h3 className={s.cardTitle}>≡ CMS Injection Config</h3>
          <p className={s.cardDesc}>Push updates to public landing page elements instantly.</p>
          <textarea defaultValue={'{ "announcementBanner": "Grand Ashram Intensive Starts Next Week!" }'} className={s.textareaMono} />
          <button type="button" className={s.btn} style={{ marginTop: '10px', width: 'fit-content' }}>↗ Push to Production</button>
        </div>
      </div>
    </div>
  );
}