const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Furniture', 'Appliances'],
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true,
  },
  securityDeposit: {
    type: Number,
    required: true,
  },
  tenureOptions: {
    type: [Number], // e.g., [3, 6, 12] months
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 1
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
