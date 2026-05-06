                                                                

const express = require('express');
const Medicine = require('../Model/Medicine');
const { protect } = require('../Middlleware/auth');
const router = express.Router();

// Get all medicines
router.get('/', protect, async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add medicine
router.post('/', protect, async (req, res) => {
  try {
    const medicine = await Medicine.create({ ...req.body, addedBy: req.user.id });
    res.status(201).json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update medicine
router.put('/:id', protect, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete medicine
router.delete('/:id', protect, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const total = await Medicine.countDocuments();
    const lowStock = await Medicine.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } });
    const expiringSoon = await Medicine.find({ expiryDate: { $gte: today, $lte: thirtyDaysLater } });
    const expired = await Medicine.find({ expiryDate: { $lt: today } });

    // Profit margins
    const allMeds = await Medicine.find();
    const profitMargins = allMeds.map(m => ({
      name: m.name,
      profitPerUnit: m.profitPerUnit,
      profitMargin: m.profitMargin
    }));

    res.json({ total, lowStock, expiringSoon, expired, profitMargins });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;