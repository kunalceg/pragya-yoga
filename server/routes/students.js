import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/students — fetch all students
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error("Fetch students error:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// DELETE /api/students/:id — remove a student
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

// PUT /api/students/profile/:id — update student profile
router.put('/profile/:id', async (req, res) => {
  try {
    const updateData = req.body;
    if (updateData.role) delete updateData.role;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ message: "Failed to update student" });
  }
});

export default router;