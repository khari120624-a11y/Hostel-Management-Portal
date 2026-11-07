const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('admin', 'warden'), getAllUsers);

module.exports = router;

