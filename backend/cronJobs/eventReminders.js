const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationService');
const moment = require('moment');

// Run daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('📆 Running event reminder job...');

  const today = moment().startOf('day');
  const sevenDaysFromNow = moment().add(7, 'days').startOf('day');

  // Fetch events happening today or in 7 days
  const events = await Event.find({
    date: {
      $gte: today.toDate(),
      $lte: sevenDaysFromNow.toDate()
    }
  });

  if (!events.length) return;

  const users = await User.find({}, '_id');

  for (const event of events) {
    const eventDate = moment(event.date).startOf('day');

    let type, message;
    if (eventDate.isSame(sevenDaysFromNow)) {
      type = 'reminder';
      message = `“${event.title}” is in 7 days!`;
    } else if (eventDate.isSame(today)) {
      type = 'alert';
      message = `“${event.title}” is today!`;
    } else {
      continue;
    }

    for (const user of users) {
      await createNotification(user._id, {
        title: '📢 Public Event Reminder',
        message,
        type
      });
    }
  }
});
