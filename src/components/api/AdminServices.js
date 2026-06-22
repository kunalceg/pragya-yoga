// ─────────────────────────────────────────────────────────
// AdminServices.js
// Centralised API layer for the admin dashboard. Sends the JWT
// access token, transparently refreshes it on a 401, and returns
// parsed JSON (throwing a clean Error on failure).
// ─────────────────────────────────────────────────────────

const API_DOMAIN = import.meta.env.VITE_API_URL || "https://pragya-yoga.onrender.com";
const ADMIN_URL = `${API_DOMAIN}/api/admin`;
const ROOT_URL = `${API_DOMAIN}/api`;

function authHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function tryRefresh() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${ROOT_URL}/auth/refresh`, {
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
    /* ignore */
  }
  return false;
}

async function request(path, { method = "GET", body, base = ADMIN_URL } = {}) {
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

// ── Overview & analytics ───────────────────────────────────
export const getOverview = () => request("/overview");
export const getRevenueAnalytics = () => request("/analytics/revenue");
export const getLogs = () => request("/logs");
export const getSettings = () => request("/settings");
export const updateSettings = (payload) => request("/settings", { method: "PUT", body: payload });

// ── Students ───────────────────────────────────────────────
export const getStudents = (search = "") => request(`/students${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const getStudentDetail = (id) => request(`/students/${id}`);
export const createStudent = (payload) => request("/students", { method: "POST", body: payload });
export const updateStudent = (id, payload) => request(`/students/${id}`, { method: "PUT", body: payload });
export const deleteStudent = (id) => request(`/students/${id}`, { method: "DELETE" });
export const setStudentStatus = (id, status) => request(`/students/${id}/status`, { method: "PATCH", body: { status } });

// ── Plans assignment ───────────────────────────────────────
export const assignPlan = (payload) => request("/plans/assign", { method: "POST", body: payload });
export const revokePlan = (id) => request(`/plans/revoke/${id}`, { method: "PUT" });

// ── Membership renew & upgrade (admin) ─────────────────────
export const getAllPlans = () => request("/membership-plans");
export const renewMembershipAdmin = (payload) => request("/memberships/renew", { method: "POST", body: payload });
export const upgradeMembershipAdmin = (payload) => request("/memberships/upgrade", { method: "POST", body: payload });

// ── Payments ───────────────────────────────────────────────
export const getPayments = () => request("/payments");
export const createPayment = (payload) => request("/payments", { method: "POST", body: payload });
export const updatePaymentStatus = (id, status) => request(`/payments/${id}/status`, { method: "PATCH", body: { status } });

// ── Attendance ─────────────────────────────────────────────
export const markAttendance = (payload) => request("/attendance", { method: "POST", body: payload });
export const getStudentAttendance = (id) => request(`/attendance/${id}`);

// ── Generic resource helpers (classes, workshops, downloads, courses, plans, coupons) ──
const resource = (name) => ({
  list: () => request(`/${name}`),
  create: (payload) => request(`/${name}`, { method: "POST", body: payload }),
  update: (id, payload) => request(`/${name}/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/${name}/${id}`, { method: "DELETE" }),
});

export const classesApi = resource("classes");

// ── Workshops (custom admin endpoints) ─────────────────────────
export const workshopsApi = {
  list: () => request("/workshops"),
  create: (payload) => request("/workshops", { method: "POST", body: payload }),
  update: (id, payload) => request(`/workshops/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/workshops/${id}`, { method: "DELETE" }),
  togglePublish: (id) => request(`/workshops/${id}/publish`, { method: "PATCH" }),
  toggleArchive: (id) => request(`/workshops/${id}/archive`, { method: "PATCH" }),
  getStats: (id) => request(`/workshops/${id}/stats`),
  getRegistrations: (id) => request(`/workshops/${id}/registrations`),
  markAttendance: (id, registrationId, attended) =>
    request(`/workshops/${id}/attendance`, { method: "PATCH", body: { registrationId, attended } }),
};

export const coursesApi = resource("courses");
export const membershipPlansApi = resource("membership-plans");
export const couponsApi = resource("coupons");

// ── Assets / Content Management ────────────────────────────
function authHeadersMultiPart() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

async function requestMultiPart(path, { method = "POST", body } = {}) {
  const opts = { method, headers: authHeadersMultiPart() };
  if (body) opts.body = body;
  let res = await fetch(`${ADMIN_URL}${path}`, opts);
  if (res.status === 401 && (await tryRefresh())) {
    opts.headers = authHeadersMultiPart();
    res = await fetch(`${ADMIN_URL}${path}`, opts);
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export const assetsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.type) q.set("type", params.type);
    if (params.visibility) q.set("visibility", params.visibility);
    if (params.active !== undefined) q.set("active", params.active);
    if (params.page) q.set("page", params.page);
    if (params.limit) q.set("limit", params.limit);
    const qs = q.toString();
    return request(`/downloads${qs ? `?${qs}` : ""}`);
  },
  get: (id) => request(`/downloads/${id}`),
  upload: (formData) => requestMultiPart("/downloads/upload", { method: "POST", body: formData }),
  update: (id, payload) => request(`/downloads/${id}`, { method: "PUT", body: payload }),
  replaceFile: (id, formData) => requestMultiPart(`/downloads/${id}/replace`, { method: "POST", body: formData }),
  archive: (id, active) => request(`/downloads/${id}/archive`, { method: "PATCH", body: { active } }),
  remove: (id) => request(`/downloads/${id}`, { method: "DELETE" }),
  stats: () => request("/downloads/stats"),
  downloadUrl: (id) => `${ADMIN_URL}/downloads/${id}/download`,
};

// ── Consultations ──────────────────────────────────────────
export const getConsultations = () => request("/consultations");
export const updateConsultation = (id, payload) => request(`/consultations/${id}`, { method: "PUT", body: payload });

// ── Notifications ──────────────────────────────────────────
export const listNotifications = () => request("/notifications");
export const broadcastNotification = (payload) => request("/notifications/broadcast", { method: "POST", body: payload });

// ── Cross-cutting collections served from non-admin routers ──
// Batches
export const getBatches = () => request("/batches", { base: ROOT_URL });
export const createBatch = (payload) => request("/batches", { method: "POST", body: payload, base: ROOT_URL });
export const updateBatch = (id, payload) => request(`/batches/${id}`, { method: "PUT", body: payload, base: ROOT_URL });
export const deleteBatch = (id) => request(`/batches/${id}`, { method: "DELETE", base: ROOT_URL });

// Bookings
export const getBookings = () => request("/bookings", { base: ROOT_URL });
export const updateBookingStatus = (id, status) => request(`/bookings/${id}/status`, { method: "PATCH", body: { status }, base: ROOT_URL });
export const deleteBooking = (id) => request(`/bookings/${id}`, { method: "DELETE", base: ROOT_URL });

// Leads
export const getLeads = () => request("/leads", { base: ROOT_URL });
export const createLead = (payload) => request("/leads", { method: "POST", body: payload, base: ROOT_URL });
export const updateLeadStage = (id, stage) => request(`/leads/${id}/stage`, { method: "PATCH", body: { stage }, base: ROOT_URL });
export const deleteLead = (id) => request(`/leads/${id}`, { method: "DELETE", base: ROOT_URL });
