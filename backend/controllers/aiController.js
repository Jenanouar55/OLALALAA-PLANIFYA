const Profile = require('../models/Profile');
const { formatUserContextPrompt } = require('../utils/promptBuilder');
const axios = require('axios');
const cohere = require('cohere-ai');

// Init Cohere
cohere.init(process.env.COHERE_API_KEY);

// 🧠 AI Handler - supports 'openai' or 'cohere'
const callAI = async (prompt) => {
  const provider = process.env.AI_PROVIDER || 'openai';

  if (provider === 'cohere') {
    try {
      const response = await cohere.chat({
        model: 'command-r', // we can choose another model depending on our usage
        message: prompt,
      });
      return response.body.text;
    } catch (err) {
      console.error('Cohere API error:', err.response?.data || err.message);
      throw new Error('Failed to get response from Cohere');
    }
  }

  // Default to OpenAI
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return res.data.choices[0].message.content;
  } catch (err) {
    console.error('OpenAI API error:', err.response?.data || err.message);
    throw new Error('Failed to get response from OpenAI');
  }
};

const getUserProfile = async (userId) => {
  return await Profile.findOne({ user: userId });
};

// 🎯 Caption Generator
const generateCaption = async (req, res) => {
  try {
    const { topic, tone } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile) return res.status(404).json({ error: 'User profile not found' });

    const prompt = formatUserContextPrompt(profile, `Generate 3 social media captions about: "${topic}". Use a ${tone} tone.`);
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error('Caption generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
};

// 🗓️ Content Calendar Ideas
const generateContentIdeas = async (req, res) => {
  try {
    const { timeFrame } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile) return res.status(404).json({ error: 'User profile not found' });

    const prompt = formatUserContextPrompt(profile, `Suggest content ideas for ${timeFrame}. Return them as a list with short descriptions.`);
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error('Content idea generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate content ideas' });
  }
};

// 🎥 Script Generator
const generateScript = async (req, res) => {
  try {
    const { topic } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile) return res.status(404).json({ error: 'User profile not found' });

    const prompt = formatUserContextPrompt(profile, `Write a short, engaging video script about: "${topic}". Max 30 seconds.`);
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error('Script generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate script' });
  }
};

// 📈 Strategy Chat
const chatStrategy = async (req, res) => {
  try {
    const { message } = req.body;
    const profile = await getUserProfile(req.user._id);
    if (!profile) return res.status(404).json({ error: 'User profile not found' });

    const prompt = formatUserContextPrompt(profile, `The user asked: "${message}". Answer as a helpful content strategist.`);
    const result = await callAI(prompt);
    res.json({ result });
  } catch (err) {
    console.error('Strategy chat error:', err.message);
    res.status(500).json({ error: 'Failed to process strategy message' });
  }
};

module.exports = {
  generateCaption,
  generateContentIdeas,
  generateScript,
  chatStrategy,
};