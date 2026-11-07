const Visitor = require('../models/Visitor');
const Student = require('../models/Student');

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private (Admin / Warden)
exports.getVisitors = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { visitorName: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const visitors = await Visitor.find(query)
      .populate('student', 'name email room studentId')
      .sort({ checkInTime: -1 });

    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record new visitor entry
// @route   POST /api/visitors
// @access  Private (Admin / Warden)
exports.createVisitor = async (req, res) => {
  try {
    const { visitorName, relation, phone, studentId, studentName, roomNumber, purpose, idProof, remarks } = req.body;

    let resolvedStudentName = studentName;
    let resolvedRoomNumber = roomNumber;

    if (studentId) {
      const student = await Student.findById(studentId).populate('room');
      if (student) {
        resolvedStudentName = student.name;
        if (student.room) resolvedRoomNumber = student.room.roomNumber;
      }
    }

    const visitor = await Visitor.create({
      visitorName,
      relation: relation || 'Parent / Relative',
      phone,
      student: studentId || null,
      studentName: resolvedStudentName || 'Hostel Student',
      roomNumber: resolvedRoomNumber || 'N/A',
      purpose: purpose || 'Personal Visit',
      idProof: idProof || 'Aadhaar / ID Card',
      checkInTime: new Date(),
      status: 'In Premises',
      remarks: remarks || '',
    });

    res.status(201).json({ success: true, data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check out visitor
// @route   PUT /api/visitors/:id/checkout
// @access  Private (Admin / Warden)
exports.checkoutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor entry not found' });
    }

    visitor.status = 'Checked Out';
    visitor.checkOutTime = new Date();
    await visitor.save();

    res.status(200).json({ success: true, message: 'Visitor marked as checked out', data: visitor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete visitor entry
// @route   DELETE /api/visitors/:id
// @access  Private (Admin)
exports.deleteVisitor = async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Visitor record removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

