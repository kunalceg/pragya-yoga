import { useState } from "react";
import s from "./Dashboard.shared.module.css";
import { markAllNotificationsRead } from "../api/StudentServices.js";

const CHANNEL_COLORS = { whatsapp:"#0F6E56", email:"#534AB7", sms:"#854F0B" };

export default function NotificationsPage({ student, reload }) {
  const notifs = student?.notifications ?? [];
  const [busy, setBusy] = useState(false);
  const hasUnread = notifs.some((n) => n.unread);

  async function handleMarkAll() {
    setBusy(true);
    try {
      await markAllNotificationsRead();
      await reload?.();
    } catch {
      /* non-fatal */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p className={s.pageTitle}>Notifications</p>
        {hasUnread && (
          <button className={s.btnSm} onClick={handleMarkAll} disabled={busy}>
            <i className="ti ti-checks" aria-hidden="true" /> {busy ? "Marking…" : "Mark all read"}
          </button>
        )}
      </div>
      <div className={s.card}>
        {notifs.length === 0 && (
          <div className={s.emptyState}><i className="ti ti-bell-off" aria-hidden="true" />No notifications yet.</div>
        )}
        {notifs.map((n, i) => (
          <div key={i} style={{ display:"flex", gap:"10px", padding:"9px 0", borderBottom: i < notifs.length-1 ? "0.5px solid #f3f4f6":"none", fontSize:"13px" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background: n.unread ? "#534AB7" : "#e5e7eb", marginTop:"5px", flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ color:"#111827", lineHeight:1.45 }} dangerouslySetInnerHTML={{ __html: n.message }} />
              <div style={{ fontSize:"11px", color:"#9ca3af", marginTop:"3px", display:"flex", gap:"6px", alignItems:"center" }}>
                <span>{n.time}</span>
                {n.channels?.map(ch => (
                  <span key={ch} style={{ display:"inline-flex", alignItems:"center", gap:"3px", color: CHANNEL_COLORS[ch] ?? "#6b7280" }}>
                    <i className={`ti ti-brand-${ch}`} aria-hidden="true" style={{ fontSize:"11px" }} />{ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
