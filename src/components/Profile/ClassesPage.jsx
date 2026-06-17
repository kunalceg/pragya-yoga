import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ClassesPage.module.css";
import w from "./widgets/DashboardWidgets.module.css";
import { Stagger, Item, StatCard, Panel, Tabs, Pill, EmptyState, PrimaryButton, PageHeader } from "./widgets/DashboardWidgets";
import { enrollClass } from "../api/StudentServices.js";

export default function ClassesPage({ student, reload }) {
  const [tab, setTab]     = useState("upcoming");
  const [busyId, setBusyId] = useState("");
  const upcoming          = student?.classes?.upcoming    ?? [];
  const recordings        = student?.classes?.recordings  ?? [];
  const zoomEnabled       = student?.planActive           ?? false;

  async function handleEnroll(cls) {
    if (!cls.id) return;
    setBusyId(cls.id);
    try {
      await enrollClass(cls.id);
      await reload?.();
    } catch (err) {
      alert(err.message || "Could not enroll.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <>
      <PageHeader title="Classes" />

      <Stagger>
        <div className={w.statGrid}>
          <StatCard tone="orange" icon="ti-calendar-event" label="Upcoming"   value={upcoming.length}   index={0} />
          <StatCard tone="blue"   icon="ti-player-play"    label="Recordings" value={recordings.length} index={1} />
        </div>

        <Item>
          <Tabs
            layoutId="classesTab"
            active={tab}
            onChange={setTab}
            tabs={[
              { id: "upcoming",   label: "Upcoming",   icon: "ti-calendar-event" },
              { id: "recordings", label: "Recordings", icon: "ti-player-play" },
            ]}
          />
        </Item>

        <AnimatePresence mode="wait">
          {tab === "upcoming" && (
            <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {upcoming.length === 0 ? (
                <EmptyState icon="ti-calendar" title="No upcoming classes." />
              ) : (
                <div className={styles.list}>
                  {upcoming.map((cls, i) => (
                    <motion.div
                      key={i}
                      className={styles.classCard}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
                      whileHover={{ y: -3 }}
                    >
                      <span className={styles.timeChip}>{cls.time}</span>
                      <div className={styles.classBody}>
                        <span className={styles.className}>{cls.name}</span>
                        <Pill tone={cls.mode === "online" ? "orange" : "green"} icon={cls.mode === "online" ? "ti-device-laptop" : "ti-building"}>
                          {cls.mode === "online" ? "Zoom" : "Studio"}
                        </Pill>
                      </div>
                      <div className={styles.classAction}>
                        {cls.mode === "online" && (
                          zoomEnabled
                            ? <a href={cls.zoomUrl ?? "#"} target="_blank" rel="noreferrer">
                                <PrimaryButton icon="ti-video">Join</PrimaryButton>
                              </a>
                            : <Pill tone="danger" icon="ti-alert-circle">Plan inactive</Pill>
                        )}
                        {cls.mode === "offline" && (
                          cls.enrolled
                            ? <Pill tone="neutral" icon="ti-circle-check">Enrolled</Pill>
                            : <PrimaryButton icon="ti-plus" onClick={() => handleEnroll(cls)} disabled={busyId === cls.id}>
                                {busyId === cls.id ? "Enrolling…" : "Enroll"}
                              </PrimaryButton>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "recordings" && (
            <motion.div key="recordings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {recordings.length === 0 ? (
                <EmptyState icon="ti-video-off" title="No recordings yet." />
              ) : (
                <div className={styles.list}>
                  {recordings.map((r, i) => (
                    <motion.div
                      key={i}
                      className={styles.classCard}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 26 }}
                      whileHover={{ y: -3 }}
                    >
                      <span className={styles.timeChip}>{r.date}</span>
                      <div className={styles.classBody}>
                        <span className={styles.className}>{r.name}</span>
                        <Pill tone="orange" icon="ti-device-laptop">Zoom</Pill>
                      </div>
                      <div className={styles.classAction}>
                        <a href={r.url ?? "#"} target="_blank" rel="noreferrer">
                          <PrimaryButton icon="ti-player-play">Watch</PrimaryButton>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Stagger>
    </>
  );
}
