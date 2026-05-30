// ============================================================
// routes/adminRoutes.js
// All routes protected by JWT + admin role check
// Mounted in server.js as: app.use("/api/admin", adminRoutes)
// ============================================================

const express   = require("express");
const router    = express.Router();
const jwt       = require("jsonwebtoken");
const User      = require("../models/User");
const adminCtrl = require("../controllers/adminController");

// ── Auth middleware (verifies JWT token) ──
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
}

// ── Admin role middleware (verifies user.role === "admin") ──
async function adminMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Role verification failed" });
  }
}

// Apply both middlewares to ALL routes below
router.use(authMiddleware, adminMiddleware);

// ── Overview ──────────────────────────────────────────────
router.get("/overview", adminCtrl.getOverview);

// ── Students ──────────────────────────────────────────────
router.get("/students",              adminCtrl.getAllStudents);
router.get("/students/:id",          adminCtrl.getStudentById);
router.post("/students",             adminCtrl.addStudent);
router.put("/students/:id",          adminCtrl.editStudent);
router.delete("/students/:id",       adminCtrl.deleteStudent);
router.put("/students/:id/approve",  adminCtrl.approveStudent);
router.put("/students/:id/ban",      adminCtrl.banStudent);
router.put("/students/:id/unban",    adminCtrl.unbanStudent);

// ── Plans ─────────────────────────────────────────────────
router.post("/plans/assign",         adminCtrl.assignPlan);
router.put("/plans/revoke/:id",      adminCtrl.revokePlan);

// ── Payments ──────────────────────────────────────────────
router.get("/payments",              adminCtrl.getAllPayments);

// ── Attendance ────────────────────────────────────────────
router.put("/attendance/:id",        adminCtrl.updateAttendance);

// ── Activity Logs ─────────────────────────────────────────
router.get("/logs",                  adminCtrl.getActivityLogs);

module.exports = router;