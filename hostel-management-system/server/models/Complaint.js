const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide complaint title'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['AC Repair', 'Plumbing Issue', 'WiFi Problem', 'Electrical', 'Carpentry', 'Cleanliness', 'Mess / Food', 'Other'],
      default: 'Plumbing Issue',
    },
    location: {
      type: String,
      default: 'Building A',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    studentName: {
      type: String,
      default: 'Hostel Resident',
    },
    description: {
      type: String,
      required: [true, 'Please describe the issue'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    assignedTo: {
      type: String,
      default: 'Maintenance Team',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);

