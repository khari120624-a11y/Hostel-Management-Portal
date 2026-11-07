const express = require('express');
const router = express.Router();
const { getWeeklyMenu, getTodayMenu, updateMenuDay } = require('../controllers/messController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getWeeklyMenu);
router.get('/today', getTodayMenu);
router.put('/:day', protect, authorize('admin', 'warden'), updateMenuDay);

module.exports = router;

