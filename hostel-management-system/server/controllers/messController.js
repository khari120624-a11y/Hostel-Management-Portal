const Mess = require('../models/Mess');

const defaultWeeklyMenu = [
  {
    day: 'Monday',
    breakfast: {
      items: ['Idli & Sambar', 'Coconut Chutney', 'Tea & Filter Coffee'],
      timing: '07:30 AM - 09:30 AM',
    },
    lunch: {
      items: ['Steamed Basmati Rice', 'Dal Tadka', 'Aloo Gobi Matar', 'Fresh Curd', 'Roti', 'Salad'],
      timing: '12:30 PM - 02:30 PM',
    },
    snacks: {
      items: ['Crispy Onion Pakoda', 'Masala Chai / Coffee'],
      timing: '05:00 PM - 06:00 PM',
    },
    dinner: {
      items: ['Butter Tawa Roti', 'Paneer Butter Masala', 'Jeera Pulao', 'Kheer / Sweet'],
      timing: '07:30 PM - 09:30 PM',
    },
    specialNote: 'Chef Special Paneer Dinner. Fruit bowl available upon request.',
  },
  {
    day: 'Tuesday',
    breakfast: {
      items: ['Crispy Masala Dosa', 'Sambar', 'Tomato Chutney', 'Tea / Coffee'],
      timing: '07:30 AM - 09:30 AM',
    },
    lunch: {
      items: ['Rice', 'Kadhi Pakora', 'Bhindi Masala', 'Boondi Raita', 'Chapatis'],
      timing: '12:30 PM - 02:30 PM',
    },
    snacks: {
      items: ['Veg Cutlets', 'Mint Chutney', 'Hot Tea'],
      timing: '05:00 PM - 06:00 PM',
    },
    dinner: {
      items: ['Egg Curry / Shahi Soya Chaap', 'Tawa Roti', 'Steamed Rice', 'Ice Cream'],
      timing: '07:30 PM - 09:30 PM',
    },
    specialNote: 'Special North Indian Style Kadhi for Lunch.',
  },
  {
    day: 'Wednesday',
    breakfast: {
      items: ['Indori Poha with Sev', 'Boiled Eggs / Sprouts', 'Jalebi', 'Tea / Coffee'],
      timing: '07:30 AM - 09:30 AM',
    },
    lunch: {
      items: ['Rajma Masala', 'Fragrant Steamed Rice', 'Aloo Jeera', 'Curd', 'Phulkas'],
      timing: '12:30 PM - 02:30 PM',
    },
    snacks: {
      items: ['Aloo Samosa', 'Sweet Tamarind Chutney', 'Tea'],
      timing: '05:00 PM - 06:00 PM',
    },
    dinner: {
      items: ['Chicken Biryani / Veg Hyderabadi Dum Biryani', 'Mirchi Ka Salan', 'Raita', 'Gulab Jamun'],
      timing: '07:30 PM - 09:30 PM',
    },
    specialNote: 'Wednesday Mid-Week Biryani Night feast!',
  },
  {
    day: 'Thursday',
    breakfast: {
      items: ['Medu Vada & Pongal', 'Coconut Chutney', 'Sambar', 'Coffee / Tea'],
      timing: '07:30 AM - 09:30 AM',
    },
    lunch: {
      items: ['Chole Masala', 'Bhature / Phulka', 'Pulao Rice', 'Cucumber Raita', 'Pickle'],
      timing: '12:30 PM - 02:30 PM',
    },
    snacks: {
      items: ['Bhel Puri / Sev Puri', 'Nimbu Paani / Tea'],
      timing: '05:00 PM - 06:00 PM',
    },
    dinner: {
      items: ['Mix Veg Handi', 'Dal Fry', 'Chapati', 'Steamed Rice', 'Moong Dal Halwa'],
      timing: '07:30 PM - 09:30 PM',
    },
    specialNote: 'Pure vegetarian menu with homemade Moong Dal Halwa.',
  },
  {
    day: 'Friday',
    breakfast: {
      items: ['Aloo Paratha with Butter', 'Plain Curd', 'Mango Pickle', 'Tea / Coffee'],
      timing: '07:30 AM - 09:30 AM',
    },
    lunch: {
      items: ['Lemon Rice / Curd Rice', 'Sambar', 'Beans Poriyal', 'Papad', 'Fried Chilli'],
      timing: '12:30 PM - 02:30 PM',
    },
    snacks: {
      items: ['Bread Pakora', 'Green Chutney', 'Ginger Tea'],
      timing: '05:00 PM - 06:00 PM',
    },
    dinner: {
      items: ['Dal Makhani', 'Kadai Paneer', 'Garlic Naan / Roti', 'Jeera Rice', 'Rasgulla'],
      timing: '07:30 PM - 09:30 PM',
    },
    specialNote: 'Dhaba style Dal Makhani slow cooked for 12 hours.',
  },
  {
    day: 'Saturday',
    breakfast: {
      items: ['Puri Bhaji (Aloo Curry)', 'Halwa', 'Fresh Milk / Coffee / Tea'],
      timing: '07:30 AM - 09:30 AM',
    },
    lunch: {
      items: ['Veg Fried Rice', 'Chilli Paneer / Manchurian', 'Hot Garlic Soup', 'Spring Rolls'],
      timing: '12:30 PM - 02:30 PM',
    },
    snacks: {
      items: ['Biscuits & Cookies', 'Masala Tea / Coffee'],
      timing: '05:00 PM - 06:00 PM',
    },
    dinner: {
      items: ['Pav Bhaji with Extra Butter', 'Pulao', 'Salad', 'Chocolate Brownie'],
      timing: '07:30 PM - 09:30 PM',
    },
    specialNote: 'Weekend Special Indo-Chinese Lunch & Pav Bhaji Dinner.',
  },
  {
    day: 'Sunday',
    breakfast: {
      items: ['Uttapam with Assorted Toppings', 'Sambar', 'Chutney', 'Filter Coffee'],
      timing: '08:00 AM - 10:00 AM',
    },
    lunch: {
      items: ['Special Sunday Thali', 'Paneer Tikka', 'Dal Tadka', 'Pulao', 'Gulab Jamun', 'Papad'],
      timing: '12:30 PM - 02:30 PM',
    },
    snacks: {
      items: ['Veg Puff / Patties', 'Coffee / Cold Drink'],
      timing: '05:00 PM - 06:00 PM',
    },
    dinner: {
      items: ['Light Khichdi / Roti', 'Aloo Baingan Masala', 'Curd', 'Seasonal Fresh Fruit'],
      timing: '07:30 PM - 09:30 PM',
    },
    specialNote: 'Relaxed Sunday breakfast timings. Light dinner before Monday morning classes.',
  },
];

// @desc    Get all 7 days mess menu
// @route   GET /api/mess
// @access  Public or Protected
exports.getWeeklyMenu = async (req, res) => {
  try {
    let menu = await Mess.find().sort({ createdAt: 1 });

    if (!menu || menu.length === 0) {
      await Mess.insertMany(defaultWeeklyMenu);
      menu = await Mess.find().sort({ createdAt: 1 });
    }

    res.status(200).json({ success: true, count: menu.length, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's mess menu
// @route   GET /api/mess/today
// @access  Public or Protected
exports.getTodayMenu = async (req, res) => {
  try {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];

    let todayMenu = await Mess.findOne({ day: currentDay });

    if (!todayMenu) {
      // Seed default if empty
      await Mess.deleteMany({});
      await Mess.insertMany(defaultWeeklyMenu);
      todayMenu = await Mess.findOne({ day: currentDay });
    }

    res.status(200).json({ success: true, day: currentDay, data: todayMenu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update day's mess menu
// @route   PUT /api/mess/:day
// @access  Private (Admin / Warden)
exports.updateMenuDay = async (req, res) => {
  try {
    const { day } = req.params;
    const { breakfast, lunch, snacks, dinner, specialNote } = req.body;

    let menu = await Mess.findOneAndUpdate(
      { day: new RegExp(`^${day}$`, 'i') },
      { breakfast, lunch, snacks, dinner, specialNote },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

