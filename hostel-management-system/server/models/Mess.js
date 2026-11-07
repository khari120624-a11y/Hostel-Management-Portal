const mongoose = require('mongoose');

const messSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      unique: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    breakfast: {
      items: {
        type: [String],
        default: ['Idli & Sambar', 'Filter Coffee / Tea', 'Chutney'],
      },
      timing: {
        type: String,
        default: '07:30 AM - 09:30 AM',
      },
    },
    lunch: {
      items: {
        type: [String],
        default: ['Steamed Rice', 'Dal Tadka', 'Seasonal Veg Curry', 'Curd', 'Papad', 'Salad'],
      },
      timing: {
        type: String,
        default: '12:30 PM - 02:30 PM',
      },
    },
    snacks: {
      items: {
        type: [String],
        default: ['Samosa / Poha', 'Tea & Coffee'],
      },
      timing: {
        type: String,
        default: '05:00 PM - 06:00 PM',
      },
    },
    dinner: {
      items: {
        type: [String],
        default: ['Roti / Chapati', 'Paneer Butter Masala', 'Jeera Rice', 'Gulab Jamun'],
      },
      timing: {
        type: String,
        default: '07:30 PM - 09:30 PM',
      },
    },
    specialNote: {
      type: String,
      default: 'Freshly prepared vegetarian menu with special dessert on weekends.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mess', messSchema);

