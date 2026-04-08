import { motion } from 'framer-motion'
import { Skeleton } from './Skeleton'
import './Projects.css'

const ACCENTS = ['var(--primary)', 'var(--secondary)', '#a855f7', '#f59e0b', '#10b981']

export default function Projects({ data, loading }) {
  const projects = data || []

  if (!loading && projects.length === 0) return null

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
          {loading && !data ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="project-card glass" style={{ padding: '24px' }}>
                <div className="project-top">
                  <Skeleton width="40px" height="40px" borderRadius="10px" />
                  <Skeleton width="60px" height="18px" />
                </div>
                <Skeleton width="80%" height="24px" className="mb-2" />
                <Skeleton width="100%" height="16px" className="mb-2" />
                <Skeleton width="90%" height="16px" className="mb-4" />
                <div className="project-tech" style={{ display: 'flex', gap: '8px' }}>
                  <Skeleton width="50px" height="20px" borderRadius="4px" />
                  <Skeleton width="50px" height="20px" borderRadius="4px" />
                  <Skeleton width="50px" height="20px" borderRadius="4px" />
                </div>
              </div>
            ))
          ) : (
            projects.map((p, i) => (
              <motion.div
                key={p._id || p.id || i}
                className="project-card glass"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
                whileHover={{ y: -8 }}
                style={{ '--card-accent': ACCENTS[i % ACCENTS.length] }}
              >
                <div className="project-top">
                  <div className="project-emoji">{p.icon || '🚀'}</div>
                  <span className="project-type">{p.type || 'Project'}</span>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>

                <div className="project-tech">
                  {(p.tech || []).map(t => (
                    <span key={t} className="project-tag">{t}</span>
                  ))}
                </div>

                {(p.link || p.github) && (
                  <div className="project-links" style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="project-tag" style={{ textDecoration: 'none' }}>🔗 Live</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="project-tag" style={{ textDecoration: 'none' }}>GitHub</a>}
                  </div>
                )}

                <div className="project-glow" />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
