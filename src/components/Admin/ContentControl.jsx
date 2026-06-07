import React from 'react';
import s from './YogaAdmin.module.css';
import Badge from './Badge';

export default function ContentControl({ contentItems }) {
  const fallbackContent = contentItems?.length ? contentItems : [
    { title: 'Asana Blueprint Handbook',  contentType: 'PDF Guide',      accessLevel: 'Plan-Specific', allowedPlans: ['Premium Tier'] },
    { title: 'Pranayama Video Series',    contentType: 'Video (12 eps)', accessLevel: 'All Members',   allowedPlans: []               },
    { title: 'Meditation Scripts Pack',   contentType: 'Audio + PDF',    accessLevel: 'Free Preview',  allowedPlans: []               },
  ];

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Secure Content Vault</h2>
          <p className={s.pageSub}>Manage access tiers & digital assets</p>
        </div>
      </div>
      <div className={`${s.card} ${s.cardNoPad}`}>
        <table className={s.table}>
          <thead><tr><th>Asset Title</th><th>Format</th><th>Access Tier</th><th>Allowed Plans</th></tr></thead>
          <tbody>
            {fallbackContent.map((co, i) => (
              <tr key={i}>
                <td><strong>{co.title}</strong></td>
                <td className={s.tdMuted}>{co.contentType}</td>
                <td><Badge label={co.accessLevel} /></td>
                <td className={s.tdMuted}>{co.allowedPlans?.join(', ') || 'All Active Subscribers'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}