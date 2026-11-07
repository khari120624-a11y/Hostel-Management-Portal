const Amenity = require('../models/Amenity');

const defaultAmenities = [
  {
    name: 'High-Speed Wi-Fi 6',
    category: 'WiFi',
    description: 'Gigabit fiber optic network covering all hostel rooms, corridors and study halls.',
    status: 'Operational',
    inChargeName: 'Mr. Rajesh Verma (IT Admin)',
    contactPhone: '+91 98765 11001',
    location: 'All Floors & Wings',
    operatingHours: '24/7 Unlimited Access',
  },
  {
    name: '24/7 RO Drinking Water',
    category: 'Water Supply',
    description: 'Commercial 5-stage RO filtration plants installed on every floor with cold & warm dispensers.',
    status: 'Operational',
    inChargeName: 'Mr. Suresh Kumar',
    contactPhone: '+91 98765 11002',
    location: 'Every Floor Lobby',
    operatingHours: '24/7 Running Water',
  },
  {
    name: 'Power Backup & Solar Panels',
    category: 'Electricity & Backup',
    description: '125 kVA Silent Generator backup ensuring 0-second downtime for lights, fans and Wi-Fi.',
    status: 'Operational',
    inChargeName: 'Mr. Anil Sharma (Electrician)',
    contactPhone: '+91 98765 11003',
    location: 'Power Substation & Roof',
    operatingHours: 'Automatic Switchover',
  },
  {
    name: 'Smart Automated Laundry',
    category: 'Laundry',
    description: '6 commercial front-load washing machines and dryers with token-based access.',
    status: 'Operational',
    inChargeName: 'Mrs. Sunita Devi',
    contactPhone: '+91 98765 11004',
    location: 'Ground Floor Utility Wing',
    operatingHours: '06:00 AM - 10:00 PM',
  },
  {
    name: 'Campus CCTV & Security',
    category: 'Security & CCTV',
    description: '64 HD surveillance cameras with 30-day cloud backup and 24-hour manned guard post.',
    status: 'Operational',
    inChargeName: 'Chief Guard Vikram Singh',
    contactPhone: '+91 98765 11005',
    location: 'Gates, Entrances & Perimeter',
    operatingHours: '24/7 Active Surveillance',
  },
  {
    name: 'Fitness Gym & Indoor Sports',
    category: 'Gym & Recreation',
    description: 'Air-conditioned gym with treadmills, weights, plus table tennis and carrom boards.',
    status: 'Under Maintenance',
    inChargeName: 'Mr. Deepak Yadav (Sports In-charge)',
    contactPhone: '+91 98765 11006',
    location: 'Recreation Block B',
    operatingHours: '06:00 AM - 09:00 AM & 05:00 PM - 09:00 PM',
  },
];

// @desc    Get all amenities
// @route   GET /api/amenities
// @access  Public or Protected
exports.getAmenities = async (req, res) => {
  try {
    let amenities = await Amenity.find();
    if (!amenities || amenities.length === 0) {
      await Amenity.insertMany(defaultAmenities);
      amenities = await Amenity.find();
    }
    res.status(200).json({ success: true, count: amenities.length, data: amenities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update amenity status
// @route   PUT /api/amenities/:id
// @access  Private (Admin / Warden)
exports.updateAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!amenity) {
      return res.status(404).json({ success: false, message: 'Amenity not found' });
    }
    res.status(200).json({ success: true, data: amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new amenity
// @route   POST /api/amenities
// @access  Private (Admin)
exports.createAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.create(req.body);
    res.status(201).json({ success: true, data: amenity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

