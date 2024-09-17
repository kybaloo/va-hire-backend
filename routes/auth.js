const express = require('express');
const { register, login, socialRegister, completeProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); // You'll need to create this middleware
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/social-register', socialRegister);
router.post('/complete-profile', authMiddleware, completeProfile);

module.exports = router;
