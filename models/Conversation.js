const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [MessageSchema],
  lastMessage: {
    type: Date,
    default: Date.now
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessage: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema); 