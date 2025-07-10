const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
