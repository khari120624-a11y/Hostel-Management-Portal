const Complaint = require('../models/Complaint');
const Student = require('../models/Student');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    let query = {};

    // If student, filter to their complaints
    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({ email: req.user.email });
      if (student) {
        query.student = student._id;
      }
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const { title, category, location, roomId, description, priority } = req.body;

    let studentId = null;
    let studentName = req.user ? req.user.name : 'Resident';

    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({ email: req.user.email });
      if (student) {
        studentId = student._id;
        studentName = student.name;
      }
    }

    const complaint = await Complaint.create({
      title,
      category: category || 'Plumbing Issue',
      location: location || 'Building A',
      room: roomId || null,
      student: studentId,
      studentName,
      description,
      priority: priority || 'Medium',
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status & resolution
// @route   PUT /api/complaints/:id
// @access  Private (Admin / Warden)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes, assignedTo } = req.body;

    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (status === 'Resolved' || status === 'Closed') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    res.status(200).json({ success: true, message: 'Complaint updated successfully', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.status(200).json({ success: true, message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

