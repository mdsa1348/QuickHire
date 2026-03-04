const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

const apiRouter = require('./routes/api');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('QuickHire API is running...');
});

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickhire';

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(mongoURI);
  isConnected = true;
  console.log('MongoDB Connected');
};

connectDB().catch(err => console.log('MongoDB error:', err));

// Local dev: start the server normally
// Vercel: export the app as a serverless function
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

module.exports = app;
