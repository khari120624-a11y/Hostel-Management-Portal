const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('admin', 'warden'), createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, authorize('admin', 'warden'), updateStudent)
  .delete(protect, authorize('admin'), deleteStudent);

module.exports = router;

