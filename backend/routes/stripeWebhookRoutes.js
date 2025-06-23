const express = require('express');
const router = express.Router();
const { stripeWebhookHandler } = require('../controllers/stripeWebhookController');

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  console.log('Stripe route hit');
  next();
}, stripeWebhookHandler);

module.exports = router;