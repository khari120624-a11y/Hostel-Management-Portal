const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalytics } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/analytics', protect, authorize('admin', 'warden'), getAnalytics);

module.exports = router;

