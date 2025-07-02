const express = require('express');
const { createRecommendation, getRecommendations } = require('../controllers/recommendationController');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.post('/', auth, createRecommendation);
router.get('/', auth, getRecommendations);

module.exports = router;
