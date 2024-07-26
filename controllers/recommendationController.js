const Recommendation = require('../models/Recommandation');

exports.createRecommendation = async (req, res) => {
  try {
    const { toUser, message } = req.body;
    const recommendation = new Recommendation({ fromUser: req.userId, toUser, message });
    await recommendation.save();
    res.status(201).json(recommendation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ toUser: req.userId });
    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
