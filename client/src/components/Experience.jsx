import { motion } from 'framer-motion'
import { Skeleton } from './Skeleton'
import './Experience.css'

export default function Experience({ data, loading }) {
  const experiences = data || []

  if (!loading && experiences.length === 0) return null

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
          {loading && !data ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-card glass" style={{ padding: '24px' }}>
                  <Skeleton width="150px" height="24px" className="mb-2" />
                  <Skeleton width="100px" height="16px" className="mb-4" />
                  <Skeleton width="100%" height="14px" className="mb-2" />
                  <Skeleton width="90%" height="14px" className="mb-2" />
                  <Skeleton width="40%" height="14px" className="mb-4" />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Skeleton width="60px" height="24px" borderRadius="12px" />
                    <Skeleton width="60px" height="24px" borderRadius="12px" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            experiences.map((exp, i) => (
              <motion.div
                key={exp._id || exp.id || i}
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
                    {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((d, di) => (
                      <li key={di}>{d}</li>
                    ))}
                  </ul>
                  <div className="card-tech">
                    {(exp.tech || []).map(t => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  )
}
