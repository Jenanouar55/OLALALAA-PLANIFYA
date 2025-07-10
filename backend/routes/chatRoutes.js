const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllConversations,
  getMessagesForConversation,
  renameConversation,
  deleteConversation,
} = require("../controllers/aiController");

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// --- Conversation Routes ---

// Get all conversations for a user
router.get("/conversations", getAllConversations);

// Get all messages for a specific conversation
router.get("/conversations/:id", getMessagesForConversation);

// Rename a conversation
router.put("/conversations/:id", renameConversation);

// Delete a conversation
router.delete("/conversations/:id", deleteConversation);

module.exports = router;
