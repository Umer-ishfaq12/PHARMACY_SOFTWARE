const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// const authRoutes = require('./routes/auth');
const authRoutes = require('./Routes/authRoutes');
// const medicineRoutes = require('./routes/medicines');
const medicineRoutes = require('./Routes/MedicineRoutes');
// const saleRoutes = require('./routes/sales');
const saleRoutes = require('./Routes/salesRutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/sales', saleRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));