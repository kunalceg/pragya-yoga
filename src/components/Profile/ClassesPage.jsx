import { useState } from "react";
import s from "./Dashboard.shared.module.css";

export default function ClassesPage({ student }) {
  const [tab, setTab]     = useState("upcoming");
  const upcoming          = student?.classes?.upcoming    ?? [];
  const recordings        = student?.classes?.recordings  ?? [];
  const zoomEnabled       = student?.planActive           ?? false;

  return (
    <div>
      <p className={s.pageTitle}>Classes</p>
      <div className={s.tabs}>
        <button className={`${s.tab} ${tab === "upcoming" ? s.tabActive : ""}`} onClick={() => setTab("upcoming")}>Upcoming</button>
        <button className={`${s.tab} ${tab === "recordings" ? s.tabActive : ""}`} onClick={() => setTab("recordings")}>Recordings</button>
      </div>

      {tab === "upcoming" && (
        <div className={s.card}>
          {upcoming.length === 0 && (
            <div className={s.emptyState}><i className="ti ti-calendar" aria-hidden="true" />No upcoming classes.</div>
          )}
          {upcoming.map((cls, i) => (
            <div className={s.listRow} key={i}>
              <span className={s.listTime}>{cls.time}</span>
              <span className={s.listName}>{cls.name}</span>
              <span className={cls.mode === "online" ? s.typeOnline : s.typeOffline}>
                {cls.mode === "online" ? "Zoom" : "Studio"}
              </span>
              {cls.mode === "online" && (
                zoomEnabled
                  ? <a href={cls.zoomUrl ?? "#"} target="_blank" rel="noreferrer" style={{ marginLeft:"auto" }}>
                      <button className={s.btnSm}><i className="ti ti-video" aria-hidden="true" /> Join</button>
                    </a>
                  : <span className={`${s.badge} ${s.badgeRed}`} style={{ marginLeft:"auto" }}>Plan inactive</span>
              )}
              {cls.mode === "offline" && (
                <span className={`${s.badge} ${s.badgeGray}`} style={{ marginLeft:"auto" }}>
                  {cls.enrolled ? "Enrolled" : "Enroll"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "recordings" && (
        <div className={s.card}>
          {recordings.length === 0 && (
            <div className={s.emptyState}><i className="ti ti-video-off" aria-hidden="true" />No recordings yet.</div>
          )}
          {recordings.map((r, i) => (
            <div className={s.listRow} key={i}>
              <span className={s.listTime}>{r.date}</span>
              <span className={s.listName}>{r.name}</span>
              <span className={s.typeOnline}>Zoom</span>
              <a href={r.url ?? "#"} target="_blank" rel="noreferrer" style={{ marginLeft:"auto" }}>
                <button className={s.btnSm}><i className="ti ti-player-play" aria-hidden="true" /> Watch</button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
