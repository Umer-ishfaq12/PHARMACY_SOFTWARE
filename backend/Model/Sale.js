// const mongoose = require('mongoose');

// const saleItemSchema = new mongoose.Schema({
//   medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
//   medicineName: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   pricePerUnit: { type: Number, required: true },
//   total: { type: Number, required: true }
// });

// const saleSchema = new mongoose.Schema({
//   items: [saleItemSchema],
//   totalAmount: { type: Number, required: true },
//   customerName: { type: String, default: 'Walk-in Customer' },
//   soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// module.exports = mongoose.model('Sale', saleSchema);

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

const saleItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  medicineName: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  tpPricePerUnit: { type: Number, required: true },
  total: { type: Number, required: true },
  profit: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  items: [saleItemSchema],
  subtotal: { type: Number, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'credit', 'online'], default: 'cash' },
  customerName: { type: String, default: 'Walk-in Customer' },
  customerPhone: { type: String, default: '' },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['completed', 'returned'], default: 'completed' },
  returnReason: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate invoice number before saving
saleSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'invoiceNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.invoiceNumber = `INV-${String(counter.seq).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema);