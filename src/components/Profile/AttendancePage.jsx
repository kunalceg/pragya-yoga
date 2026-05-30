/* ── AttendancePage ── */
import s from "./Dashboard.shared.module.css";

const STATUS_COLOR = {
  present: "#0F6E56",
  zoom:    "#534AB7",
  absent:  "#FCEBEB",
  future:  "#f3f4f6",
  empty:   "transparent",
};

const STATUS_BORDER = { absent: "0.5px solid #F09595" };

const DAYS = ["S","M","T","W","T","F","S"];

export default function AttendancePage({ student }) {
  const records = student?.attendanceRecords ?? [];
  const total   = records.filter(r => r.status !== "empty" && r.status !== "future").length;
  const present = records.filter(r => r.status === "present" || r.status === "zoom").length;
  const absent  = records.filter(r => r.status === "absent").length;
  const zoomCnt = records.filter(r => r.status === "zoom").length;
  const rate    = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      <p className={s.pageTitle}>Attendance</p>
      <div className={s.metrics}>
        <div className={s.metric}><p className={s.metricNum}>{present}</p><p className={s.metricLbl}>Present</p></div>
        <div className={s.metric}><p className={s.metricNum}>{absent}</p><p className={s.metricLbl}>Absent</p></div>
        <div className={s.metric}><p className={s.metricNum}>{rate}%</p><p className={s.metricLbl}>Rate</p></div>
        <div className={s.metric}><p className={s.metricNum}>{zoomCnt}</p><p className={s.metricLbl}>Zoom live</p></div>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}><span className={s.cardTitle}>{student?.attendanceMonth ?? "This month"}</span></div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px" }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ fontSize:"10px", color:"#9ca3af", textAlign:"center", paddingBottom:"2px" }}>{d}</div>
          ))}
          {records.map((r, i) => (
            <div key={i} style={{
              aspectRatio:"1",
              borderRadius:"4px",
              background: STATUS_COLOR[r.status] ?? "#f3f4f6",
              border: STATUS_BORDER[r.status] ?? "none",
            }} title={r.date ?? ""} />
          ))}
        </div>
        <div style={{ display:"flex", gap:"12px", marginTop:"10px", flexWrap:"wrap" }}>
          {[
            { color:"#0F6E56", label:"Present (offline)" },
            { color:"#534AB7", label:"Present (Zoom)"    },
            { color:"#FCEBEB", label:"Absent", border:"0.5px solid #F09595" },
          ].map(({ color, label, border }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:"#6b7280" }}>
              <div style={{ width:"10px", height:"10px", borderRadius:"2px", background:color, border:border ?? "none" }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
