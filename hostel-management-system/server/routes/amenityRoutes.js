const express = require('express');
const router = express.Router();
const { getAmenities, updateAmenity, createAmenity } = require('../controllers/amenityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getAmenities);
router.post('/', protect, authorize('admin'), createAmenity);
router.put('/:id', protect, authorize('admin', 'warden'), updateAmenity);

module.exports = router;

