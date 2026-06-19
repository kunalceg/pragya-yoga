import React, { useState, useEffect } from 'react';
import s from './YogaAdmin.module.css';
import FeedbackBanner from './FeedbackBanner';
import { PageHeader, KpiCard, ChartCard, BarChart } from './ui/Primitives';
import { getSettings, updateSettings, listNotifications } from '../api/AdminServices.js';
import {
  LuMegaphone, LuSend, LuMail, LuMessageSquare, LuRadio, LuGlobe, LuCheckCheck,
} from 'react-icons/lu';

const PLATFORM_ICON = { WhatsApp: <LuMessageSquare size={15} />, Email: <LuMail size={15} />, SMS: <LuRadio size={15} /> };

export default function CommsWebConfig({ form, setForm, onBroadcast, feedback }) {
  const [banner, setBanner] = useState('');
  const [bannerMsg, setBannerMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    getSettings().then((cfg) => setBanner(cfg.announcementBanner || '')).catch(() => {});
  }, []);

  useEffect(() => {
    listNotifications().then(setBroadcasts).catch(() => {});
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

  const campaignCount = broadcasts.length;
  const totalSent = broadcasts.reduce((a, b) => a + (b.sent || 0), 0);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div>
      <PageHeader title="Communication Hub" subtitle="Campaigns, broadcasts & landing page management" />

      {feedback?.message && <FeedbackBanner message={feedback.message} type={feedback.type} />}

      <div className={s.statsGrid} style={{ marginBottom: 20 }}>
        <KpiCard icon={<LuMegaphone />} accent="orange" label="Campaigns Sent" value={campaignCount} spark={[campaignCount || 1, campaignCount || 2, campaignCount || 3, campaignCount || 4, campaignCount || 5, campaignCount || 6]} />
        <KpiCard icon={<LuCheckCheck />} accent="green" label="Avg. Delivery" value={broadcasts.length ? 85 : 0} suffix="%" spark={[60, 70, 75, 80, 85, 85]} />
        <KpiCard icon={<LuMail />} accent="blue" label="Notifications" value={campaignCount} spark={[campaignCount || 1, campaignCount || 2, campaignCount || 3, campaignCount || 4, campaignCount || 5, campaignCount || 6]} />
        <KpiCard icon={<LuMessageSquare />} accent="amber" label="Total Sent" value={totalSent} spark={[totalSent * 0.2 || 1, totalSent * 0.4 || 2, totalSent * 0.6 || 3, totalSent * 0.8 || 4, totalSent * 0.9 || 5, totalSent || 6]} />
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

        <ChartCard title="Notification Analytics" subtitle="Messages delivered per month" legend={[{ color: '#F97316', label: 'Delivered' }]}>
          <div style={{ color: 'var(--text-1)' }}>
            <BarChart labels={months} data={[campaignCount || 1, campaignCount || 2, campaignCount || 3, campaignCount || 4, campaignCount || 5, campaignCount || 6].map(v => v * 18)} color="#F97316" />
          </div>
        </ChartCard>
      </div>

      <div className={s.grid2}>
        <div className={s.card}>
          <h3 className={s.cardTitle}><span className={s.cardTitleIcon}><LuMegaphone /></span>Recent Broadcasts</h3>
          {broadcasts.length === 0 && <p className={s.cardDesc}>No broadcasts sent yet. Use the form above to send your first campaign.</p>}
          {broadcasts.slice(0, 10).map((b, i) => (
            <div key={b._id || i} className={s.healthRow}>
              <div className={s.healthLabel}>
                <span className={s.statIcon} style={{ width: 32, height: 32, fontSize: 14 }}><LuMail size={15} /></span>
                <div>
                  <div style={{ fontWeight: 600 }}>{b.title || b.message?.slice(0, 60) || 'Broadcast'}{b.message?.length > 60 ? '…' : ''}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.type || 'email'} · {new Date(b.createdAt || Date.now()).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
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
