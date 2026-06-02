// ============================================================
// controller/adminController.js
// All admin feature handlers — wired to User model + ActivityLog
// ============================================================

const User        = require("../models/User");
const ActivityLog = require("../models/ActivityLog.model");
const bcrypt      = require("bcryptjs"); // 🚀 Performance: Moved to top

// ── Helper: log every admin action to MongoDB ──
async function logAction(action, performedBy, targetUser = null) {
  try {
    await ActivityLog.create({ action, performedBy, targetUser });
  } catch (err) {
    console.error("ActivityLog write failed:", err.message);
  }
}

// ============================================================
// 📊 OVERVIEW — dashboard summary stats
// ============================================================
exports.getOverview = async (req, res) => {
  try {
    const totalStudents  = await User.countDocuments({ role: "student" });
    const activeStudents = await User.countDocuments({ role: "student", status: "active" });
    const bannedStudents = await User.countDocuments({ role: "student", status: "banned" });
    const recentStudents = await User.find({ role: "student" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt status planMonths");

    res.json({
      totalStudents,
      activeStudents,
      bannedStudents,
      recentStudents,
    });
  } catch (err) {
    console.error("getOverview error:", err);
    res.status(500).json({ error: "Failed to load overview" });
  }
};

// ============================================================
// 👥 STUDENTS — view all
// ============================================================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("getAllStudents error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// ============================================================
// 👤 STUDENTS — get one by ID
// ============================================================
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("getStudentById error:", err);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// ============================================================
// ➕ STUDENTS — add new student (admin creates directly)
// ============================================================
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, phone, city, style, level, planMonths } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    // Ensure we provide a robust fallback if password is empty or falsy
    const rawPassword = (password && password.trim() !== "") ? password : "Yoga@1234";
    const salt   = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(rawPassword, salt);

    const student = await User.create({
      name,
      email,
      password: hashed,
      phone:      phone      ?? "",
      city:       city       ?? "",
      style:      style      ?? "Hatha",
      level:      level      ?? "Beginner",
      planMonths: planMonths ?? 1,
      role:       "student", 
      status:     "active",
    });

    await logAction(`Added student: ${email}`, req.user.id, student._id);

    const { password: _, ...safeStudent } = student.toObject();
    res.status(201).json(safeStudent);
  } catch (err) {
    console.error("addStudent error:", err);
    res.status(500).json({ error: "Failed to add student" });
  }
};

// ============================================================
// ✏️ STUDENTS — edit student details
// ============================================================
exports.editStudent = async (req, res) => {
  try {
    const { email } = req.body;

    // 🔒 Security: Prevent duplicate emails across users
    if (email !== undefined) {
      const emailOwner = await User.findOne({ email });
      if (emailOwner && emailOwner._id.toString() !== req.params.id) {
        return res.status(400).json({ error: "Email is already taken by another account" });
      }
    }

    const allowed = ["name", "email", "phone", "city", "style", "level", "planMonths", "status"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true } // 'new: true' is alias for returnDocument: "after"
    ).select("-password");

    if (!updated) return res.status(404).json({ error: "Student not found" });

    await logAction(`Edited student: ${updated.email}`, req.user.id, updated._id);
    res.json(updated);
  } catch (err) {
    console.error("editStudent error:", err);
    res.status(500).json({ error: "Failed to edit student" });
  }
};

// ============================================================
// 🗑️ STUDENTS — delete student
// ============================================================
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    await logAction(`Deleted student: ${student.email}`, req.user.id);
    res.json({ msg: "Student deleted successfully" });
  } catch (err) {
    console.error("deleteStudent error:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// ============================================================
// ✅ STUDENTS — approve
// ============================================================
exports.approveStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "active" } },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ error: "Student not found" });

    await logAction(`Approved student: ${student.email}`, req.user.id, student._id);
    res.json(student);
  } catch (err) {
    console.error("approveStudent error:", err);
    res.status(500).json({ error: "Failed to approve student" });
  }
};

// ============================================================
// 🚫 STUDENTS — ban
// ============================================================
exports.banStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "banned" } },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ error: "Student not found" });

    await logAction(`Banned student: ${student.email}`, req.user.id, student._id);
    res.json(student);
  } catch (err) {
    console.error("banStudent error:", err);
    res.status(500).json({ error: "Failed to ban student" });
  }
};

// ============================================================
// 🔓 STUDENTS — unban
// ============================================================
exports.unbanStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "active" } },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ error: "Student not found" });

    await logAction(`Unbanned student: ${student.email}`, req.user.id, student._id);
    res.json(student);
  } catch (err) {
    console.error("unbanStudent error:", err);
    res.status(500).json({ error: "Failed to unban student" });
  }
};

// ============================================================
// 📋 PLANS — assign plan to student
// ============================================================
exports.assignPlan = async (req, res) => {
  try {
    const { studentId, planMonths } = req.body;
    if (!studentId || !planMonths) {
      return res.status(400).json({ error: "studentId and planMonths are required" });
    }

    const student = await User.findByIdAndUpdate(
      studentId,
      { $set: { planMonths: Number(planMonths), status: "active" } },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ error: "Student not found" });

    await logAction(
      `Assigned ${planMonths}-month plan to: ${student.email}`,
      req.user.id,
      student._id
    );
    res.json(student);
  } catch (err) {
    console.error("assignPlan error:", err);
    res.status(500).json({ error: "Failed to assign plan" });
  }
};

// ============================================================
// ❌ PLANS — revoke plan
// ============================================================
exports.revokePlan = async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { planMonths: 0 } },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ error: "Student not found" });

    await logAction(`Revoked plan from: ${student.email}`, req.user.id, student._id);
    res.json(student);
  } catch (err) {
    console.error("revokePlan error:", err);
    res.status(500).json({ error: "Failed to revoke plan" });
  }
};

// ============================================================
// 💰 PAYMENTS — get all (from stats embedded in User)
// ============================================================
exports.getAllPayments = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email planMonths createdAt status")
      .sort({ createdAt: -1 });

    const payments = students.map((s) => ({
      studentId:  s._id,
      name:       s.name,
      email:      s.email,
      planMonths: s.planMonths,
      status:     s.status,
      enrolledAt: s.createdAt,
    }));

    res.json(payments);
  } catch (err) {
    console.error("getAllPayments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

// ============================================================
// 📅 ATTENDANCE — update student attendance stats
// ============================================================
exports.updateAttendance = async (req, res) => {
  try {
    const { classes, attendancePct } = req.body;
    const updates = {};
    if (classes       !== undefined) updates["stats.classes"]       = Number(classes);
    if (attendancePct !== undefined) updates["stats.attendancePct"] = Number(attendancePct);

    const student = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ error: "Student not found" });

    await logAction(`Updated attendance for: ${student.email}`, req.user.id, student._id);
    res.json(student);
  } catch (err) {
    console.error("updateAttendance error:", err);
    res.status(500).json({ error: "Failed to update attendance" });
  }
};

// ============================================================
// 📜 ACTIVITY LOGS — get all logs
// ============================================================
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("performedBy", "name email")
      .populate("targetUser",  "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    console.error("getActivityLogs error:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};