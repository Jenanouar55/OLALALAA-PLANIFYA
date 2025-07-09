const Profile = require('../models/Profile');

const requireTokens = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    if (profile.tokens <= 0) {
      return res.status(403).json({ error: 'You have no tokens left. Please upgrade your plan or wait until next month.' });
    }

    profile.tokens -= 1;
    await profile.save();

    next();
  } catch (err) {
    console.error('Token middleware error:', err.message);
    res.status(500).json({ error: 'Token validation failed' });
  }
};

module.exports = requireTokens;
