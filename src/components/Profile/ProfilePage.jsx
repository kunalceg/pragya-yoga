import { useState, useEffect } from "react";
import s from "./Dashboard.shared.module.css";
import { updateStudentProfile } from "../api/StudentServices";

export default function ProfilePage({ student, onUpdateSuccess }) {
  const p = student ?? {};

  const [isEditing,    setIsEditing]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name:  p.name  ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    city:  p.city  ?? "",
    style: p.style ?? "",
    level: p.level ?? "",
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
      name:  p.name  ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      city:  p.city  ?? "",
      style: p.style ?? "",
      level: p.level ?? "",
    });
    setErrorMessage("");
    setIsEditing(false);
  }

  async function handleSave() {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // updateStudentProfile now only needs formData — token handled inside service
      const savedData = await updateStudentProfile(formData);

      if (typeof onUpdateSuccess === "function") {
        onUpdateSuccess(savedData); // Refreshes sidebar name/plan instantly
      }

      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not save your profile. Please try again.");
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

  return (
    <div>
      <h1 className={s.pageTitle}>Profile</h1>

      {errorMessage && (
        <div className={s.errorNotification}>{errorMessage}</div>
      )}

      {/* ── Metrics Banner ── */}
      <div className={s.metrics}>
        <div className={s.metric}>
          <p className={s.metricNum}>{p.stats?.classes ?? 0}</p>
          <p className={s.metricLbl}>Classes</p>
        </div>
        <div className={s.metric}>
          <p className={s.metricNum}>{p.planMonths ?? 0}</p>
          <p className={s.metricLbl}>Months</p>
        </div>
        <div className={s.metric}>
          <p className={s.metricNum}>{p.stats?.attendancePct ?? 0}%</p>
          <p className={s.metricLbl}>Attendance</p>
        </div>
        <div className={s.metric}>
          <p className={s.metricNum}>{p.referralCount ?? 0}</p>
          <p className={s.metricLbl}>Referrals</p>
        </div>
      </div>

      {/* ── Personal Info Card ── */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Personal details</h2>
          <div className={s.cardActions}>
            {!isEditing ? (
              <button type="button" className={s.btnSm} onClick={handleEdit}>
                <i className="ti ti-edit" aria-hidden="true" />
                {" Edit"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={s.btnSm}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <i className="ti ti-x" aria-hidden="true" />
                  {" Cancel"}
                </button>
                <button
                  type="button"
                  className={`${s.btnSm} ${s.btnSave}`}
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  <i className="ti ti-check" aria-hidden="true" />
                  {isSubmitting ? " Saving…" : " Save"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className={s.cardBody}>
          {personalDetailsFields.map(({ icon, label, name, type }) => (
            <div className={s.row} key={name}>
              <span className={s.rowLabel}>
                <i className={`ti ${icon}`} aria-hidden="true" />
                {label}
              </span>
              {isEditing ? (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className={s.editInput}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              ) : (
                <span className={s.rowVal}>{formData[name] || "—"}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
