const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllConversations,
  getMessagesForConversation,
  renameConversation,
  deleteConversation,
} = require("../controllers/aiController");

router.use(authMiddleware);

router.get("/conversations", getAllConversations);

router.get("/conversations/:id", getMessagesForConversation);

router.put("/conversations/:id", renameConversation);

router.delete("/conversations/:id", deleteConversation);

module.exports = router;
