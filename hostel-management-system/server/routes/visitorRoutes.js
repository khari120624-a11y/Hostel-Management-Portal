const express = require('express');
const router = express.Router();
const {
  getVisitors,
  createVisitor,
  checkoutVisitor,
  deleteVisitor,
} = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, authorize('admin', 'warden'), getVisitors)
  .post(protect, authorize('admin', 'warden'), createVisitor);

router.put('/:id/checkout', protect, authorize('admin', 'warden'), checkoutVisitor);
router.delete('/:id', protect, authorize('admin'), deleteVisitor);

module.exports = router;

