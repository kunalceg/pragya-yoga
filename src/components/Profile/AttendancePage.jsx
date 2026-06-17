/* ── AttendancePage ── */
import { motion } from "framer-motion";
import styles from "./AttendancePage.module.css";
import w from "./widgets/DashboardWidgets.module.css";
import { Stagger, Item, StatCard, Panel, ProgressRing, Pill, PageHeader } from "./widgets/DashboardWidgets";

const STATUS_CLASS = {
  present: "present",
  zoom:    "zoom",
  absent:  "absent",
  future:  "future",
  empty:   "empty",
};

const DAYS = ["S","M","T","W","T","F","S"];

const LEGEND = [
  { cls: "present", label: "Present (offline)" },
  { cls: "zoom",    label: "Present (Zoom)"    },
  { cls: "absent",  label: "Absent"           },
];

export default function AttendancePage({ student }) {
  const records = student?.attendanceRecords ?? [];
  const total   = records.filter(r => r.status !== "empty" && r.status !== "future").length;
  const present = records.filter(r => r.status === "present" || r.status === "zoom").length;
  const absent  = records.filter(r => r.status === "absent").length;
  const zoomCnt = records.filter(r => r.status === "zoom").length;
  const rate    = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Attendance"
        actions={<Pill tone="orange" icon="ti-calendar-month">{student?.attendanceMonth ?? "This month"}</Pill>}
      />

      <Stagger>
        <div className={w.statGrid}>
          <StatCard tone="green"  icon="ti-circle-check"  label="Present"   value={present} index={0} />
          <StatCard tone="danger" icon="ti-circle-x"      label="Absent"    value={absent}  index={1} />
          <StatCard tone="orange" icon="ti-chart-donut"   label="Rate"      value={rate} suffix="%" progress={rate} index={2} />
          <StatCard tone="blue"   icon="ti-device-laptop" label="Zoom live" value={zoomCnt} index={3} />
        </div>

        <div className={w.grid2}>
          {/* Calendar heatmap */}
          <Panel title={student?.attendanceMonth ?? "This month"} icon="ti-calendar">
            <div className={styles.calGrid}>
              {DAYS.map((d, i) => (
                <div key={`h-${i}`} className={styles.calDayHead}>{d}</div>
              ))}
              {records.map((r, i) => (
                <motion.div
                  key={i}
                  className={`${styles.cell} ${styles[STATUS_CLASS[r.status]] ?? styles.future}`}
                  title={r.date ?? ""}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.006, 0.5), ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>

            <div className={styles.legend}>
              {LEGEND.map(({ cls, label }) => (
                <div key={label} className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles[cls]}`} />
                  {label}
                </div>
              ))}
            </div>
          </Panel>

          {/* Rate insight */}
          <Panel title="Rate" icon="ti-chart-arcs">
            <div className={styles.rateBox}>
              <ProgressRing value={rate} size={158} stroke={14} tone="orange" caption="Rate" />
              <div className={styles.rateMeta}>
                <div className={styles.rateMetaRow}>
                  <span className={styles.rateDot} data-tone="green" />Present
                  <strong>{present}</strong>
                </div>
                <div className={styles.rateMetaRow}>
                  <span className={styles.rateDot} data-tone="blue" />Zoom live
                  <strong>{zoomCnt}</strong>
                </div>
                <div className={styles.rateMetaRow}>
                  <span className={styles.rateDot} data-tone="red" />Absent
                  <strong>{absent}</strong>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </Stagger>
    </>
  );
}
