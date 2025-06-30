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

// AI Handler
const callAI = async (prompt) => {
  try {
    // Gemini first
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (text) return text;
  } catch (err) {
    console.warn("Gemini failed:", err.message);
  }

  try {
    // Fallback: Cohere
    const response = await cohere.chat({
      model: "command-r",
      message: prompt,
    });
    if (response.text) return response.text;
  } catch (err) {
    console.warn("Cohere failed:", err.message);
  }

  try {
    // Last fallback: OpenAI
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

// Caption Generator
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

// Content Calendar Ideas
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

// Script Generator
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

// Strategy Chat
const chatStrategy = async (req, res) => {
  try {
    const { message } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile)
      return res.status(404).json({ error: "User profile not found" });

    const prompt = formatUserContextPrompt(
      profile,
      `The user asked: "${message}". Answer as a helpful content strategist.`
    );
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error("Strategy chat error:", err.message);
    res.status(500).json({ error: "Failed to process strategy message" });
  }
};

module.exports = {
  generateCaption,
  generateContentIdeas,
  generateScript,
  chatStrategy,
};
