import s from "./Dashboard.shared.module.css";

const FILE_ICON = { pdf:"ti-file-type-pdf", video:"ti-video", audio:"ti-file", guide:"ti-file" };
const FILE_COLOR = { pdf:"#A32D2D", video:"#534AB7", audio:"#0F6E56", guide:"#6b7280" };

export default function DownloadsPage({ student }) {
  const files = student?.downloads ?? [];
  return (
    <div>
      <p className={s.pageTitle}>Downloads</p>
      <div className={s.card}>
        {files.length === 0 && (
          <div className={s.emptyState}><i className="ti ti-folder" aria-hidden="true" />No downloads available yet.</div>
        )}
        {files.map((f, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 0", borderBottom: i < files.length-1 ? "0.5px solid #f3f4f6" : "none", fontSize:"13px" }}>
            <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <i className={`ti ${FILE_ICON[f.type] ?? "ti-file"}`} aria-hidden="true" style={{ color: FILE_COLOR[f.type] ?? "#6b7280", fontSize:"15px" }} />
            </div>
            <span style={{ flex:1, color:"#111827" }}>{f.name}</span>
            <span style={{ fontSize:"11px", color:"#9ca3af" }}>{f.type?.toUpperCase()} · {f.size}</span>
            <a href={f.url ?? "#"} download target="_blank" rel="noreferrer">
              <button className={s.btnSm} aria-label={`Download ${f.name}`}><i className="ti ti-download" aria-hidden="true" /></button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
