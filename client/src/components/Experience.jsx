import { motion } from 'framer-motion'
import './Experience.css'

const experiences = [
  {
    id: 1,
    company: 'Chemtrols Industries Pvt. Ltd.',
    role: 'Data Analyst',
    duration: 'Jun 2024 – Present',
    location: 'Vadodara',
    description: [
      'Cleaning and preprocessing data for IOCL automation reports.',
      'Automating routine reporting in Excel to streamline workflows.',
      'Troubleshooting industrial sensor devices and automation systems.',
    ],
    tech: ['Python', 'MS Excel', 'PowerBI'],
    current: true,
  },
  {
    id: 2,
    company: 'VeravalOnline Pvt. Ltd.',
    role: 'Front-End (React JS) Developer',
    duration: 'Dec 2023 – Apr 2024',
    location: 'Vadodara',
    description: [
      'Developed payroll, attendance, and salary slip generation systems.',
      'Designed admin and employee dashboards using Bootstrap and MUI.',
    ],
    tech: ['React JS', 'Bootstrap', 'MUI'],
  },
  {
    id: 3,
    company: 'Syndell Technologies Pvt. Ltd.',
    role: 'Front-End (React JS) Developer',
    duration: 'Jun 2023 – Dec 2023',
    location: 'Ahmedabad',
    description: [
      'Led development of a dynamic CRM admin dashboard.',
      'Developed REST APIs to connect React frontend with MongoDB.',
    ],
    tech: ['React JS', 'MongoDB', 'REST API'],
  },
  {
    id: 4,
    company: 'Zen Softtech Pvt. Ltd.',
    role: 'Front-End React JS Developer (Intern)',
    duration: 'Dec 2022 – Apr 2023',
    location: 'Vadodara',
    description: [
      'Developed E-learning management system (LMS) dashboards.',
      'Converted Figma designs into functional React components.',
    ],
    tech: ['React JS', 'Figma', 'CSS'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="section exp-section">
      <div className="container">
        <motion.span className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Career
        </motion.span>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Work Experience
        </motion.h2>
        <motion.p className="section-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          3+ years across data analysis, React development, and UI engineering.
        </motion.p>

        <div className="timeline">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              className="timeline-item"
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
            >
              <div className="timeline-dot">
                {exp.current && <span className="dot-pulse" />}
              </div>
              <div className={`timeline-card glass${exp.current ? ' current' : ''}`}>
                <div className="card-header">
                  <div>
                    <h3 className="card-role">{exp.role}</h3>
                    <div className="card-company">{exp.company}</div>
                  </div>
                  {exp.current && <span className="current-badge">Current</span>}
                </div>
                <div className="card-meta">
                  <span className="card-duration">{exp.duration}</span>
                  <span className="card-sep">·</span>
                  <span className="card-location">{exp.location}</span>
                </div>
                <ul className="card-desc">
                  {exp.description.map((d, di) => (
                    <li key={di}>{d}</li>
                  ))}
                </ul>
                <div className="card-tech">
                  {exp.tech.map(t => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  )
}
