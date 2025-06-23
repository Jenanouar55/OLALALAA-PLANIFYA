const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const { stripeWebhookHandler } = require('./controllers/stripeWebhookController');

dotenv.config();
connectDB();
const app = express();

// Stripe webhook (uses raw body) must come befroe express.json()
const stripeWebhookRoutes = require('./routes/stripeWebhookRoutes');
app.use('/api', stripeWebhookRoutes);

// Middlewares
app.use(cors());
app.use(express.json()); 

// API routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const aiRoutes = require('./routes/aiRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stripe', stripeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
