// ============================================================
// routes/adminRoutes.js
// All routes protected by JWT + admin role check
// Mounted in server.js as: app.use("/api/admin", adminRoutes)
// ============================================================

const express     = require("express");
const router      = express.Router();
const User        = require("../models/User");
const adminCtrl   = require("../controllers/adminController");

// ── IMPORT AUTH MIDDLEWARE FROM AUTH.JS ────────────────────
// Adjust the path below depending on your folder layout
const authRoutes = require("./auth"); 
const authMiddleware = authRoutes.authMiddleware;

// ── ADMIN ROLE MIDDLEWARE ──────────────────────────────────
// Optimized to only pull the 'role' field from MongoDB
async function adminMiddleware(req, res, next) {
  try {
    // Ensure req.user exists and has an id from authMiddleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication data missing" });
    }

    const user = await User.findById(req.user.id).select("role");
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    
    next();
  } catch (err) {
    console.error("Admin role verification crash:", err);
    res.status(500).json({ error: "Role verification failed" });
  }
}

// Apply both middlewares globally to ALL admin routes below
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