const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// All routes here require auth + admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.delete('/users/:id', adminController.deleteUser);
// router.put('/users/:id/role', adminController.updateUserRole); Not for now maybe never

module.exports = router;
