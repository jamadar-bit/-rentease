const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  tenureMonths: {
    type: Number,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['Scheduled', 'Dispatched', 'Delivered', 'Returned'],
    default: 'Scheduled'
  },
  pickupDate: {
    type: Date
  },
  disputeStatus: {
    type: String,
    enum: ['None', 'Pending', 'Resolved'],
    default: 'None'
  },
  disputeDescription: {
    type: String,
    default: ''
  },
  damageClaim: {
    type: Number,
    default: 0
  },
  damageDescription: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
