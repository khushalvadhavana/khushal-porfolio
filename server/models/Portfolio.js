const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  github: { type: String },
  linkedin: { type: String },
  summary: { type: String },
  skills: {
    languages: [String],
    frameworks: [String],
    databases: [String],
    tools: [String],
    design: [String],
  },
  experience: [
    {
      id: Number,
      company: String,
      location: String,
      role: String,
      duration: String,
      description: [String],
      tech: [String],
    }
  ],
  projects: [
    {
      id: Number,
      title: String,
      description: String,
      tech: [String],
      type: String,
      icon: String,
      link: String,
      github: String,
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      location: String,
      year: String,
    }
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
