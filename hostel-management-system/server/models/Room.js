const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
      unique: true,
      trim: true,
    },
    block: {
      type: String,
      required: [true, 'Please provide block / wing name'],
      default: 'Building A',
    },
    floor: {
      type: Number,
      required: [true, 'Please provide floor number'],
      default: 1,
    },
    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Four-Bed'],
      default: 'Double',
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide room capacity'],
      min: 1,
      default: 2,
    },
    occupiedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pricePerMonth: {
      type: Number,
      required: [true, 'Please provide monthly fee'],
      default: 8000,
    },
    status: {
      type: String,
      enum: ['available', 'full', 'maintenance'],
      default: 'available',
    },
    amenities: {
      type: [String],
      default: ['Attached Washroom', 'Study Table', 'Cupboard', 'WiFi'],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    description: {
      type: String,
      default: 'Spacious well-ventilated room with modern hostel amenities.',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update status based on occupied count and capacity
roomSchema.pre('save', function (next) {
  if (this.status !== 'maintenance') {
    if (this.occupiedCount >= this.capacity) {
      this.status = 'full';
    } else {
      this.status = 'available';
    }
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);

