import express from 'express';
import Batch from '../models/Batch.js';

const router = express.Router();

// GET /api/batches — fetch all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.status(200).json(batches);
  } catch (err) {
    console.error("Fetch batches error:", err);
    res.status(500).json({ message: "Failed to fetch batches" });
  }
});

// POST /api/batches — create new batch
router.post('/', async (req, res) => {
  try {
    const { name, timing, trainer, zoomLink } = req.body;
    if (!name || !timing || !trainer) {
      return res.status(400).json({ message: "Name, timing and trainer are required" });
    }
    const batch = new Batch({ name, timing, trainer, zoomLink: zoomLink || '' });
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    console.error("Create batch error:", err);
    res.status(500).json({ message: "Failed to create batch" });
  }
});

// DELETE /api/batches/:id — delete a batch
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Batch.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Batch not found" });
    res.status(200).json({ message: "Batch deleted" });
  } catch (err) {
    console.error("Delete batch error:", err);
    res.status(500).json({ message: "Failed to delete batch" });
  }
});

export default router;