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
      // Use Auth0's subject identifier instead of userId
      const userId = req.auth.sub;
      const user = await User.findOne({ auth0Id: userId }).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.updateUserProfile = async (req, res) => {
    try {
      // Use Auth0's subject identifier instead of userId
      const userId = req.auth.sub;
      const { skills, experience, portfolio } = req.body;
      
      const user = await User.findOneAndUpdate(
        { auth0Id: userId },
        { 'profile.skills': skills, 'profile.experience': experience, 'profile.portfolio': portfolio },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
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

// Get a single user by ID
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Make sure users can only update their own profile unless they're an admin
    const authUserId = req.auth.sub;
    
    // Find the current user to check their role
    const currentUser = await User.findOne({ auth0Id: authUserId });
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    
    // Only allow users to update their own profile or admins to update any profile
    if (authUserId !== userId && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }
    
    const updates = req.body;
    const user = await User.findByIdAndUpdate(userId, updates, { 
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Make sure users can only delete their own account unless they're an admin
    const authUserId = req.auth.sub;
    
    // Find the current user to check their role
    const currentUser = await User.findOne({ auth0Id: authUserId });
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    
    // Only allow users to delete their own account or admins to delete any account
    if (authUserId !== userId && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};