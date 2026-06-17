import { useState, useEffect } from "react";
import styles from "./ActivePlanPage.module.css";
import w from "./widgets/DashboardWidgets.module.css";
import { Stagger, Item, Panel, ProgressRing, Pill, PrimaryButton, GhostButton, PageHeader } from "./widgets/DashboardWidgets";
import { renewMembership, pauseMembership, upgradeMembership } from "../api/StudentServices.js";

const PAUSE_RULES = { 1: 0, 3: 15, 6: 30, 12: 60 };
const UPGRADE_NEXT = { 0: 3, 1: 3, 3: 6, 6: 12, 12: 12 };

export default function ActivePlanPage({ student, reload }) {
  const [barWidth, setBarWidth] = useState(0);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  const months    = student?.planMonths ?? 1;
  const startDate = student?.planStart  ?? "—";
  const expiry    = student?.planExpiry ?? "—";
  const daysLeft  = student?.daysLeft   ?? 0;
  const totalDays = months * 30;
  const usedPct   = Math.round(((totalDays - daysLeft) / totalDays) * 100);
  const pauseDays = PAUSE_RULES[months] ?? 0;
  const isActive  = student?.planActive ?? true;

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(usedPct), 300);
    return () => clearTimeout(t);
  }, [usedPct]);

  const pauseLabel = pauseDays === 0
    ? "No pause option on 1-month membership."
    : pauseDays === 60
      ? `Your ${months}-month plan allows a 2-month (60-day) pause.`
      : `Your ${months}-month plan allows a ${pauseDays}-day pause.`;

  async function runAction(kind, fn) {
    setBusy(kind);
    setMsg("");
    try {
      await fn();
      await reload?.();
      setMsg(
        kind === "renew" ? "Membership renewed successfully." :
        kind === "pause" ? "Membership paused." :
        "Membership upgraded successfully."
      );
    } catch (err) {
      setMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy("");
    }
  }

  const handleRenew   = () => runAction("renew", () => renewMembership(months || 1));
  const handlePause   = () => runAction("pause", () => pauseMembership(7));
  const handleUpgrade = () => runAction("upgrade", () => upgradeMembership(UPGRADE_NEXT[months] ?? 3));

  const dates = [
    { icon: "ti-calendar-plus", label: "Start date",     value: startDate,        tone: "blue"  },
    { icon: "ti-calendar-off",  label: "Expiry date",    value: expiry,           tone: "amber" },
    { icon: "ti-clock-hour-4",  label: "Days remaining", value: `${daysLeft} days`, tone: "green" },
  ];

  return (
    <>
      <PageHeader
        title="Active plan"
        actions={
          <Pill tone={isActive ? "green" : "danger"} icon={isActive ? "ti-circle-check" : "ti-circle-x"}>
            {isActive ? "Active" : "Expired"}
          </Pill>
        }
      />

      <Stagger>
        {/* ── Membership overview ── */}
        <Item className={styles.overview}>
          <div className={styles.overviewDeco} aria-hidden="true" />

          <div className={styles.ringSide}>
            <ProgressRing value={usedPct} size={150} stroke={13} tone="orange">
              <span className={styles.ringPct}>{usedPct}%</span>
              <span className={styles.ringSub}>used</span>
            </ProgressRing>
          </div>

          <div className={styles.overviewBody}>
            <h2 className={styles.planName}>{months}-Month Membership</h2>
            <div className={styles.planBadges}>
              <Pill tone={isActive ? "green" : "danger"} icon={isActive ? "ti-circle-check" : "ti-circle-x"}>
                {isActive ? "Active" : "Expired"}
              </Pill>
            </div>

            <div className={styles.benefitRow}>
              <span className={styles.benefitLabel}><i className="ti ti-video" aria-hidden="true" />Zoom access</span>
              <Pill tone={isActive ? "green" : "danger"} icon={isActive ? "ti-check" : "ti-x"}>
                {isActive ? "Enabled" : "Disabled"}
              </Pill>
            </div>
          </div>
        </Item>

        {/* ── Key dates ── */}
        <Item className={styles.dateGrid}>
          {dates.map(({ icon, label, value, tone }) => (
            <div key={label} className={`${styles.dateTile} ${styles[`tile_${tone}`]}`}>
              <span className={styles.dateIcon}><i className={`ti ${icon}`} aria-hidden="true" /></span>
              <div>
                <span className={styles.dateLabel}>{label}</span>
                <span className={styles.dateValue}>{value}</span>
              </div>
            </div>
          ))}
        </Item>

        {/* ── Plan timeline ── */}
        <Panel title="" icon="">
          <div className={styles.barWrap}>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${barWidth}%` }} />
            </div>
            <div className={styles.barLabels}>
              <span>Start</span>
              <span>{usedPct}% used</span>
              <span>End</span>
            </div>
          </div>

          {/* Pause info */}
          <div className={`${styles.pauseBox} ${pauseDays === 0 ? styles.pauseRed : styles.pauseAmber}`}>
            <i className="ti ti-info-circle" aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>{pauseLabel} {pauseDays > 0 ? "You have not used any pause days yet." : ""}</span>
          </div>

          <div className={styles.btnRow}>
            <PrimaryButton icon="ti-refresh" onClick={handleRenew} disabled={!!busy}>
              {busy === "renew" ? "Renewing…" : "Renew plan"}
            </PrimaryButton>
            {pauseDays > 0 && (
              <GhostButton icon="ti-player-pause" onClick={handlePause} disabled={!!busy}>
                {busy === "pause" ? "Pausing…" : "Pause"}
              </GhostButton>
            )}
            <GhostButton icon="ti-arrow-up" onClick={handleUpgrade} disabled={!!busy}>
              {busy === "upgrade" ? "Upgrading…" : "Upgrade"}
            </GhostButton>
          </div>

          {msg && (
            <div className={`${styles.pauseBox} ${styles.pauseAmber}`} style={{ marginTop: 12 }}>
              <i className="ti ti-info-circle" aria-hidden="true" style={{ flexShrink: 0 }} />
              <span>{msg}</span>
            </div>
          )}
        </Panel>
      </Stagger>
    </>
  );
}
