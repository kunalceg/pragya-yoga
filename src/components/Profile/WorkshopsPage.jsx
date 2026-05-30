import s from "./Dashboard.shared.module.css";

export default function WorkshopsPage({ student, onRegister }) {
  const registered = student?.workshops?.registered ?? [];
  const available  = student?.workshops?.available  ?? [];

  return (
    <div>
      <p className={s.pageTitle}>Workshops</p>

      {registered.length > 0 && (
        <div className={s.card}>
          <div className={s.cardHead}><span className={s.cardTitle}>Registered</span></div>
          {registered.map((w, i) => (
            <div className={s.listRow} key={i}>
              <span className={s.listTime}>{w.date}</span>
              <span className={s.listName}>{w.name} · {w.duration}</span>
              <span className={`${s.badge} ${s.badgePurple}`}>Paid</span>
              <button className={s.btnSm} style={{ marginLeft:"auto" }}>
                <i className="ti ti-bell" aria-hidden="true" /> Remind
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={s.card}>
        <div className={s.cardHead}><span className={s.cardTitle}>Available workshops</span></div>
        {available.length === 0 && (
          <div className={s.emptyState} style={{ padding:"12px 0" }}>No workshops available right now.</div>
        )}
        {available.map((w, i) => (
          <div className={s.listRow} key={i}>
            <span className={s.listTime}>{w.date}</span>
            <span className={s.listName}>{w.name} · {w.duration}</span>
            <span style={{ marginLeft:"auto", fontWeight:500, fontSize:"13px", color:"#111827" }}>
              ₹{w.price?.toLocaleString("en-IN")}
            </span>
            <button className={s.btnPrimary} style={{ marginLeft:"8px" }} onClick={() => onRegister?.(w)}>
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
