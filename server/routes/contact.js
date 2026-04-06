const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');

// In-memory fallback
let inMemoryContacts = [];

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    
    // Add to in-memory if MongoDB saved successfully
    inMemoryContacts.push(contact.toObject());
    
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('⚠️ MongoDB error on POST /api/contact:', err.message);
    // Fallback: save to in-memory only
    const fallbackContact = { _id: new mongoose.Types.ObjectId(), name: req.body.name, email: req.body.email, subject: req.body.subject, message: req.body.message, createdAt: new Date(), read: false };
    inMemoryContacts.push(fallbackContact);
    res.status(201).json({ success: true, message: 'Message sent (in-memory only)' });
  }
});

// GET /api/contact
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    inMemoryContacts = contacts.map(c => c.toObject()); // Sync
    res.json({ success: true, data: contacts });
  } catch (err) {
    console.error('⚠️ MongoDB error on GET /api/contact:', err.message);
    res.json({ success: true, data: inMemoryContacts.sort((a,b) => b.createdAt - a.createdAt), source: 'fallback' });
  }
});

// DELETE /api/contact/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      inMemoryContacts = inMemoryContacts.filter(c => c._id.toString() !== id);
      return res.json({ success: true, message: 'Removed from memory' });
  }
  try {
    await Contact.findByIdAndDelete(id);
    inMemoryContacts = inMemoryContacts.filter(c => c._id.toString() !== id);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('⚠️ MongoDB error on DELETE /api/contact:', err.message);
    inMemoryContacts = inMemoryContacts.filter(c => c._id.toString() !== id);
    res.json({ success: true, message: 'Removed from memory only' });
  }
});

// PATCH /api/contact/:id/toggle-read
router.patch('/:id/toggle-read', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      const idx = inMemoryContacts.findIndex(c => c._id.toString() === id);
      if (idx !== -1) {
          inMemoryContacts[idx].read = !inMemoryContacts[idx].read;
          return res.json({ success: true, data: inMemoryContacts[idx] });
      }
      return res.status(404).json({ success: false, message: 'Message not found' });
  }
  try {
    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
    
    contact.read = !contact.read;
    await contact.save();
    
    // Sync in-memory
    const idx = inMemoryContacts.findIndex(c => c._id.toString() === id);
    if (idx !== -1) inMemoryContacts[idx] = contact.toObject();

    res.json({ success: true, data: contact });
  } catch (err) {
    console.error('⚠️ MongoDB error on PATCH /api/contact:', err.message);
    const idx = inMemoryContacts.findIndex(c => c._id.toString() === id);
    if (idx !== -1) {
        inMemoryContacts[idx].read = !inMemoryContacts[idx].read;
        return res.json({ success: true, data: inMemoryContacts[idx], source: 'fallback' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
