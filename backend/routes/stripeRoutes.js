const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/stripeController');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/create-checkout-session',authMiddleware, createCheckoutSession);

module.exports = router;
