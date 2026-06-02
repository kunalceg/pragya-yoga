const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 🎯 Fixed: Standardized uppercase 'U' matching your other files
const authRoutes = require('./auth'); // 🎯 Fixed: Pulls directly from your updated auth router object

const authMiddleware = authRoutes.authMiddleware;

// Dynamic sub-middleware helper to ensure the user is an admin
const verifyAdminRole = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication data missing." });
    }

    // 🏎️ Performance: Only select the role field to optimize DB query
    const user = await User.findById(req.user.id).select('role');
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Administrative clearance required." });
    }
    next();
  } catch (err) {
    console.error("Admin validation error:", err);
    res.status(500).json({ error: "Internal validation failure." });
  }
};

// ==========================================
// 🚀 ADMINISTRATIVE API ENDPOINTS
// ==========================================

// GET all students from MongoDB for the admin dashboard
router.get('/students', authMiddleware, verifyAdminRole, async (req, res) => {
  try {
    // 🔒 Security: Added .select('-password') so password hashes are never sent to the UI
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("Get admin students error:", err);
    res.status(500).json({ message: 'Server error pulling database records' });
  }
});

// PATCH update student status (Approve / Ban)
router.patch('/students/:id', authMiddleware, verifyAdminRole, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate that the incoming status payload is correct
    if (!['active', 'banned', 'pending'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value provided" });
    }

    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: { status } }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });

    res.json(updatedStudent);
  } catch (err) {
    console.error("Patch student status error:", err);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

module.exports = router;