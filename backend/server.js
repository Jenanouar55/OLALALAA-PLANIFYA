const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();

// cron job to reset tokens
require("./cronJobs/tokenReset");

// cron job to send post reminders
require("./cronJobs/postReminder");

// cron job to send event reminders
require("./cronJobs/eventReminders");

// Stripe webhook (uses raw body) must come before express.json()
const stripeWebhookRoutes = require("./routes/stripeWebhookRoutes");
app.use("/api", stripeWebhookRoutes);

// Middlewares
app.use(
  cors({
    origin: [
      "https://www.planifya.site",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// API routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
