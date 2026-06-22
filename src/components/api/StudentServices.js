// ─────────────────────────────────────────────────────────
// StudentServices.js
// All API calls for the student dashboard. JWT access token is
// read from localStorage and sent as a Bearer header. On a 401
// the refresh token is used transparently to obtain a new access
// token before retrying once.
// ─────────────────────────────────────────────────────────

const API_DOMAIN = import.meta.env.VITE_API_URL || "https://pragya-yoga.onrender.com";
const AUTH_URL = `${API_DOMAIN}/api/auth`;
const STUDENT_URL = `${API_DOMAIN}/api/student`;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Attempt to refresh the access token using the stored refresh token.
async function tryRefresh() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${AUTH_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      return true;
    }
  } catch {
    /* fall through */
  }
  return false;
}

// Core fetch wrapper: injects auth, retries once after refresh, and
// surfaces a clean Error with the server message.
async function api(path, { method = "GET", body, base = STUDENT_URL } = {}) {
  const opts = {
    method,
    headers: authHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let res = await fetch(`${base}${path}`, opts);

  if (res.status === 401 && (await tryRefresh())) {
    opts.headers = authHeaders();
    res = await fetch(`${base}${path}`, opts);
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

// ── Profile ────────────────────────────────────────────────
export const getStudentProfile = () => api("/profile", { base: AUTH_URL });

export const updateStudentProfile = (formData) =>
  api("/profile", { method: "PUT", body: formData, base: AUTH_URL });

export const changePassword = (currentPassword, newPassword) =>
  api("/change-password", { method: "POST", body: { currentPassword, newPassword }, base: AUTH_URL });

// ── Dashboard ──────────────────────────────────────────────
export const getDashboard = () => api("/dashboard");

// ── Membership ─────────────────────────────────────────────
export const renewMembership = (planMonths) => api("/membership/renew", { method: "POST", body: { planMonths } });
export const upgradeMembership = (planMonths) => api("/membership/upgrade", { method: "POST", body: { planMonths } });
export const pauseMembership = (days) => api("/membership/pause", { method: "POST", body: { days } });
export const resumeMembership = () => api("/membership/resume", { method: "POST" });

// ── Classes / Workshops ────────────────────────────────────
export const enrollClass = (id) => api(`/classes/${id}/enroll`, { method: "POST" });
export const getWorkshopDetail = (id) => api(`/workshops/${id}`);
export const registerWorkshop = (id) => api(`/workshops/${id}/register`, { method: "POST" });

// ── Consultations ──────────────────────────────────────────
export const bookConsultation = (payload) => api("/consultations", { method: "POST", body: payload });
export const rescheduleConsultation = (id, date) => api(`/consultations/${id}/reschedule`, { method: "PATCH", body: { date } });
export const cancelConsultation = (id) => api(`/consultations/${id}/cancel`, { method: "PATCH" });

// ── Downloads / Assets ─────────────────────────────────────
export const getStudentDownloads = () => api("/downloads");
export const trackDownload = (id) => api(`/downloads/${id}/track`, { method: "POST" });
export const downloadAssetUrl = (id) => `${STUDENT_URL}/downloads/${id}/download`;

// ── Notifications ──────────────────────────────────────────
export const getNotifications = () => api("/notifications");
export const markNotificationRead = (id) => api(`/notifications/${id}/read`, { method: "PATCH" });
export const markAllNotificationsRead = () => api("/notifications/read-all", { method: "PATCH" });
export const deleteNotification = (id) => api(`/notifications/${id}`, { method: "DELETE" });

// ── Referral ───────────────────────────────────────────────
export const getReferral = () => api("/referral");
export const inviteReferral = (name, email) => api("/referral/invite", { method: "POST", body: { name, email } });
