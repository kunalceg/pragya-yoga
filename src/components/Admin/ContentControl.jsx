import React, { useState } from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';
import { PageHeader, KpiCard } from './ui/Primitives';
import { LuFolderLock, LuUpload, LuFileText, LuVideo, LuFileAudio, LuLayoutGrid, LuTable } from 'react-icons/lu';

const typeIcon = (t = '') => {
  const x = t.toLowerCase();
  if (x.includes('video')) return '🎬';
  if (x.includes('audio')) return '🎧';
  if (x.includes('pdf') || x.includes('guide')) return '📄';
  return '📦';
};

export default function ContentControl({ contentItems }) {
  const [view, setView] = useState('grid');
  const [category, setCategory] = useState('All');

  const items = contentItems?.length ? contentItems : [];

  const categories = ['All', 'PDF', 'Video', 'Audio'];
  const matches = (co) => {
    if (category === 'All') return true;
    return (co.contentType || co.type || '').toLowerCase().includes(category.toLowerCase());
  };
  const filtered = items.filter(matches);

  const stats = {
    total: items.length,
    video: items.filter(c => (c.contentType || c.type || '').toLowerCase().includes('video')).length,
    docs: items.filter(c => (c.contentType || c.type || '').toLowerCase().includes('pdf') || (c.contentType || c.type || '').toLowerCase().includes('guide') || (c.contentType || c.type || '').toLowerCase().includes('doc')).length,
  };

  return (
    <div>
      <PageHeader title="Digital Asset Manager" subtitle="Manage access tiers & digital assets">
        <div className={s.segment}>
          <button type="button" className={`${s.segBtn} ${view === 'grid' ? s.segActive : ''}`} onClick={() => setView('grid')}><LuLayoutGrid size={14} /> Gallery</button>
          <button type="button" className={`${s.segBtn} ${view === 'table' ? s.segActive : ''}`} onClick={() => setView('table')}><LuTable size={14} /> Table</button>
        </div>
      </PageHeader>

      <div className={s.statsGrid} style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <KpiCard icon={<LuFolderLock />} accent="orange" label="Total Assets" value={stats.total} />
        <KpiCard icon={<LuVideo />} accent="blue" label="Video Series" value={stats.video} />
        <KpiCard icon={<LuFileText />} accent="green" label="Documents" value={stats.docs} />
      </div>

      {/* Upload center */}
      <div className={s.card}>
        <div className={s.dropzone}>
          <div className={s.dropIcon}><LuUpload /></div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>Upload Center</div>
          <div className={s.cardDesc} style={{ margin: 0 }}>Drag & drop files here, or click to browse. PDF, video, and audio supported.</div>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} type="button" className={`${s.chip} ${category === c ? s.chipActive : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={`${s.card} ${s.emptyState}`}>
          <div className={s.emptyIcon}>📁</div>
          {items.length === 0 ? 'No digital assets uploaded yet. Upload files above.' : 'No assets match the selected category.'}
        </div>
      ) : view === 'grid' ? (
        <div className={s.assetGrid}>
          {filtered.map((co, i) => (
            <div key={i} className={s.assetCard}>
              <div className={s.assetThumb}>
                {typeIcon(co.contentType)}
                <span className={s.assetTypeTag}>{(co.contentType || 'FILE').split(' ')[0].toUpperCase()}</span>
              </div>
              <div className={s.assetBody}>
                <div className={s.assetTitle}>{co.title}</div>
                <div className={s.assetMeta}>{co.contentType}</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <Badge label={co.accessLevel} />
                </div>
                <div className={s.assetMeta} style={{ marginTop: 8 }}>{co.allowedPlans?.join(', ') || 'All Active Subscribers'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 && (
        <div className={`${s.card} ${s.cardNoPad}`}>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead><tr><th>Asset Title</th><th>Format</th><th>Access Tier</th><th>Allowed Plans</th></tr></thead>
              <tbody>
                {filtered.map((co, i) => (
                  <tr key={i}>
                    <td><div className={s.cellUser}><span style={{ fontSize: 20 }}>{typeIcon(co.contentType || co.type)}</span><strong>{co.title}</strong></div></td>
                    <td className={s.tdMuted}>{co.contentType || co.type || 'File'}</td>
                    <td><Badge label={co.accessLevel || co.visibility || 'All Members'} /></td>
                    <td className={s.tdMuted}>{co.allowedPlans?.join(', ') || 'All Active Subscribers'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
