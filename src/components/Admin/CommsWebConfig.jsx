import React, { useState, useEffect } from 'react';
import s from './YogaAdmin.module.css';
import FeedbackBanner from './FeedbackBanner';
import { PageHeader, KpiCard, ChartCard, BarChart, trendSeed } from './ui/Primitives';
import { getSettings, updateSettings } from '../api/AdminServices.js';
import {
  LuMegaphone, LuSend, LuMail, LuMessageSquare, LuRadio, LuGlobe, LuCheckCheck,
} from 'react-icons/lu';

const PLATFORM_ICON = { WhatsApp: <LuMessageSquare size={15} />, Email: <LuMail size={15} />, SMS: <LuRadio size={15} /> };

const BROADCASTS = [
  { title: 'Diwali Special Offer', channel: 'WhatsApp', sent: 248, rate: 92 },
  { title: 'New Morning Batch Launch', channel: 'Email', sent: 312, rate: 64 },
  { title: 'Membership Renewal Reminder', channel: 'SMS', sent: 96, rate: 88 },
];

export default function CommsWebConfig({ form, setForm, onBroadcast, feedback }) {
  const [banner, setBanner] = useState('');
  const [bannerMsg, setBannerMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((cfg) => setBanner(cfg.announcementBanner || '')).catch(() => {});
  }, []);

  async function pushBanner() {
    setSaving(true);
    setBannerMsg('');
    try {
      await updateSettings({ announcementBanner: banner });
      setBannerMsg('Announcement banner updated.');
    } catch (err) {
      setBannerMsg(err.message || 'Failed to update banner.');
    } finally {
      setSaving(false);
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div>
      <PageHeader title="Communication Hub" subtitle="Campaigns, broadcasts & landing page management" />

      {feedback?.message && <FeedbackBanner message={feedback.message} type={feedback.type} />}

      <div className={s.statsGrid} style={{ marginBottom: 20 }}>
        <KpiCard icon={<LuMegaphone />} accent="orange" label="Campaigns Sent" value={656} spark={trendSeed('camp', 8)} />
        <KpiCard icon={<LuCheckCheck />} accent="green" label="Avg. Delivery" value={81} suffix="%" trend="3.2%" trendUp spark={trendSeed('deliv', 8)} />
        <KpiCard icon={<LuMail />} accent="blue" label="Open Rate" value={64} suffix="%" spark={trendSeed('open', 8)} />
        <KpiCard icon={<LuMessageSquare />} accent="amber" label="Recipients" value={1240} spark={trendSeed('recip', 8)} />
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuSend /></span>Mass Notification</h3>
          <form className={s.formStack} onSubmit={onBroadcast}>
            <select value={form.segment} onChange={e => setForm({ ...form, segment: e.target.value })}>
              <option value="All">All Registered Profiles</option>
              <option value="Expired">Expired Members</option>
            </select>
            <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
              <option value="WhatsApp">WhatsApp Business API</option>
              <option value="Email">Email SMTP</option>
              <option value="SMS">SMS</option>
            </select>
            <textarea placeholder="Broadcast message payload..." value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className={s.textarea} />
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} style={{ width: 'fit-content' }}><LuSend size={14} /> Dispatch Notification</button>
          </form>
        </div>

        <ChartCard title="Notification Analytics" subtitle="Messages delivered per month" legend={[{ color: '#7c3aed', label: 'Delivered' }]}>
          <div style={{ color: 'var(--text-1)' }}>
            <BarChart labels={months} data={trendSeed('msg', 6).map(v => v * 18)} color="#7c3aed" />
          </div>
        </ChartCard>
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuMegaphone /></span>Recent Broadcasts</h3>
          {BROADCASTS.map((b, i) => (
            <div key={i} className={s.healthRow}>
              <div className={s.healthLabel}>
                <span className={s.statIcon} style={{ width: 32, height: 32, fontSize: 14 }}>{PLATFORM_ICON[b.channel]}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.channel} · {b.sent} sent</div>
                </div>
              </div>
              <span className={`${s.trendPill} ${s.trendUp}`}>{b.rate}% delivered</span>
            </div>
          ))}
        </div>

        <div className={s.card}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuGlobe /></span>Announcement Banner</h3>
          <p className={s.cardDesc}>Update the banner shown across the public landing page.</p>
          <textarea value={banner} onChange={e => setBanner(e.target.value)} className={s.textarea} />
          <button type="button" className={`${s.btn} ${s.btnPrimary}`} style={{ marginTop: '10px', width: 'fit-content' }} onClick={pushBanner} disabled={saving}>
            <LuGlobe size={14} /> {saving ? 'Pushing…' : 'Push to Production'}
          </button>
          {bannerMsg && <p className={s.cardDesc} style={{ marginTop: 8 }}>{bannerMsg}</p>}
        </div>
      </div>
    </div>
  );
}
