import React from 'react';
import s from './YogaAdmin.module.css';

export default function PipelineCRMLeads({ leads }) {
  const fallbackLeads = leads.length ? leads : [
    { name: 'Sunita Kapoor',  stage: 'New',        interestType: 'Hatha Yoga'    },
    { name: 'Amit Bose',      stage: 'New',        interestType: 'Meditation'    },
    { name: 'Deepa Nair',     stage: 'Follow up',  interestType: 'Prenatal Yoga' },
    { name: 'Vishal Tiwari',  stage: 'Follow up',  interestType: 'General'       },
    { name: 'Ritu Anand',     stage: 'Converted',  interestType: 'Morning Vinyasa' },
    { name: 'Karan Singh',    stage: 'Cold',       interestType: 'No response x3' },
  ];

  const LEAD_STAGES = [
    { id: 'New',        label: 'New',        colorClass: s.stageOrange },
    { id: 'Follow up',  label: 'Follow Up',  colorClass: s.stageAmber  },
    { id: 'Converted',  label: 'Converted',  colorClass: s.stageGreen  },
    { id: 'Cold',       label: 'Cold',       colorClass: s.stageBlue   },
  ];

  return (
    <div>
      <div className={s.pageHeader}>
        <div>
          <h2 className={s.pageTitle}>Pipeline Lead Conversion Matrix</h2>
          <p className={s.pageSub}>Track & convert prospective students</p>
        </div>
      </div>
      <div className={s.kanban}>
        {LEAD_STAGES.map(stage => (
          <div key={stage.id} className={s.leadCol}>
            <div className={`${s.leadColTitle} ${stage.colorClass}`}>{stage.label}</div>
            {fallbackLeads
              .filter(l => l.stage === stage.id || (!l.stage && stage.id === 'New'))
              .map((l, idx) => (
                <div key={idx} className={s.leadCard}>
                  <strong>{l.name}</strong>
                  <div className={s.leadMeta}>Interest: {l.interestType || 'General Yoga'}</div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}