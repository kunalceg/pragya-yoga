const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const { authMiddleware } = require('./auth'); // ✅ FIXED: Re-routed directly into your auth router file

// Dynamic sub-middleware helper to ensure the user is an admin
const verifyAdminRole = async (req, res, next) => {
  try {
    // req.user was securely injected by authMiddleware above
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Administrative clearance required." });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal validation failure." });
  }
};

// ==========================================
// 🚀 ADMINISTRATIVE API ENDPOINTS
// ==========================================

// GET all students from MongoDB for the admin dashboard
router.get('/students', authMiddleware, verifyAdminRole, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error pulling database records' });
  }
});

// PATCH update student status (Approve / Ban)
router.patch('/students/:id', authMiddleware, verifyAdminRole, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

module.exports = router;