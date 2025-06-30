const Event = require("../models/Event");
const axios = require("axios");

// Get all events
exports.getAllEvents = async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};

// Get single event
exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

// Create event
exports.createEvent = async (req, res) => {
  const { name, description, date } = req.body;
  const newEvent = await Event.create({ name, description, date });
  res.status(201).json(newEvent);
};

// Update event
exports.updateEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// Delete event
exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
};

// Seed from Calendarific
exports.seedFromCalendarific = async (req, res) => {
  const apiKey = process.env.CALENDARIFIC_API_KEY;
  const year = new Date().getFullYear();
  const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=MA&year=${year}`;

  try {
    const { data } = await axios.get(url);
    const holidays = data.response.holidays;

    const events = holidays.map((h) => ({
      name: h.name,
      description: h.description,
      date: h.date.iso,
    }));

    await Event.insertMany(events);
    res.status(201).json({ message: "Events seeded", count: events.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch from Calendarific" });
  }
};
