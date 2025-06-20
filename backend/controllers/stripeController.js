require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  const { planId } = req.body;

  const plans = {
    starter: {
      priceId: 'price_1RbqxGCLyCnyf4OEowrrel8G',
      tokens: 50
    },
    pro: {
      priceId: 'price_1RbqxvCLyCnyf4OEMkpQKGrt',
      tokens: 150
    }
  };

  const selectedPlan = plans[planId];
  if (!selectedPlan) return res.status(400).json({ error: 'Invalid plan selected' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        }
      ],
      success_url: `${process.env.CLIENT_URL}/success`, 
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: 'Stripe checkout session failed' });
  }
};

module.exports = { createCheckoutSession };
