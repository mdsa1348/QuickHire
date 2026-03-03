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

// MongoDB Connection (Placeholder for now)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickhire';
// mongoose.connect(mongoURI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
