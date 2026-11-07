const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  allocateStudentToRoom,
  deallocateStudentFromRoom,
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin'), createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('admin', 'warden'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

router.post('/:id/allocate', protect, authorize('admin', 'warden'), allocateStudentToRoom);
router.post('/:id/deallocate', protect, authorize('admin', 'warden'), deallocateStudentFromRoom);

module.exports = router;

