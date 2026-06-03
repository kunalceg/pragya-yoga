const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 🎯 CRITICAL FIX: Point to your main User model file

// PUT route to update user profile data safely
router.put('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // ── 🛡️ SECURITY TRAPPER NODE ──
    // Prevent standard users from tricking the API into granting them admin permissions!
    // If they try to modify their role through this public route, we strip it out.
    if (updateData.role) {
      delete updateData.role; 
    }

    // Find the document by ID and update their records securely in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true } // returns the newly modified document safely
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Mongoose Update Error:", error);
    res.status(500).json({ message: "Internal server error saving profile" });
  }
});

module.exports = router;