const Post = require("../models/Post");

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { title, content, platform, customPlatform, date } = req.body;

    const newPost = new Post({
      title,
      content,
      platform,
      customPlatform,
      date,
      user_id: req.user._id, // from authMiddleware
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get all posts of logged-in user
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};
