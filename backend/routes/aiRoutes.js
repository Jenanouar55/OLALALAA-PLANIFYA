const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const aiController = require('../controllers/aiController');

console.log("authMiddleware:", typeof authMiddleware);
console.log(aiController);
// Protected routes for AI tools
router.post('/caption', authMiddleware, aiController.generateCaption);
router.post('/calendar-ideas', authMiddleware, aiController.generateContentIdeas); 
router.post('/script', authMiddleware, aiController.generateScript);
router.post('/strategy-chat', authMiddleware, aiController.chatStrategy);

module.exports = router;
