const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Rental'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  resolutionNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
