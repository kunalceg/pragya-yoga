import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import s from "./Dashboard.shared.module.css";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../api/StudentServices.js";

const TYPE_META = {
  new_asset:       { icon: "ti-file-plus",   label: "New Material",   cls: "badgeGreen" },
  asset_updated:   { icon: "ti-refresh",     label: "Updated",        cls: "badgeAmber" },
  asset_replaced:  { icon: "ti-replace",     label: "New Version",    cls: "badgePurple" },
  info:            { icon: "ti-info-circle", label: "Info",           cls: "badgeGray" },
  success:         { icon: "ti-check-circle",label: "Success",        cls: "badgeGreen" },
  warning:         { icon: "ti-alert-circle",label: "Warning",        cls: "badgeAmber" },
  payment:         { icon: "ti-coin",        label: "Payment",        cls: "badgeGreen" },
  class:           { icon: "ti-yoga",        label: "Class",          cls: "badgePurple" },
  workshop:        { icon: "ti-award",       label: "Workshop",       cls: "badgeOrange" },
  system:          { icon: "ti-settings",    label: "System",         cls: "badgeGray" },
};

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function typeIcon(type) {
  return TYPE_META[type] || TYPE_META.info;
}

export default function NotificationsPage({ student, reload, onNavigate }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const fetchNotifs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifs(Array.isArray(data) ? data : []);
    } catch {
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  const unread = notifs.filter((n) => !n.read);

  async function handleMarkAll() {
    setBusy(true);
    try {
      await markAllNotificationsRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      await reload?.();
    } catch {
      /* non-fatal */
    } finally {
      setBusy(false);
    }
  }

  async function handleMarkRead(n) {
    if (n.read) return;
    try {
      await markNotificationRead(n._id);
      setNotifs((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      await reload?.();
    } catch {
      /* non-fatal */
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNotification(id);
      setNotifs((prev) => prev.filter((x) => x._id !== id));
      await reload?.();
    } catch {
      /* non-fatal */
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p className={s.pageTitle}>Notifications</p>
        {unread.length > 0 && (
          <button className={s.btnSm} onClick={handleMarkAll} disabled={busy}>
            <i className="ti ti-checks" aria-hidden="true" />
            {busy ? "Marking…" : `Mark all read (${unread.length})`}
          </button>
        )}
      </div>

      {loading ? (
        <div className={s.card}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--color-border-light)" : "none" }}>
              <div className={s.skel} style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className={s.skel} style={{ height: 14, width: "60%", marginBottom: 8, borderRadius: 6 }} />
                <div className={s.skel} style={{ height: 12, width: "40%", borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <div className={s.emptyState}>
          <i className="ti ti-bell-off" aria-hidden="true" />
          <p>No notifications yet.</p>
          <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>
            We'll notify you here when new learning materials are available.
          </p>
        </div>
      ) : (
        <div className={s.card} style={{ padding: 0, overflow: "hidden" }}>
          <AnimatePresence initial={false}>
            {notifs.map((n, i) => {
              const meta = typeIcon(n.type);
              return (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    onClick={() => {
                      handleMarkRead(n);
                      if (n.workshop && typeof onNavigate === "function") {
                        onNavigate("workshops", { workshopId: n.workshop });
                      }
                    }}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "14px 18px",
                      cursor: "pointer",
                      borderBottom: i < notifs.length - 1 ? "1px solid var(--color-border-light)" : "none",
                      background: n.read ? "transparent" : "rgba(250,129,18,0.04)",
                      transition: "background 0.2s",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        fontSize: 16,
                        background: n.asset ? "rgba(250,129,18,0.1)" : "var(--color-bg-tertiary)",
                        color: n.asset ? "var(--color-primary)" : "var(--color-text-muted)",
                      }}
                    >
                      <i className={`ti ${meta.icon}`} aria-hidden="true" />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--color-dark)" }}>
                          {n.title || meta.label}
                        </span>
                        <span className={`${s.badge} ${s[meta.cls] || s.badgeGray}`} style={{ fontSize: 9.5, padding: "2px 8px" }}>
                          {meta.label}
                        </span>
                        {!n.read && (
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "var(--color-primary)",
                              flexShrink: 0,
                            }}
                            aria-label="Unread"
                          />
                        )}
                      </div>

                      <div
                        style={{ fontSize: 12.5, color: "var(--color-text-secondary)", lineHeight: 1.5 }}
                        dangerouslySetInnerHTML={{ __html: n.message }}
                      />

                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: "var(--color-text-muted)", display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <i className="ti ti-clock" style={{ fontSize: 10 }} />
                          {relativeTime(n.createdAt)}
                        </span>

                        {n.asset && (
                          <a
                            href={n.link || "/studentdashboard"}
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--color-primary)",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <i className="ti ti-download" style={{ fontSize: 10 }} />
                            View in Downloads
                          </a>
                        )}
                        {n.workshop && (
                          <a
                            onClick={(e) => { e.stopPropagation(); handleMarkRead(n); onNavigate?.("workshops", { workshopId: n.workshop }); }}
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--color-primary)",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              cursor: "pointer",
                            }}
                          >
                            <i className="ti ti-award" style={{ fontSize: 10 }} />
                            View Workshop
                          </a>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        padding: 4,
                        borderRadius: 6,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        opacity: 0.5,
                        transition: "opacity 0.15s, background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "rgba(220,38,38,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.background = "none"; }}
                      aria-label="Delete notification"
                    >
                      <i className="ti ti-x" style={{ fontSize: 14 }} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
