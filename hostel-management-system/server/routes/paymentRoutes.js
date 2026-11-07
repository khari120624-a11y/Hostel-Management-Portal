const express = require('express');
const router = express.Router();
const {
  getPayments,
  getUpcomingDuePayments,
  createPayment,
  recordPaymentReceived,
  updatePayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getPayments);
router.get('/upcoming-due', protect, getUpcomingDuePayments);
router.post('/', protect, authorize('admin', 'warden'), createPayment);
router.put('/:id/pay', protect, recordPaymentReceived);
router.put('/:id', protect, authorize('admin'), updatePayment);

module.exports = router;

