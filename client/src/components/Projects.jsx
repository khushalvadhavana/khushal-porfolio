import { motion } from 'framer-motion'
import './Projects.css'

const projects = [
  {
    id: 1,
    title: 'Netflix Data Analysis',
    emoji: '📊',
    type: 'Data Analysis',
    description:
      'Conducted exploratory data analysis on a dataset of 9,800+ movies. Visualised genre trends, popularity distributions, and rating patterns using Python libraries.',
    tech: ['Python', 'Pandas', 'NumPy', 'Seaborn', 'Matplotlib'],
    highlights: ['9,800+ entries analysed', 'Genre & popularity trends', 'EDA visualisations'],
    accent: 'var(--primary)',
  },
  {
    id: 2,
    title: 'Hotel Management System',
    emoji: '🏨',
    type: 'Web Application',
    description:
      'Built a full React JS frontend for reservation tracking and room occupancy management, focusing on operational efficiency and intuitive user interface.',
    tech: ['React JS', 'CSS', 'JavaScript'],
    highlights: ['Real-time reservations', 'Room occupancy tracking', 'Admin dashboard'],
    accent: 'var(--secondary)',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <motion.span className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Work
        </motion.span>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Featured Projects
        </motion.h2>
        <motion.p className="section-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          A selection of projects showing my breadth across data analysis and web development.
        </motion.p>

        <div className="projects-grid">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              className="project-card glass"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -8 }}
              style={{ '--card-accent': p.accent }}
            >
              <div className="project-top">
                <div className="project-emoji">{p.emoji}</div>
                <span className="project-type">{p.type}</span>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.description}</p>

              <ul className="project-highlights">
                {p.highlights.map(h => (
                  <li key={h}><span className="highlight-dot" />{h}</li>
                ))}
              </ul>

              <div className="project-tech">
                {p.tech.map(t => (
                  <span key={t} className="project-tag">{t}</span>
                ))}
              </div>

              <div className="project-glow" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
