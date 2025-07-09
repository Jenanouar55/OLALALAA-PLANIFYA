const mongoose = require('mongoose');

const chatConversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Conversation' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatConversation', chatConversationSchema);