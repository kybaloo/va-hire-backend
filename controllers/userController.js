const User = require('../models/User');

exports.getAllUsers = (req, res, next) => {
    User.find().then(
        (users) => {
            res.status(200).json(users);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.updateUserProfile = async (req, res) => {
    try {
      const { skills, experience, portfolio } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { 'profile.skills': skills, 'profile.experience': experience, 'profile.portfolio': portfolio },
        { new: true }
      ).select('-password');
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    const newUser = new User({ firstname, lastname, email, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};