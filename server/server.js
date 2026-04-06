const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/contact', require('./routes/contact'));

// MongoDB Connection
// Only connect if MONGO_URI is present
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ MongoDB error:', err.message));
} else {
  console.log('⚠️ MONGO_URI not found. Server running with fallback data.');
}

const PORT = process.env.PORT || 5000;

// On Vercel, we don't call listen(), we just export the app
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

module.exports = app;
