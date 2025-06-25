const cron = require('node-cron');
const Profile = require('../models/Profile');

const tokenMap = { starter: 50, pro: 150 };

const resetMonthlyTokens = async () => {
  try {
    const now = new Date();

    const profiles = await Profile.find({ subscriptionStatus: 'active' });

    for (const profile of profiles) {
      const lastRenewal = profile.planRenewalDate || new Date(0);
      const diffMonths = (now.getFullYear() - lastRenewal.getFullYear()) * 12 + (now.getMonth() - lastRenewal.getMonth());

      if (diffMonths >= 1) {
        profile.tokens = tokenMap[profile.plan] || 15;
        profile.planRenewalDate = now;
        await profile.save();
        console.log(`Tokens reset for user ${profile.user}`);
      }
    }
  } catch (err) {
    console.error('Monthly token reset error:', err);
  }
};

// Schedule to run once evryday at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily token reset check...');
  resetMonthlyTokens();
});

module.exports = resetMonthlyTokens;
