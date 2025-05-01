const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('API OLALALAA PLANIFYA');
});

const PORT = process.env.PORT || 500
