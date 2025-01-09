// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow only the frontend URL
  }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Prompt schema and model
const promptSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Prompt = require('./models/Prompt');

// Routes

// Get all prompts (sorted by newest first)
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new prompt

app.post('/api/prompts', async (req, res) => {
  const { prompt, imageUrl } = req.body;

  if (!prompt || !imageUrl) {
    return res.status(400).json({ message: 'Prompt and Image URL are required.' });
  }

  try {
    const newPrompt = new Prompt({ prompt, imageUrl });
    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
