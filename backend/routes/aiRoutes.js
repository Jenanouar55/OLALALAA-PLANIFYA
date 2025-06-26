const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const aiController = require('../controllers/aiController');
const requireTokens = require('../middlewares/tokenMiddleware');

router.use(authMiddleware);

// Protected routes for AI tools
router.post('/caption', requireTokens, aiController.generateCaption);
router.post('/calendar-ideas', requireTokens, aiController.generateContentIdeas); 
router.post('/script', requireTokens, aiController.generateScript);
router.post('/strategy-chat', requireTokens, aiController.chatStrategy);

module.exports = router;
