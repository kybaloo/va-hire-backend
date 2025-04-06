const User = require('../models/User');
const Project = require('../models/Project');
const Conversation = require('../models/Conversation');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Get all users with filtering and pagination
exports.getUsers = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findOne({ auth0Id: req.auth.sub });
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can access this endpoint' });
    }

    const { 
      page = 1, 
      limit = 20, 
      role, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    if (role) query.role = role;
    
    if (search) {
      query.$or = [
        { firstname: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get all projects with filtering and pagination
exports.getProjects = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findOne({ auth0Id: req.auth.sub });
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can access this endpoint' });
    }

    const { 
      page = 1, 
      limit = 20, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const projects = await Project.find(query)
      .populate('owner', 'firstname lastname email')
      .populate('assignedTo', 'firstname lastname email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Generate system usage and financial reports
exports.getReports = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findOne({ auth0Id: req.auth.sub });
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can access this endpoint' });
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const professionalCount = await User.countDocuments({ role: 'professional' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });
    
    // Project statistics
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'en cours' });
    const completedProjects = await Project.countDocuments({ status: 'terminé' });
    
    // Course statistics
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Course.aggregate([
      { $unwind: '$enrolledStudents' },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    
    // Financial calculations
    const projectRevenue = await Project.aggregate([
      { $match: { status: 'payé' } },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);
    
    const courseRevenue = await Course.aggregate([
      { $unwind: '$enrolledStudents' },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    // System usage
    const messagesCount = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      users: {
        total: totalUsers,
        professionals: professionalCount,
        recruiters: recruiterCount
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects
      },
      courses: {
        total: totalCourses,
        enrollments: totalEnrollments.length > 0 ? totalEnrollments[0].count : 0
      },
      finances: {
        projectRevenue: projectRevenue.length > 0 ? projectRevenue[0].total : 0,
        courseRevenue: courseRevenue.length > 0 ? courseRevenue[0].total : 0,
        totalRevenue: (projectRevenue.length > 0 ? projectRevenue[0].total : 0) + 
                      (courseRevenue.length > 0 ? courseRevenue[0].total : 0)
      },
      activity: {
        totalMessages: messagesCount.length > 0 ? messagesCount[0].count : 0
      },
      systemStats: {
        lastUpdated: new Date(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating reports', error: error.message });
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findOne({ auth0Id: req.auth.sub });
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can ban users' });
    }

    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isBanned = true;
    user.banReason = req.body.reason || 'Violation of terms of service';
    user.bannedAt = new Date();
    user.bannedBy = admin._id;
    
    await user.save();
    
    res.status(200).json({ message: 'User banned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error banning user', error: error.message });
  }
};

// Update user status (active, suspended, deleted)
exports.updateUserStatus = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findOne({ auth0Id: req.auth.sub });
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can update user status' });
    }

    const { userId } = req.params;
    const { status } = req.body;
    
    if (!['active', 'suspended', 'deleted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update status and related fields
    user.status = status;
    
    if (status === 'suspended') {
      user.suspendedAt = new Date();
      user.suspendedBy = admin._id;
      user.suspensionReason = req.body.reason || 'Administrative action';
    } else if (status === 'deleted') {
      user.deletedAt = new Date();
      user.deletedBy = admin._id;
    } else if (status === 'active') {
      user.reactivatedAt = new Date();
      user.reactivatedBy = admin._id;
    }
    
    await user.save();
    
    res.status(200).json({ 
      message: `User status updated to ${status}`,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};

// Unban user
exports.unbanUser = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await User.findOne({ auth0Id: req.auth.sub });
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can unban users' });
    }

    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isBanned = false;
    user.banReason = null;
    user.unbannedAt = new Date();
    
    await user.save();
    
    res.status(200).json({ message: 'User unbanned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unbanning user', error: error.message });
  }
}; 