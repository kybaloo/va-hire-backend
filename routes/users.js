const express = require('express');
const { getUserProfile, updateUserProfile, createUser, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/users', createUser);
router.get('/users', getAllUsers)

module.exports = router;
