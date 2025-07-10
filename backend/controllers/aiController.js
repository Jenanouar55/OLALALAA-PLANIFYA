require("dotenv").config();
const Profile = require("../models/Profile");
const { formatUserContextPrompt } = require("../utils/promptBuilder");
const axios = require("axios");
const { CohereClient } = require("cohere-ai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("Key from env:", process.env.COHERE_API_KEY);
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const callAI = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (text) return text;
  } catch (err) {
    console.warn("Gemini failed:", err.message);
  }

  try {
    const response = await cohere.chat({
      model: "command-r",
      message: prompt,
    });
    if (response.text) return response.text;
  } catch (err) {
    console.warn("Cohere failed:", err.message);
  }

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI failed:", err.message);
    throw new Error("All AI providers failed.");
  }
};

const getUserProfile = async (userId) => {
  return await Profile.findOne({ user: userId });
};
const generateCaption = async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile)
      return res.status(404).json({ error: "User profile not found" });

    const prompt = formatUserContextPrompt(
      profile,
      `Generate 3 ${platform} captions about: "${topic}". Use a ${tone} tone.`
    );
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error("Caption generation error:", err.message);
    res.status(500).json({ error: "Failed to generate caption" });
  }
};
const generateContentIdeas = async (req, res) => {
  try {
    const { category, platform, date } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile)
      return res.status(404).json({ error: "User profile not found" });

    const prompt = formatUserContextPrompt(
      profile,
      `Suggest content Ideas for ${category} on ${platform} scheduled for ${date}. Return them as a list with short descriptions.`
    );
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error("Content idea generation error:", err.message);
    res.status(500).json({ error: "Failed to generate content ideas" });
  }
};
const generateScript = async (req, res) => {
  try {
    const { topic, duration, type } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile)
      return res.status(404).json({ error: "User profile not found" });

    const prompt = formatUserContextPrompt(
      profile,
      `Write a short, ${type} script about: "${topic}". Max ${duration} seconds.`
    );
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error("Script generation error:", err.message);
    res.status(500).json({ error: "Failed to generate script" });
  }
};

const ChatMessage = require("../models/ChatMessage");
const ChatConversation = require("../models/ChatConversation");
const getAllConversations = async (req, res) => {
  try {
    const conversations = await ChatConversation.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};
const getMessagesForConversation = async (req, res) => {
  try {
    const conversation = await ChatConversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!conversation) {
      return res
        .status(404)
        .json({ message: "Conversation not found or access denied" });
    }
    const messages = await ChatMessage.find({
      conversation: req.params.id,
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
const renameConversation = async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const conversation = await ChatConversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title: title },
      { new: true }
    );

    if (!conversation) {
      return res
        .status(404)
        .json({ message: "Conversation not found or access denied" });
    }
    res.json(conversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to update conversation" });
  }
};
const deleteConversation = async (req, res) => {
  try {
    const conversation = await ChatConversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ message: "Conversation not found or access denied" });
    }

    await ChatMessage.deleteMany({ conversation: req.params.id });
    await ChatConversation.findByIdAndDelete(req.params.id);

    res.json({
      message: "Conversation and all its messages deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};
const chatStrategy = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id;

    let conversation;

    if (conversationId) {
      conversation = await ChatConversation.findById(conversationId);
      if (!conversation)
        return res.status(404).json({ error: "Conversation not found" });
    } else {
      const firstMessageTitle =
        message.substring(0, 40) + (message.length > 40 ? "..." : "");
      conversation = await ChatConversation.create({
        user: userId,
        title: firstMessageTitle,
      });
    }

    await ChatMessage.create({
      user: userId,
      conversation: conversation._id,
      role: "user",
      message,
    });

    const profile = await getUserProfile(userId);
    if (!profile)
      return res.status(404).json({ error: "User profile not found" });

    const prompt = formatUserContextPrompt(
      profile,
      `The user asked: "${message}". Answer as a helpful content strategist.`
    );
    const aiReply = await callAI(prompt);

    await ChatMessage.create({
      user: userId,
      conversation: conversation._id,
      role: "assistant",
      message: aiReply,
    });

    res.json({ result: aiReply, conversationId: conversation._id });
  } catch (err) {
    console.error("Strategy chat error:", err.message);
    res.status(500).json({ error: "Failed to process strategy message" });
  }
};
module.exports = {
  getAllConversations,
  getMessagesForConversation,
  renameConversation,
  deleteConversation,
  generateCaption,
  generateContentIdeas,
  generateScript,
  chatStrategy,
};
