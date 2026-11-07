const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide amenity name'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['WiFi', 'Water Supply', 'Electricity & Backup', 'Laundry', 'Security & CCTV', 'Gym & Recreation', 'Mess & Dining'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Operational', 'Under Maintenance', 'Limited Service'],
      default: 'Operational',
    },
    inChargeName: {
      type: String,
      default: 'Facility Manager',
    },
    contactPhone: {
      type: String,
      default: '+91 98765 43210',
    },
    location: {
      type: String,
      default: 'All Hostel Wings',
    },
    operatingHours: {
      type: String,
      default: '24/7 Service',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Amenity', amenitySchema);

