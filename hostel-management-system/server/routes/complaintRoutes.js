const express = require('express');
const router = express.Router();
const {
  getComplaints,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getComplaints)
  .post(protect, createComplaint);

router.route('/:id')
  .put(protect, authorize('admin', 'warden'), updateComplaintStatus)
  .delete(protect, authorize('admin'), deleteComplaint);

module.exports = router;

