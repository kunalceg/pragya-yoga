import { useState, useEffect } from "react";
import s from "./Dashboard.shared.module.css";
import styles from "./ActivePlanPage.module.css";

const PAUSE_RULES = { 1: 0, 3: 15, 6: 30, 12: 60 };

export default function ActivePlanPage({ student }) {
  const [barWidth, setBarWidth] = useState(0);

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

  return (
    <div>
      <p className={s.pageTitle}>Active plan</p>

      <div className={s.card}>
        <div className={s.cardHead}>
          <span className={s.cardTitle}>{months}-Month Membership</span>
          <span className={isActive ? s.badgeGreen : s.badgeRed}>
            {isActive ? "Active" : "Expired"}
          </span>
        </div>

        <div className={s.row}><span className={s.rowLabel}><i className="ti ti-calendar" aria-hidden="true" />Start date</span><span className={s.rowVal}>{startDate}</span></div>
        <div className={s.row}><span className={s.rowLabel}><i className="ti ti-calendar-off" aria-hidden="true" />Expiry date</span><span className={s.rowVal}>{expiry}</span></div>
        <div className={s.row}><span className={s.rowLabel}><i className="ti ti-clock" aria-hidden="true" />Days remaining</span><span className={s.rowVal}>{daysLeft} days</span></div>
        <div className={s.row}>
          <span className={s.rowLabel}><i className="ti ti-video" aria-hidden="true" />Zoom access</span>
          <span className={isActive ? `${s.badge} ${s.badgeGreen}` : `${s.badge} ${s.badgeRed}`}>
            {isActive ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* Progress bar */}
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
          <button className={s.btnPrimary}><i className="ti ti-refresh" aria-hidden="true" />Renew plan</button>
          {pauseDays > 0 && (
            <button className={s.btnSm}><i className="ti ti-player-pause" aria-hidden="true" />Pause</button>
          )}
          <button className={s.btnSm}><i className="ti ti-arrow-up" aria-hidden="true" />Upgrade</button>
        </div>
      </div>
    </div>
  );
}
