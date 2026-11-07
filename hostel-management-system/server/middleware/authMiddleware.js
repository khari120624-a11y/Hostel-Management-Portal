const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const demoUsers = {
  'admin': {
    id: '661849201948291048192001',
    _id: '661849201948291048192001',
    name: 'Admin Supervisor',
    email: 'admin@hostel.com',
    role: 'admin',
    phone: '+91 98765 00001',
  },
  'warden': {
    id: '661849201948291048192002',
    _id: '661849201948291048192002',
    name: 'Ramesh Sharma (Chief Warden)',
    email: 'warden@hostel.com',
    role: 'warden',
    phone: '+91 98765 00002',
  },
  'student': {
    id: '661849201948291048192003',
    _id: '661849201948291048192003',
    name: 'Rahul Sharma',
    email: 'rahul@hostel.com',
    role: 'student',
    phone: '+91 98765 43211',
  },
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_hostel_jwt_key_2026_secure'
      );

      // If Mongo is offline, match demo accounts directly
      if (mongoose.connection.readyState !== 1) {
        if (decoded.id === '661849201948291048192002') {
          req.user = demoUsers.warden;
        } else if (decoded.id === '661849201948291048192003') {
          req.user = demoUsers.student;
        } else {
          req.user = demoUsers.admin;
        }
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback to admin if demo id used
        req.user = demoUsers.admin;
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

module.exports = { protect };
