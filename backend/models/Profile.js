const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female'] },
  city: { type: String },
  country: { type: String },

  platforms: [{
    type: String,
    enum: ['instagram', 'twitter', 'tiktok', 'facebook', 'youtube']
  }],
  mainPlatform: {
    type: String,
    enum: ['instagram', 'twitter', 'tiktok', 'facebook', 'youtube'],
  },

  contentTypes: [{
    type: String,
    enum: ['photography', 'creative writing', 'video', 'other']
  }],
  contentCategories: [{
    type: String,
    enum: ['art', 'technology', 'beauty and fashion', 'gadgets', 'events', 'gaming', 'other']
  }],

  monetizationMethod: { type: String },
  bestContentLinks: { type: [String] },
  additionalInfo: { type: String },

  plan: {
  type: String,
  enum: ['free', 'starter', 'pro'],
  default: 'free'
  },
  tokens: {
    type: Number,
    default: 15
  },
  stripeCustomerId: {
    type: String
  },
  stripeSubscriptionId: {
    type: String
  },
  planRenewalDate: {
    type: Date
  },
  subscriptionStatus: {
    type: String,
    enum: ['pending', 'active', 'canceled', 'past_due', 'incomplete', 'unpaid'],
    default: 'active'
  }

}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);