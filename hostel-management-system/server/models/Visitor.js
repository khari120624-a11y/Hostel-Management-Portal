const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: [true, 'Please provide visitor name'],
      trim: true,
    },
    relation: {
      type: String,
      default: 'Parent / Guardian',
    },
    phone: {
      type: String,
      required: [true, 'Please provide visitor phone number'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    studentName: {
      type: String,
      default: '',
    },
    roomNumber: {
      type: String,
      default: '',
    },
    purpose: {
      type: String,
      default: 'Personal Visit / Fee Deposit',
    },
    idProof: {
      type: String,
      default: 'Aadhaar / Gov ID',
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['In Premises', 'Checked Out'],
      default: 'In Premises',
    },
    remarks: {
      type: String,
      default: 'Entry logged at main gate security.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visitor', visitorSchema);

