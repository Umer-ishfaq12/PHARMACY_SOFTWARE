// const mongoose = require('mongoose');

// const medicineSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   batchNumber: { type: String, required: true },
//   price: { type: Number, required: true },        // Sell price
//   tpPrice: { type: Number, required: true },      // Trade price (cost)
//   expiryDate: { type: Date, required: true },
//   buyDate: { type: Date, required: true },
//   quantity: { type: Number, required: true, default: 0 },
//   lowStockThreshold: { type: Number, default: 10 },
//   addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// module.exports = mongoose.model('Medicine', medicineSchema);


const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batchNumber: { type: String, required: true },
  price: { type: Number, required: true },
  tpPrice: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  buyDate: { type: Date, required: true },
  quantity: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },

  // Supplier info
  supplierName: { type: String, default: '' },
  supplierPhone: { type: String, default: '' },
  supplierCompany: { type: String, default: '' },

  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: profit per unit
medicineSchema.virtual('profitPerUnit').get(function () {
  return parseFloat((this.price - this.tpPrice).toFixed(2));
});

// Virtual: profit margin %
medicineSchema.virtual('profitMargin').get(function () {
  if (!this.tpPrice || this.tpPrice === 0) return 0;
  return parseFloat((((this.price - this.tpPrice) / this.tpPrice) * 100).toFixed(2));
});

module.exports = mongoose.model('Medicine', medicineSchema);