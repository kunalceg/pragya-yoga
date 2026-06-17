import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import w from "./widgets/DashboardWidgets.module.css";
import p from "./ProfilePage.module.css";
import { Stagger, Item, StatCard, Panel, PrimaryButton, GhostButton, Pill } from "./widgets/DashboardWidgets";
import { updateStudentProfile } from "../api/StudentServices.js";

export default function ProfilePage({ student, onUpdateSuccess }) {
  // 🎯 SAFETY DEFENSE: Fallback defaults shield the layout metrics from structural nesting drops
  const pData = student ?? {};
  const stats = pData.stats || { classes: 0, attendancePct: 0 };

  const [isEditing,    setIsEditing]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name:  pData.name  ?? "",
    email: pData.email ?? "",
    phone: pData.phone ?? "",
    city:  pData.city  ?? "",
    style: pData.style ?? "",
    level: pData.level ?? "",
  });

  // Sync form whenever parent refreshes the student prop
  useEffect(() => {
    if (student) {
      setFormData({
        name:  student.name  ?? "",
        email: student.email ?? "",
        phone: student.phone ?? "",
        city:  student.city  ?? "",
        style: student.style ?? "",
        level: student.level ?? "",
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleEdit() {
    setErrorMessage("");
    setIsEditing(true);
  }

  function handleCancel() {
    setFormData({
      name:  pData.name  ?? "",
      email: pData.email ?? "",
      phone: pData.phone ?? "",
      city:  pData.city  ?? "",
      style: pData.style ?? "",
      level: pData.level ?? "",
    });
    setErrorMessage("");
    setIsEditing(false);
  }

  async function handleSave() {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Send update parameters via services engine
      const savedData = await updateStudentProfile(formData);

      // 2. Clear out legacy string states
      setErrorMessage("");

      if (typeof onUpdateSuccess === "function") {
        onUpdateSuccess(savedData); // Refreshes state values down the tree pipeline
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Profile Save Failure:", error);
      // Fallback message extraction parsing logic
      setErrorMessage(error.message || "Could not save your profile. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const personalDetailsFields = [
    { icon: "ti-user",      label: "Name",  name: "name",  type: "text"  },
    { icon: "ti-mail",      label: "Email", name: "email", type: "email" },
    { icon: "ti-phone",     label: "Phone", name: "phone", type: "tel"   },
    { icon: "ti-map-pin",   label: "City",  name: "city",  type: "text"  },
    { icon: "ti-yoga",      label: "Style", name: "style", type: "text"  },
    { icon: "ti-chart-bar", label: "Level", name: "level", type: "text"  },
  ];

  const studentName = pData.name || pData.email?.split("@")[0] || "User";
  const initials = studentName.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Stagger>
      {/* ── Hero ── */}
      <Item className={p.hero} as="header">
        <div className={p.heroDeco} aria-hidden="true">
          <span className={p.heroOrb} />
          <span className={p.heroOrb2} />
        </div>

        <div className={p.heroMain}>
          <div className={p.heroAvatar}>
            {initials}
            <span className={p.heroAvatarDot} aria-hidden="true" />
          </div>
          <div className={p.heroText}>
            <h1 className={p.heroName}>{pData.name || studentName}</h1>
            {pData.email && <p className={p.heroEmail}><i className="ti ti-mail" aria-hidden="true" />{pData.email}</p>}
            <div className={p.heroPills}>
              {pData.level && <Pill tone="orange" icon="ti-chart-bar">{pData.level}</Pill>}
              {pData.style && <Pill tone="neutral" icon="ti-yoga">{pData.style}</Pill>}
              {pData.city  && <Pill tone="neutral" icon="ti-map-pin">{pData.city}</Pill>}
            </div>
          </div>
        </div>

        <div className={p.heroAction}>
          {!isEditing ? (
            <PrimaryButton icon="ti-edit" onClick={handleEdit}>Edit</PrimaryButton>
          ) : (
            <>
              <GhostButton icon="ti-x" onClick={handleCancel} disabled={isSubmitting}>Cancel</GhostButton>
              <PrimaryButton icon="ti-check" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save"}
              </PrimaryButton>
            </>
          )}
        </div>
      </Item>

      {errorMessage && (
        <motion.div
          className={p.errorNote}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          {errorMessage}
        </motion.div>
      )}

      {/* ── KPI widgets ── */}
      <div className={w.statGrid}>
        <StatCard tone="orange" icon="ti-yoga"           label="Classes"    value={stats.classes ?? 0} index={0} />
        <StatCard tone="blue"   icon="ti-calendar-stats" label="Months"     value={pData.planMonths ?? 0} index={1} />
        <StatCard tone="green"  icon="ti-calendar-check" label="Attendance" value={stats.attendancePct ?? 0} suffix="%" progress={stats.attendancePct ?? 0} index={2} />
        <StatCard tone="amber"  icon="ti-share"          label="Referrals"  value={pData.referralCount ?? 0} index={3} />
      </div>

      {/* ── Personal details ── */}
      <Panel title="Personal details" icon="ti-id-badge-2">
        <div className={p.fieldGrid}>
          {personalDetailsFields.map(({ icon, label, name, type }) => (
            <div className={`${p.field} ${isEditing ? p.fieldEditing : ""}`} key={name}>
              <span className={p.fieldIcon}><i className={`ti ${icon}`} aria-hidden="true" /></span>
              <div className={p.fieldBody}>
                <span className={p.fieldLabel}>{label}</span>
                {isEditing ? (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className={p.fieldInput}
                    disabled={isSubmitting || name === "email"} // Email locked from structural editing crashes
                    maxLength={50}
                    autoComplete="off"
                  />
                ) : (
                  <span className={p.fieldValue}>{formData[name] || "—"}</span>
                )}
              </div>
              {name === "email" && isEditing && (
                <span className={p.fieldLock} title="Email cannot be edited"><i className="ti ti-lock" aria-hidden="true" /></span>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </Stagger>
  );
}
