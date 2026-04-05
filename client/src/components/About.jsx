import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './About.css'

const education = [
  { degree: 'Bachelor of Computer Applications (BCA)', institution: 'Maharaja Sayajirao University', year: '2023', loc: 'Vadodara' },
  { degree: '12th Grade', institution: 'Ankur Saurabh High School', year: '2020', loc: 'Veraval' },
  { degree: '10th Grade', institution: 'Darshan School', year: '2018', loc: 'Veraval' },
]

const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '4', label: 'Companies' },
  { value: '2+', label: 'Projects' },
  { value: '10+', label: 'Technologies' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }
  })
}

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <motion.span className="section-tag" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          About Me
        </motion.span>
        <motion.h2 className="section-title" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          Passionate about Data &amp;<br />Beautiful Interfaces
        </motion.h2>

        <div className="about-grid">
          {/* Avatar */}
          <motion.div
            className="about-avatar-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="avatar-glow" />
            <div className="avatar-box">
              <div className="avatar-initials">KV</div>
              <div className="avatar-ring" />
            </div>
            <div className="about-stats">
              {stats.map((s, i) => (
                <motion.div key={s.label} className="stat-card glass" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <span className="stat-val gradient-text">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            className="about-bio"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="bio-text">
              Hi! I'm <strong>Khushal Vadhavana</strong>, an eager Data Analyst and React JS Developer based in Somnath, Veraval. I love turning complex data into compelling visualisations and building fast, responsive web applications.
            </p>
            <p className="bio-text" style={{ marginTop: 16 }}>
              Currently at <strong>Chemtrols Industries</strong>, I work with industrial automation data — cleaning, preprocessing, and visualising sensor outputs for IOCL reports. I thrive at the intersection of data and design.
            </p>

            <div className="education-list">
              <h3 className="edu-heading">Education</h3>
              {education.map((e, i) => (
                <motion.div key={e.degree} className="edu-item glass" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="edu-year">{e.year}</div>
                  <div>
                    <div className="edu-degree">{e.degree}</div>
                    <div className="edu-inst">{e.institution} · {e.loc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="about-cta">
              <a href="#contact" className="btn btn-primary">Let's Work Together</a>
              <a href="/Khushal_Vadhavana_Resume.pdf" download className="btn btn-outline">Download CV</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
