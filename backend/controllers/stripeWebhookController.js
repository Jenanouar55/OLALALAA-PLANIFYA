require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Profile = require('../models/Profile');
const { createNotification } = require('../utils/notificationService');

const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event types
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
  const { userId, plan } = session.metadata || {};
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return console.log('Profile not found');

    profile.plan = plan;
    profile.stripeCustomerId = customerId;
    profile.stripeSubscriptionId = subscriptionId;
    profile.subscriptionStatus = 'pending'; 
    await profile.save();

    console.log(`🕓 User ${userId} started checkout for ${plan}`);
    } catch (err) {
      console.error('Failed to store checkout session:', err.message);
    }
  }
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object;
    const subscriptionId = invoice.subscription;

    try {
      const profile = await Profile.findOne({ stripeSubscriptionId: subscriptionId });
      if (!profile) return console.log('Profile not found for invoice.paid');

      const tokenMap = { starter: 50, pro: 150 };

      profile.tokens = tokenMap[profile.plan] || 15;
      profile.planRenewalDate = new Date();
      profile.subscriptionStatus = 'active';

      await profile.save();
      await createNotification(profile.user, {
        title: 'Subscription Activated',
        message: `Your ${profile.plan} plan is now active!`,
        type: 'info'
      });
      console.log(`Tokens reset for ${profile.user}`);
    } catch (err) {
      console.error('Failed to reset tokens:', err.message);
    }
}
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    const subscriptionId = invoice.subscription;

    try {
      const profile = await Profile.findOne({ stripeSubscriptionId: subscriptionId });
      if (!profile) return console.log('Profile not found for payment_failed');

      profile.subscriptionStatus = 'inactive';
      await profile.save();
      await createNotification(profile.user, {
        title: 'Payment Failed',
        message: `We couldn't process your payment.`,
        type: 'alert'
      });

      console.log(`⚠️ Subscription marked inactive for ${profile.user}`);
    } catch (err) {
      console.error('Failed to update status:', err.message);
    }
}
  console.log(`🔔 Received event: ${event.type}`);
  res.json({ received: true });
};

module.exports = { stripeWebhookHandler };
