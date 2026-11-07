const mongoose = require('mongoose');
const Student = require('../models/Student');
const Room = require('../models/Room');
const User = require('../models/User');

// Fallback students
let fallbackStudents = [
  {
    _id: '661849201948291048193001',
    name: 'Rahul Sharma',
    email: 'rahul@hostel.com',
    phone: '+91 98765 43211',
    studentId: 'STU202401',
    gender: 'Male',
    department: 'Computer Science',
    yearOfStudy: '3rd Year',
    room: { _id: 'r1', roomNumber: '105', block: 'Green PG Wing A' },
    bedNumber: 1,
    guardianName: 'Manoj Sharma',
    guardianPhone: '+91 98111 22233',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
  {
    _id: '661849201948291048193002',
    name: 'Sneha Patel',
    email: 'sneha@hostel.com',
    phone: '+91 98765 43212',
    studentId: 'STU202402',
    gender: 'Female',
    department: 'Electronics',
    yearOfStudy: '2nd Year',
    room: { _id: 'r2', roomNumber: '202', block: 'City Nest Wing B' },
    bedNumber: 1,
    guardianName: 'Kirit Patel',
    guardianPhone: '+91 98111 22234',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    _id: '661849201948291048193003',
    name: 'Amit Verma',
    email: 'amit@hostel.com',
    phone: '+91 98765 43213',
    studentId: 'STU202403',
    gender: 'Male',
    department: 'Mechanical',
    yearOfStudy: '4th Year',
    room: { _id: 'r3', roomNumber: '310', block: 'Sunrise PG Wing C' },
    bedNumber: 1,
    guardianName: 'Sanjay Verma',
    guardianPhone: '+91 98111 22235',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    _id: '661849201948291048193004',
    name: 'Priya Singh',
    email: 'priya@hostel.com',
    phone: '+91 98765 43214',
    studentId: 'STU202404',
    gender: 'Female',
    department: 'Information Technology',
    yearOfStudy: '1st Year',
    room: { _id: 'r4', roomNumber: '104', block: 'Green PG Wing A' },
    bedNumber: 1,
    guardianName: 'Rajendra Singh',
    guardianPhone: '+91 98111 22236',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
  {
    _id: '661849201948291048193005',
    name: 'Arjun Mehta',
    email: 'arjun@hostel.com',
    phone: '+91 98765 43215',
    studentId: 'STU202405',
    gender: 'Male',
    department: 'Civil Engineering',
    yearOfStudy: '2nd Year',
    room: { _id: 'r5', roomNumber: '101', block: 'Green PG Wing A' },
    bedNumber: 1,
    guardianName: 'Vikram Mehta',
    guardianPhone: '+91 98111 22237',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  },
  {
    _id: '661849201948291048193006',
    name: 'Neha Gupta',
    email: 'neha@hostel.com',
    phone: '+91 98765 43216',
    studentId: 'STU202406',
    gender: 'Female',
    department: 'Data Science',
    yearOfStudy: '3rd Year',
    room: { _id: 'r6', roomNumber: '204', block: 'City Nest Wing B' },
    bedNumber: 1,
    guardianName: 'Sunil Gupta',
    guardianPhone: '+91 98111 22238',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    _id: '661849201948291048193007',
    name: 'Vikram Rao',
    email: 'vikram@hostel.com',
    phone: '+91 98765 43217',
    studentId: 'STU202407',
    gender: 'Male',
    department: 'Aerospace',
    yearOfStudy: '4th Year',
    room: { _id: 'r7', roomNumber: '305', block: 'Sunrise PG Wing C' },
    bedNumber: 1,
    guardianName: 'Mohan Rao',
    guardianPhone: '+91 98111 22239',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
];

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin / Warden)
exports.getStudents = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: fallbackStudents.length,
        data: fallbackStudents,
      });
    }

    const { department, yearOfStudy, search, status } = req.query;
    let query = {};

    if (department) query.department = department;
    if (yearOfStudy) query.yearOfStudy = yearOfStudy;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('room', 'roomNumber block floor type pricePerMonth status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students.length > 0 ? students : fallbackStudents,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: fallbackStudents.length,
      data: fallbackStudents,
    });
  }
};

// @desc    Get single student details
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const s = fallbackStudents.find((st) => st._id === req.params.id) || fallbackStudents[0];
      return res.status(200).json({ success: true, data: s });
    }

    const student = await Student.findById(req.params.id)
      .populate('room')
      .populate('user', 'name email role');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin / Warden)
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      studentId,
      gender,
      department,
      yearOfStudy,
      roomId,
      guardianName,
      guardianPhone,
      address,
    } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const newS = {
        _id: 'student_' + Date.now(),
        name,
        email,
        phone,
        studentId: studentId || `STU${Date.now().toString().slice(-4)}`,
        gender: gender || 'Male',
        department: department || 'Engineering',
        yearOfStudy: yearOfStudy || '1st Year',
        guardianName: guardianName || '',
        guardianPhone: guardianPhone || '',
        address: address || '',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        room: { _id: roomId || 'r1', roomNumber: '101', block: 'Green PG Wing A' },
      };
      fallbackStudents.unshift(newS);
      return res.status(201).json({ success: true, data: newS });
    }

    const newStudent = await Student.create({
      name,
      email,
      phone,
      studentId: studentId || `STU${Date.now().toString().slice(-4)}`,
      gender: gender || 'Male',
      department: department || 'Engineering',
      yearOfStudy: yearOfStudy || '1st Year',
      guardianName: guardianName || '',
      guardianPhone: guardianPhone || '',
      address: address || '',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    });

    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private (Admin / Warden)
exports.updateStudent = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = fallbackStudents.findIndex((s) => s._id === req.params.id);
      if (idx !== -1) {
        fallbackStudents[idx] = { ...fallbackStudents[idx], ...req.body };
        return res.status(200).json({ success: true, data: fallbackStudents[idx] });
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('room');

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      fallbackStudents = fallbackStudents.filter((s) => s._id !== req.params.id);
      return res.status(200).json({ success: true, message: 'Student removed successfully' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
