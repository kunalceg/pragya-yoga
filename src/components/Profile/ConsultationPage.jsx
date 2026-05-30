import s from "./Dashboard.shared.module.css";

export default function ConsultationPage({ student, onBook }) {
  const upcoming = student?.consultations?.upcoming ?? [];
  const past     = student?.consultations?.past     ?? [];

  return (
    <div>
      <p className={s.pageTitle}>Consultations</p>

      <div className={s.card}>
        <div className={s.cardHead}>
          <span className={s.cardTitle}>Upcoming</span>
          <button className={s.btnPrimary} onClick={onBook}>
            <i className="ti ti-plus" aria-hidden="true" />Book
          </button>
        </div>
        {upcoming.length === 0 && (
          <div className={s.emptyState} style={{ padding:"12px 0" }}>No upcoming consultations.</div>
        )}
        {upcoming.map((c, i) => (
          <div className={s.listRow} key={i}>
            <span className={s.listTime}>{c.date}</span>
            <span className={s.listName}>{c.doctor} · {c.topic}</span>
            <span className={`${s.badge} ${s.badgePurple}`}>Confirmed</span>
            {c.zoomUrl && (
              <a href={c.zoomUrl} target="_blank" rel="noreferrer" style={{ marginLeft:"8px" }}>
                <button className={s.btnSm}><i className="ti ti-video" aria-hidden="true" /></button>
              </a>
            )}
          </div>
        ))}
      </div>

      {past.length > 0 && (
        <div className={s.card}>
          <div className={s.cardHead}><span className={s.cardTitle}>Past consultations</span></div>
          {past.map((c, i) => (
            <div className={s.listRow} key={i}>
              <span className={s.listTime}>{c.date}</span>
              <span className={s.listName}>{c.doctor} · {c.topic}</span>
              <span className={`${s.badge} ${s.badgeGray}`}>Done</span>
              <button className={s.btnSm} style={{ marginLeft:"auto" }} onClick={onBook}>Rebook</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
