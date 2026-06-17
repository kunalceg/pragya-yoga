import { useState } from "react";
import { motion } from "framer-motion";
import c from "./ListCards.module.css";
import { Stagger, Panel, Pill, EmptyState, PrimaryButton, GhostButton, PageHeader } from "./widgets/DashboardWidgets";
import { registerWorkshop } from "../api/StudentServices.js";

export default function WorkshopsPage({ student, reload }) {
  const registered = student?.workshops?.registered ?? [];
  const available  = student?.workshops?.available  ?? [];
  const [busyId, setBusyId] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister(wk) {
    setBusyId(wk.id);
    setMsg("");
    try {
      await registerWorkshop(wk.id);
      await reload?.();
      setMsg(`Registered for ${wk.name}.`);
    } catch (err) {
      setMsg(err.message || "Could not register. Please try again.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <>
      <PageHeader title="Workshops" />

      <Stagger>
        {msg && (
          <div className={c.list} style={{ marginBottom: 8 }}>
            <Pill tone="green" icon="ti-info-circle">{msg}</Pill>
          </div>
        )}
        {registered.length > 0 && (
          <Panel title="Registered" icon="ti-ticket">
            <div className={c.list}>
              {registered.map((wk, i) => (
                <motion.div
                  key={i}
                  className={c.apptRow}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
                >
                  <span className={c.dateChip}>{wk.date}</span>
                  <div className={c.apptBody}>
                    <span className={c.apptName}>{wk.name} · {wk.duration}</span>
                    <div className={c.apptBadges}>
                      <Pill tone="green" icon="ti-circle-check">Paid</Pill>
                    </div>
                  </div>
                  <div className={c.apptAction}>
                    <GhostButton icon="ti-bell">Remind</GhostButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>
        )}

        <Panel title="Available workshops" icon="ti-confetti">
          {available.length === 0 ? (
            <EmptyState compact icon="ti-calendar-event" title="No workshops available right now." />
          ) : (
            <div className={c.list}>
              {available.map((wk, i) => (
                <motion.div
                  key={i}
                  className={c.apptRow}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
                >
                  <span className={c.dateChip}>{wk.date}</span>
                  <div className={c.apptBody}>
                    <span className={c.apptName}>{wk.name} · {wk.duration}</span>
                  </div>
                  <div className={c.apptAction}>
                    <span className={c.price}>₹{wk.price?.toLocaleString("en-IN")}</span>
                    <PrimaryButton onClick={() => handleRegister(wk)} disabled={busyId === wk.id}>
                      {busyId === wk.id ? "Registering…" : "Register"}
                    </PrimaryButton>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Panel>
      </Stagger>
    </>
  );
}
