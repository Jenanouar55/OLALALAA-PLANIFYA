const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, profileController.createProfile);
router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/me', authMiddleware, profileController.updateMyProfile);

module.exports = router;
