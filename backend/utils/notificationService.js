const Notification = require('../models/Notification');

exports.createNotification = async (userId, { title, message, type }) => {
  return await Notification.create({ user: userId, title, message, type });
};
