import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

// GET /api/leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, interestType, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const lead = new Lead({ name, phone, email, interestType, notes, stage: 'New' });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create lead' });
  }
});

// PATCH /api/leads/:id/stage — move lead to different stage
router.patch('/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { stage },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update stage' });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete lead' });
  }
});

export default router;
