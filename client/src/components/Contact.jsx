import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import './Contact.css'

const API = 'http://localhost:5000/api/contact'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      await axios.post(API, form)
      toast.success("Message sent! I\u2019ll get back to you soon. \uD83D\uDE80")
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Oops! Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <motion.span className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Get In Touch
        </motion.span>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Let's Build Something<br />
          <span className="gradient-text">Together</span>
        </motion.h2>

        <div className="contact-layout">
          {/* Info */}
          <motion.div className="contact-info" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="contact-tagline">
              I'm open to full-time roles, freelance projects, and collaborations. Reach out and let's chat!
            </p>
            <div className="contact-details">
              <a href="mailto:khushalvadhavana856@gmail.com" className="contact-item">
                <span className="c-icon">✉️</span>
                <div>
                  <div className="c-label">Email</div>
                  <div className="c-val">khushalvadhavana856@gmail.com</div>
                </div>
              </a>
              <a href="tel:+919638737342" className="contact-item">
                <span className="c-icon">📱</span>
                <div>
                  <div className="c-label">Phone</div>
                  <div className="c-val">+91 9638737342</div>
                </div>
              </a>
              <div className="contact-item">
                <span className="c-icon">📍</span>
                <div>
                  <div className="c-label">Location</div>
                  <div className="c-val">Somnath, Veraval – 363365</div>
                </div>
              </div>
            </div>
            <div className="contact-links">
              <a href="https://github.com/khushalvadhavana" target="_blank" rel="noreferrer" className="btn btn-outline contact-social">GitHub</a>
              <a href="https://www.linkedin.com/in/khushalvadhavana" target="_blank" rel="noreferrer" className="btn btn-outline contact-social">LinkedIn</a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form className="contact-form glass" onSubmit={handleSubmit} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input id="name" name="name" type="text" placeholder="Khushal Vadhavana" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" placeholder="Project Inquiry" value={form.subject} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" rows={5} placeholder="Tell me about your project..." value={form.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading} id="contact-submit-btn">
              {loading ? (
                <span className="spinner" />
              ) : (
                <>Send Message ✈️</>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
