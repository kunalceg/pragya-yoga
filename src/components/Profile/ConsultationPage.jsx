import { useState } from "react";
import { motion } from "framer-motion";
import c from "./ListCards.module.css";
import { Stagger, Item, Panel, Pill, EmptyState, PrimaryButton, GhostButton, PageHeader } from "./widgets/DashboardWidgets";
import { bookConsultation, cancelConsultation } from "../api/StudentServices.js";

export default function ConsultationPage({ student, reload }) {
  const upcoming = student?.consultations?.upcoming ?? [];
  const past     = student?.consultations?.past     ?? [];

  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function openBooking() {
    setShowForm((v) => !v);
    setMsg("");
  }

  async function submitBooking(e) {
    e.preventDefault();
    if (!date) { setMsg("Please choose a date and time."); return; }
    setBusy(true);
    setMsg("");
    try {
      await bookConsultation({ date: new Date(date).toISOString(), topic: topic || "General consultation" });
      await reload?.();
      setShowForm(false);
      setDate(""); setTopic("");
      setMsg("Consultation booked successfully.");
    } catch (err) {
      setMsg(err.message || "Could not book. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel(id) {
    if (!id) return;
    setBusy(true);
    try {
      await cancelConsultation(id);
      await reload?.();
    } catch (err) {
      setMsg(err.message || "Could not cancel.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Consultations"
        actions={<PrimaryButton icon="ti-plus" onClick={openBooking}>Book</PrimaryButton>}
      />

      <Stagger>
        {showForm && (
          <Item>
            <form onSubmit={submitBooking} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end", padding: 16, background: "#fafafa", borderRadius: 12, border: "1px solid #eee" }}>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 12, gap: 4 }}>
                Date &amp; time
                <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", fontSize: 12, gap: 4, flex: 1, minWidth: 180 }}>
                Topic
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Diet & nutrition"
                  style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }} />
              </label>
              <PrimaryButton icon="ti-check" type="submit" disabled={busy}>{busy ? "Booking…" : "Confirm"}</PrimaryButton>
            </form>
          </Item>
        )}

        {msg && (
          <Item>
            <Pill tone="green" icon="ti-info-circle">{msg}</Pill>
          </Item>
        )}

        <Panel
          title="Upcoming"
          icon="ti-calendar-time"
          actions={<PrimaryButton icon="ti-plus" onClick={openBooking}>Book</PrimaryButton>}
        >
          {upcoming.length === 0 ? (
            <EmptyState compact icon="ti-stethoscope" title="No upcoming consultations." />
          ) : (
            <div className={c.list}>
              {upcoming.map((cu, i) => (
                <motion.div
                  key={cu.id || i}
                  className={c.apptRow}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
                >
                  <span className={c.dateChip}>{cu.date}</span>
                  <div className={c.apptBody}>
                    <span className={c.apptName}>{cu.doctor} · {cu.topic}</span>
                    <div className={c.apptBadges}>
                      <Pill tone="orange" icon="ti-circle-check">Confirmed</Pill>
                    </div>
                  </div>
                  <div className={c.apptAction}>
                    {cu.zoomUrl && (
                      <a href={cu.zoomUrl} target="_blank" rel="noreferrer">
                        <button className={c.iconBtnSm} aria-label="Join video call"><i className="ti ti-video" aria-hidden="true" /></button>
                      </a>
                    )}
                    <GhostButton icon="ti-x" onClick={() => handleCancel(cu.id)} disabled={busy}>Cancel</GhostButton>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Panel>

        {past.length > 0 && (
          <Panel title="Past consultations" icon="ti-history">
            <div className={c.list}>
              {past.map((cp, i) => (
                <motion.div
                  key={cp.id || i}
                  className={c.apptRow}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
                >
                  <span className={c.dateChip}>{cp.date}</span>
                  <div className={c.apptBody}>
                    <span className={c.apptName}>{cp.doctor} · {cp.topic}</span>
                    <div className={c.apptBadges}>
                      <Pill tone="neutral" icon="ti-check">Done</Pill>
                    </div>
                  </div>
                  <div className={c.apptAction}>
                    <GhostButton icon="ti-refresh" onClick={openBooking}>Rebook</GhostButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>
        )}
      </Stagger>
    </>
  );
}
