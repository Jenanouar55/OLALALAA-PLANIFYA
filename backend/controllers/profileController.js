const Profile = require('../models/Profile');

// creating profile
exports.createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Profile already exists.' });

    const profileData = {
      user: req.user._id,
      ...req.body
    };

    const profile = new Profile(profileData);
    await profile.save();

    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/profile/me 
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile/me | updating the profile
exports.updateMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};