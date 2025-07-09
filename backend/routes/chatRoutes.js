const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const ChatConversation = require('../models/ChatConversation');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all conversations for a user
router.get('/conversations', authMiddleware, async (req, res) => {
  const conversations = await ChatConversation.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(conversations);
});

// Get all messages for a  conversation
router.get('/conversations/:id', authMiddleware, async (req, res) => {
  const messages = await ChatMessage.find({ conversation: req.params.id }).sort({ timestamp: 1 });
  res.json(messages);
});

module.exports = router;
