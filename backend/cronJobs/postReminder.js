const cron = require('node-cron');
const Post = require('../models/Post');
const { createNotification } = require('../utils/notificationService');
const moment = require('moment');

cron.schedule('*/10 * * * *', async () => {
  console.log('🔔 Running post reminder job...');

  const now = moment();
  const tenMinLater = moment().add(10, 'minutes');

  const posts = await Post.find({
    date: {
      $gte: now.toDate(),
      $lt: tenMinLater.toDate()
    }
  });

  for (const post of posts) {
    await createNotification(post.user_id, {
      title: '⏰ Post Reminder',
      message: `You have a scheduled post for ${post.platform.join(', ')} soon!`,
      type: 'reminder'
    });
  }
});
