const express = require('express');
const { createRecommendation, getRecommendations } = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createRecommendation);
router.get('/', authMiddleware, getRecommendations);

module.exports = router;
