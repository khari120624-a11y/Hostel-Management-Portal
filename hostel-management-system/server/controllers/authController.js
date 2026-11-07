const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Demo users fallback
const demoUsers = {
  'admin@hostel.com': {
    id: '661849201948291048192001',
    name: 'Admin Supervisor',
    email: 'admin@hostel.com',
    role: 'admin',
    phone: '+91 98765 00001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  'warden@hostel.com': {
    id: '661849201948291048192002',
    name: 'Ramesh Sharma (Chief Warden)',
    email: 'warden@hostel.com',
    role: 'warden',
    phone: '+91 98765 00002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  'rahul@hostel.com': {
    id: '661849201948291048192003',
    name: 'Rahul Sharma',
    email: 'rahul@hostel.com',
    role: 'student',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const token = generateToken('mock_user_' + Date.now());
      return res.status(201).json({
        success: true,
        token,
        user: { id: 'mock_user_' + Date.now(), name, email, role: role || 'student', phone: phone || '' },
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone: phone || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check demo accounts fallback if Mongo is offline
    if (mongoose.connection.readyState !== 1 && demoUsers[email.toLowerCase()]) {
      const demoUser = demoUsers[email.toLowerCase()];
      const token = generateToken(demoUser.id);
      return res.status(200).json({
        success: true,
        token,
        user: demoUser,
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Check if matches demo user
      if (demoUsers[email.toLowerCase()]) {
        const demoUser = demoUsers[email.toLowerCase()];
        const token = generateToken(demoUser.id);
        return res.status(200).json({ success: true, token, user: demoUser });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    let studentInfo = null;
    if (user.role === 'student') {
      studentInfo = await Student.findOne({ email: user.email }).populate('room');
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        studentId: studentInfo?._id || null,
        room: studentInfo?.room || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        user: demoUsers['admin@hostel.com'],
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(200).json({
        success: true,
        user: demoUsers['admin@hostel.com'],
      });
    }

    let studentInfo = null;
    if (user.role === 'student') {
      studentInfo = await Student.findOne({ email: user.email }).populate('room');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        studentProfile: studentInfo,
      },
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      user: demoUsers['admin@hostel.com'],
    });
  }
};

// @desc    Get all staff / users (for Team page)
// @route   GET /api/auth/users
// @access  Private (Admin / Warden)
exports.getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: Object.values(demoUsers).length,
        data: Object.values(demoUsers),
      });
    }

    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: Object.values(demoUsers).length,
      data: Object.values(demoUsers),
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
