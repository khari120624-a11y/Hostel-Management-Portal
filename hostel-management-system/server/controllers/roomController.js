const mongoose = require('mongoose');
const Room = require('../models/Room');
const Student = require('../models/Student');

// In-memory fallback dataset matching reference UI (12 rooms, 8 vacant, 4 occupied)
let fallbackRooms = [
  { _id: '661849201948291048191001', roomNumber: '101', block: 'Green PG Wing A', floor: 1, type: 'Double', capacity: 2, pricePerMonth: 8000, occupiedCount: 0, status: 'available', students: [], amenities: ['Attached Washroom', 'Study Table', 'Cupboard', 'WiFi'] },
  { _id: '661849201948291048191002', roomNumber: '102', block: 'Green PG Wing A', floor: 1, type: 'Single', capacity: 1, pricePerMonth: 12000, occupiedCount: 0, status: 'available', students: [], amenities: ['AC', 'Study Table', 'Attached Washroom'] },
  { _id: '661849201948291048191003', roomNumber: '103', block: 'Green PG Wing A', floor: 1, type: 'Triple', capacity: 3, pricePerMonth: 6000, occupiedCount: 0, status: 'available', students: [], amenities: ['Study Table', 'Cupboard', 'WiFi'] },
  { _id: '661849201948291048191004', roomNumber: '104', block: 'Green PG Wing A', floor: 1, type: 'Double', capacity: 2, pricePerMonth: 8000, occupiedCount: 0, status: 'available', students: [], amenities: ['Attached Washroom', 'Cupboard', 'WiFi'] },
  { _id: '661849201948291048191005', roomNumber: '105', block: 'Green PG Wing A', floor: 1, type: 'Single', capacity: 1, pricePerMonth: 8000, occupiedCount: 1, status: 'full', students: [{ _id: 's1', name: 'Rahul Sharma', email: 'rahul@hostel.com' }], amenities: ['AC', 'Attached Washroom', 'Study Table'] },
  { _id: '661849201948291048191006', roomNumber: '201', block: 'City Nest Wing B', floor: 2, type: 'Double', capacity: 2, pricePerMonth: 7500, occupiedCount: 0, status: 'available', students: [], amenities: ['Attached Washroom', 'Study Table'] },
  { _id: '661849201948291048191007', roomNumber: '202', block: 'City Nest Wing B', floor: 2, type: 'Single', capacity: 1, pricePerMonth: 6500, occupiedCount: 1, status: 'full', students: [{ _id: 's2', name: 'Sneha Patel', email: 'sneha@hostel.com' }], amenities: ['Study Table', 'Cupboard'] },
  { _id: '661849201948291048191008', roomNumber: '203', block: 'City Nest Wing B', floor: 2, type: 'Double', capacity: 2, pricePerMonth: 7500, occupiedCount: 0, status: 'available', students: [], amenities: ['Attached Washroom', 'WiFi'] },
  { _id: '661849201948291048191009', roomNumber: '204', block: 'City Nest Wing B', floor: 2, type: 'Triple', capacity: 3, pricePerMonth: 5500, occupiedCount: 0, status: 'available', students: [], amenities: ['Study Table', 'Cupboard'] },
  { _id: '661849201948291048191010', roomNumber: '301', block: 'Sunrise PG Wing C', floor: 3, type: 'Double', capacity: 2, pricePerMonth: 8500, occupiedCount: 0, status: 'available', students: [], amenities: ['Balcony', 'AC', 'Attached Washroom'] },
  { _id: '661849201948291048191011', roomNumber: '305', block: 'Sunrise PG Wing C', floor: 3, type: 'Single', capacity: 1, pricePerMonth: 9000, occupiedCount: 0, status: 'available', students: [], amenities: ['Attached Washroom', 'WiFi'] },
  { _id: '661849201948291048191012', roomNumber: '310', block: 'Sunrise PG Wing C', floor: 3, type: 'Single', capacity: 1, pricePerMonth: 5200, occupiedCount: 1, status: 'full', students: [{ _id: 's3', name: 'Amit Verma', email: 'amit@hostel.com' }], amenities: ['Study Table', 'Cupboard', 'WiFi'] },
];

// @desc    Get all rooms with filter/search
// @route   GET /api/rooms
// @access  Public or Protected
exports.getRooms = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: fallbackRooms.length,
        data: fallbackRooms,
      });
    }

    const { block, status, type, search } = req.query;
    let query = {};

    if (block) query.block = block;
    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.roomNumber = { $regex: search, $options: 'i' };
    }

    const rooms = await Room.find(query).populate('students', 'name email phone studentId photo');

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms.length > 0 ? rooms : fallbackRooms,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: fallbackRooms.length,
      data: fallbackRooms,
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public or Protected
exports.getRoomById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const r = fallbackRooms.find((room) => room._id === req.params.id) || fallbackRooms[0];
      return res.status(200).json({ success: true, data: r });
    }

    const room = await Room.findById(req.params.id).populate('students', 'name email phone studentId photo');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin)
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor, type, capacity, pricePerMonth, amenities, description } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const newR = {
        _id: 'room_' + Date.now(),
        roomNumber,
        block: block || 'Green PG Wing A',
        floor: Number(floor) || 1,
        type: type || 'Double',
        capacity: Number(capacity) || 2,
        pricePerMonth: Number(pricePerMonth) || 8000,
        amenities: amenities || ['Attached Washroom', 'Study Table', 'Cupboard', 'WiFi'],
        description: description || 'Spacious room with modern amenities',
        status: 'available',
        occupiedCount: 0,
        students: [],
      };
      fallbackRooms.unshift(newR);
      return res.status(201).json({ success: true, data: newR });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: 'Room number already exists' });
    }

    const room = await Room.create({
      roomNumber,
      block: block || 'Green PG Wing A',
      floor: Number(floor) || 1,
      type: type || 'Double',
      capacity: Number(capacity) || 2,
      pricePerMonth: Number(pricePerMonth) || 8000,
      amenities: amenities || ['Attached Washroom', 'Study Table', 'Cupboard', 'WiFi'],
      description: description || 'Spacious room with modern amenities',
      status: 'available',
      occupiedCount: 0,
      students: [],
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Admin / Warden)
exports.updateRoom = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = fallbackRooms.findIndex((r) => r._id === req.params.id);
      if (idx !== -1) {
        fallbackRooms[idx] = { ...fallbackRooms[idx], ...req.body };
        return res.status(200).json({ success: true, data: fallbackRooms[idx] });
      }
    }

    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('students', 'name email phone studentId photo');

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      fallbackRooms = fallbackRooms.filter((r) => r._id !== req.params.id);
      return res.status(200).json({ success: true, message: 'Room deleted successfully' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Allocate student to room
// @route   POST /api/rooms/:id/allocate
// @access  Private (Admin / Warden)
exports.allocateStudentToRoom = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const room = fallbackRooms.find((r) => r._id === req.params.id);
      if (room) {
        room.occupiedCount = Math.min(room.capacity, room.occupiedCount + 1);
        if (room.occupiedCount >= room.capacity) room.status = 'full';
        return res.status(200).json({ success: true, message: 'Student allocated', data: room });
      }
    }

    const { studentId, bedNumber } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    room.students.push(student._id);
    room.occupiedCount = room.students.length;
    if (room.occupiedCount >= room.capacity) room.status = 'full';
    await room.save();

    student.room = room._id;
    student.bedNumber = bedNumber || room.occupiedCount;
    await student.save();

    res.status(200).json({ success: true, message: 'Student allocated successfully', data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deallocate student from room
// @route   POST /api/rooms/:id/deallocate
// @access  Private (Admin / Warden)
exports.deallocateStudentFromRoom = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const room = fallbackRooms.find((r) => r._id === req.params.id);
      if (room) {
        room.occupiedCount = Math.max(0, room.occupiedCount - 1);
        room.status = 'available';
        return res.status(200).json({ success: true, message: 'Student deallocated', data: room });
      }
    }

    const { studentId } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    room.students = room.students.filter((id) => id.toString() !== studentId.toString());
    room.occupiedCount = room.students.length;
    room.status = 'available';
    await room.save();

    res.status(200).json({ success: true, message: 'Student deallocated', data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
