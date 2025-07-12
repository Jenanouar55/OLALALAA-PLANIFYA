const User = require('../models/User');
const Profile = require('../models/Profile');
const { createNotification } = require('../utils/notificationService');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Update user role
// exports.updateUserRole = async (req, res) => {
//   try {
//     const { role } = req.body;
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     user.role = role;
//     await user.save();
//     res.json({ message: 'User role updated', user });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update user role' });
//   }
// };

// Get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

//send manual notification
exports.sendManualNotification = async (req, res) => {
  const { userId, title, message, type } = req.body;

  if (!title || !message || !type)
    return res.status(400).json({ message: 'Missing required fields' });

  try {
    if (userId === 'all') {
      const allProfiles = await Profile.find();
      for (const profile of allProfiles) {
        await createNotification(profile.user, { title, message, type });
      }
      return res.status(200).json({ message: 'Notification sent to all users' });
    } else {
      await createNotification(userId, { title, message, type });
      return res.status(200).json({ message: 'Notification sent to user' });
    }
  } catch (err) {
    console.error('Manual notification error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//manually update tokens for a user
exports.addTokens = async (req, res) => {
  try {
    const { tokens } = req.body;
    const profile = await Profile.findOne({ user: req.params.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    profile.tokens += Number(tokens);
    await profile.save();

    res.json({ message: `Added ${tokens} tokens to user.` });
  } catch (err) {
    console.error('Add tokens error:', err.message);
    res.status(500).json({ error: 'Failed to add tokens' });
  }
};
