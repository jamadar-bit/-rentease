const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const ServiceArea = mongoose.model('ServiceArea', serviceAreaSchema);

module.exports = ServiceArea;
