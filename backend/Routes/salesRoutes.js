const express = require('express');
const Sale = require('../Model/Sale');
const Medicine = require('../Model/Medicine');
const { protect } = require('../Middlleware/auth');
const router = express.Router();

// Get
router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.find().populate('soldBy', 'name').sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create sale
router.post('/', protect, async (req, res) => {
  try {
    const { items, customerName, customerPhone, discountType, discountValue, paymentMethod } = req.body;

    let subtotal = 0;
    let totalProfit = 0;
    const saleItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) return res.status(404).json({ message: `Medicine not found` });
      if (medicine.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
      }

      medicine.quantity -= item.quantity;
      await medicine.save();

      const itemTotal = item.quantity * medicine.price;
      const itemProfit = item.quantity * (medicine.price - medicine.tpPrice);
      subtotal += itemTotal;
      totalProfit += itemProfit;

      saleItems.push({
        medicine: medicine._id,
        medicineName: medicine.name,
        quantity: item.quantity,
        pricePerUnit: medicine.price,
        tpPricePerUnit: medicine.tpPrice,
        total: itemTotal,
        profit: itemProfit
      });
    }

    // Calculate discount
    let discountAmount = 0;
    const dValue = Number(discountValue) || 0;
    if (discountType === 'percentage') {
      discountAmount = parseFloat(((subtotal * dValue) / 100).toFixed(2));
    } else {
      discountAmount = dValue;
    }

    const totalAmount = parseFloat((subtotal - discountAmount).toFixed(2));
    // Adjust profit after discount
    const finalProfit = parseFloat((totalProfit - discountAmount).toFixed(2));

    const sale = new Sale({
      items: saleItems,
      subtotal,
      discountType: discountType || 'percentage',
      discountValue: dValue,
      discountAmount,
      totalAmount,
      totalProfit: finalProfit,
      paymentMethod: paymentMethod || 'cash',
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      soldBy: req.user.id
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return / Refund a sale
router.post('/:id/return', protect, async (req, res) => {
  try {
    const { returnReason } = req.body;
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    if (sale.status === 'returned') return res.status(400).json({ message: 'Already returned' });

    // Restore stock
    for (const item of sale.items) {
      await Medicine.findByIdAndUpdate(item.medicine, {
        $inc: { quantity: item.quantity }
      });
    }

    sale.status = 'returned';
    sale.returnReason = returnReason || '';
    await sale.save();

    res.json({ message: 'Sale returned successfully', sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = await Sale.find({ createdAt: { $gte: today }, status: 'completed' });
    const allSales = await Sale.find({ status: 'completed' });

    const todayRevenue = todaySales.reduce((s, x) => s + x.totalAmount, 0);
    const totalRevenue = allSales.reduce((s, x) => s + x.totalAmount, 0);
    const todayProfit = todaySales.reduce((s, x) => s + x.totalProfit, 0);
    const totalProfit = allSales.reduce((s, x) => s + x.totalProfit, 0);

    res.json({
      todaySalesCount: todaySales.length,
      todayRevenue: parseFloat(todayRevenue.toFixed(2)),
      todayProfit: parseFloat(todayProfit.toFixed(2)),
      totalSalesCount: allSales.length,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Daily report
router.get('/report/daily', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end },
      status: 'completed'
    }).populate('soldBy', 'name');

    const revenue = sales.reduce((s, x) => s + x.totalAmount, 0);
    const profit = sales.reduce((s, x) => s + x.totalProfit, 0);
    const totalItems = sales.reduce((s, x) => s + x.items.reduce((a, i) => a + i.quantity, 0), 0);

    res.json({ date: start, sales, revenue, profit, totalItems, count: sales.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Monthly report
router.get('/report/monthly', protect, async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year) || new Date().getFullYear();
    const m = parseInt(month) || new Date().getMonth() + 1;

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59, 999);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end },
      status: 'completed'
    }).populate('soldBy', 'name');

    // Group by day
    const dailyMap = {};
    sales.forEach(sale => {
      const day = new Date(sale.createdAt).getDate();
      if (!dailyMap[day]) dailyMap[day] = { revenue: 0, profit: 0, count: 0 };
      dailyMap[day].revenue += sale.totalAmount;
      dailyMap[day].profit += sale.totalProfit;
      dailyMap[day].count += 1;
    });

    const revenue = sales.reduce((s, x) => s + x.totalAmount, 0);
    const profit = sales.reduce((s, x) => s + x.totalProfit, 0);

    res.json({ year: y, month: m, revenue, profit, count: sales.length, dailyBreakdown: dailyMap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;