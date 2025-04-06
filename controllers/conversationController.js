const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Get all conversations for user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.auth.sub;
    
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'firstname lastname profileImage')
      .populate('project', 'title')
      .sort({ lastMessage: -1 });
    
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

// Get a specific conversation with messages
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.auth.sub;
    
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'firstname lastname profileImage')
      .populate('project', 'title')
      .populate('messages.sender', 'firstname lastname profileImage');
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }
    
    // Mark messages as read
    conversation.messages.forEach(message => {
      if (message.sender._id.toString() !== userId && !message.read) {
        message.read = true;
      }
    });
    
    await conversation.save();
    
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
};

// Send a message in a conversation
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.auth.sub;
    
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'firstname lastname');
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.participants.some(p => p._id.toString() === senderId)) {
      return res.status(403).json({ message: 'Not authorized to send a message in this conversation' });
    }
    
    // Add message
    conversation.messages.push({
      sender: senderId,
      content,
      createdAt: new Date()
    });
    
    // Update last message timestamp
    conversation.lastMessage = new Date();
    
    await conversation.save();
    
    // Send notification to other participants
    const otherParticipants = conversation.participants.filter(
      p => p._id.toString() !== senderId
    );
    
    const sender = conversation.participants.find(p => p._id.toString() === senderId);
    
    // Create notifications for all other participants
    const notifications = otherParticipants.map(participant => ({
      recipient: participant._id,
      type: 'message_received',
      title: 'New Message',
      message: `${sender.firstname} ${sender.lastname} sent you a message`,
      data: { conversationId }
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Start a new conversation
exports.startConversation = async (req, res) => {
  try {
    const { recipientId, projectId, initialMessage } = req.body;
    const senderId = req.auth.sub;
    
    // Check if users exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);
    
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Check if conversation already exists between users
    const existingConversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      project: projectId
    });
    
    if (existingConversation) {
      return res.status(400).json({ 
        message: 'Conversation already exists',
        conversationId: existingConversation._id
      });
    }
    
    // Create new conversation
    const conversation = new Conversation({
      participants: [senderId, recipientId],
      project: projectId,
      messages: [{
        sender: senderId,
        content: initialMessage
      }],
      lastMessage: new Date()
    });
    
    await conversation.save();
    
    // Create notification for recipient
    await Notification.create({
      recipient: recipientId,
      type: 'message_received',
      title: 'New Conversation Started',
      message: `${sender.firstname} ${sender.lastname} started a conversation with you`,
      data: { conversationId: conversation._id }
    });
    
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error starting conversation', error: error.message });
  }
};

// Create a new conversation (alias for startConversation for route consistency)
exports.createConversation = exports.startConversation;

// Delete a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.auth.sub;
    
    // Find the conversation
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.participants.some(p => p.toString() === userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this conversation' });
    }
    
    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);
    
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Error deleting conversation', error: error.message });
  }
}; 