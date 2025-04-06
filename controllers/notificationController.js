const Notification = require('../models/Notification');

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.auth.sub;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('recipient', 'firstname lastname profileImage');

    const total = await Notification.countDocuments({ recipient: userId });

    res.status(200).json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get a specific notification
exports.getNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.auth.sub;
    
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId
    }).populate('recipient', 'firstname lastname profileImage');
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Error fetching notification', error: error.message });
  }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.auth.sub;
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds)) {
      return res.status(400).json({ message: 'notificationIds must be an array' });
    }

    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: userId
      },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.auth.sub;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.auth.sub;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
}; 