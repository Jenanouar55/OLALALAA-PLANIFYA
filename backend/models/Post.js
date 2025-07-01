const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  date: { type: Date, default: Date.now },
  // date: { type: Date, required: true },
  platform: {
    type: [String],
    enum: [
      "tiktok",
      "instagram",
      "facebook",
      "youtube",
      "linkedin",
      "x",
      "snapchat",
      "pinterest",
      "other",
    ],
    required: true,
  },
  customPlatform: { type: String }, // filled only if "other" is in platform
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
