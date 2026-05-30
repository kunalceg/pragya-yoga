import s from "./Dashboard.shared.module.css";

export default function ProfilePage({ student }) {
  const p = student ?? {};
  return (
    <div>
      <p className={s.pageTitle}>Profile</p>

      <div className={s.metrics}>
        <div className={s.metric}><p className={s.metricNum}>{p.stats?.classes ?? 0}</p><p className={s.metricLbl}>Classes</p></div>
        <div className={s.metric}><p className={s.metricNum}>{p.planMonths ?? 0}</p><p className={s.metricLbl}>Months</p></div>
        <div className={s.metric}><p className={s.metricNum}>{p.stats?.attendancePct ?? 0}%</p><p className={s.metricLbl}>Attendance</p></div>
        <div className={s.metric}><p className={s.metricNum}>{p.referralCount ?? 0}</p><p className={s.metricLbl}>Referrals</p></div>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <span className={s.cardTitle}>Personal details</span>
          <button className={s.btnSm}><i className="ti ti-edit" aria-hidden="true" /> Edit</button>
        </div>
        {[
          { icon: "ti-user",     label: "Name",   value: p.name    },
          { icon: "ti-mail",     label: "Email",  value: p.email   },
          { icon: "ti-phone",    label: "Phone",  value: p.phone   },
          { icon: "ti-map-pin",  label: "City",   value: p.city    },
          { icon: "ti-yoga",     label: "Style",  value: p.style   },
          { icon: "ti-chart-bar",label: "Level",  value: p.level   },
        ].map(({ icon, label, value }) => (
          <div className={s.row} key={label}>
            <span className={s.rowLabel}><i className={`ti ${icon}`} aria-hidden="true" />{label}</span>
            <span className={s.rowVal}>{value ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
