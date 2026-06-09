const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, updateUserRole } = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth');
const { registerSchema, loginSchema, validateRequest } = require('../validations/user.validation');

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
