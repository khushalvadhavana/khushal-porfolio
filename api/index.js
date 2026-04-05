const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Inline Model ---
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

// --- Static Data ---
const portfolioData = {
  name: "Khushal Vadhavana",
  title: "Data Analyst & React JS Developer",
  email: "khushalvadhavana856@gmail.com",
  phone: "9638737342",
  location: "Somnath, Veraval-363365",
  github: "https://github.com/khushalvadhavana",
  linkedin: "https://www.linkedin.com/in/khushalvadhavana",
  summary: "Eager Data Analyst and Front-End (React JS) Developer with a strong foundation in building dynamic web applications and performing complex data analysis. Experienced in industrial automation data processing and CRM dashboard development.",
  skills: {
    languages: ["HTML", "CSS", "JavaScript", "Python", "PHP"],
    frameworks: ["React JS", "Node JS", "Express JS"],
    databases: ["MongoDB", "MySQL", "PostgreSQL"],
    tools: ["PowerBI", "Tableau", "MS Excel", "Figma", "Tally"],
    design: ["UI/UX Design", "Figma", "Bootstrap", "MUI"],
  },
  experience: [
    { id: 1, company: "Chemtrols Industries Pvt. Ltd.", location: "Vadodara", role: "Data Analyst", duration: "Jun 2024 – Present", description: ["Clearing and preprocessing data for IOCL automation reports.", "Automating routine reporting in Excel to streamline workflows.", "Troubleshooting industrial sensor devices and automation systems."], tech: ["Python", "MS Excel", "PowerBI"] },
    { id: 2, company: "VeravalOnline Pvt. Ltd.", location: "Vadodara", role: "Front-End (React JS) Developer", duration: "Dec 2023 – Apr 2024", description: ["Developed payroll, attendance, and salary slip generation systems.", "Designed admin and employee dashboards using Bootstrap and MUI."], tech: ["React JS", "Bootstrap", "MUI"] },
    { id: 3, company: "Syndell Technologies Pvt. Ltd.", location: "Ahmedabad", role: "Front-End (React JS) Developer", duration: "Jun 2023 – Dec 2023", description: ["Led development of a dynamic CRM admin dashboard.", "Developed REST APIs to connect React frontend with MongoDB."], tech: ["React JS", "MongoDB", "REST API"] },
    { id: 4, company: "Zen Softtech Pvt. Ltd.", location: "Vadodara", role: "Front-End React JS Developer (Intern)", duration: "Dec 2022 – Apr 2023", description: ["Developed E-learning management system (LMS) dashboards.", "Converted Figma designs into functional React components."], tech: ["React JS", "Figma", "CSS"] },
  ],
  projects: [
    { id: 1, title: "Netflix Data Analysis", description: "Conducted EDA on a dataset of 9,800+ movies using Python to visualize genre trends and popularity. Used Pandas, NumPy, Seaborn, and Matplotlib.", tech: ["Python", "Pandas", "NumPy", "Seaborn", "Matplotlib"], type: "Data Analysis", icon: "📊" },
    { id: 2, title: "Hotel Management System", description: "Built a React JS frontend for reservation tracking and room occupancy management, focusing on operational efficiency and user interface.", tech: ["React JS", "CSS", "JavaScript"], type: "Web App", icon: "🏨" },
  ],
};

// --- Routes ---

// GET /api/portfolio
app.get('/api/portfolio', (req, res) => {
  res.json({ success: true, data: portfolioData });
});

// GET /api/contact
app.get('/api/contact', async (req, res) => {
  try {
    if (!process.env.MONGO_URI) return res.json({ success: true, data: [], note: "Database not connected" });
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Required fields missing' });
    if (!process.env.MONGO_URI) return res.status(503).json({ success: false, message: 'Database not configured' });
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- MongoDB Connection ---
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).catch(err => console.error('DB Error:', err));
}

module.exports = app;
