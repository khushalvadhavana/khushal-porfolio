import { motion } from 'framer-motion'
import './Skills.css'

const ICONS = { languages: '💻', frameworks: '⚡', databases: '🗄️', tools: '📊', design: '🎨' }
const LABELS = { languages: 'Languages', frameworks: 'Frameworks', databases: 'Databases', tools: 'Data & Tools', design: 'Design' }

const topSkills = [
  { name: 'React JS', pct: 90 },
  { name: 'JavaScript', pct: 85 },
  { name: 'Python', pct: 80 },
  { name: 'Data Analysis', pct: 82 },
  { name: 'MongoDB', pct: 75 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Skills({ data }) {
  // Build skillGroups from API data, fallback to empty
  const skillGroups = data
    ? Object.entries(data).map(([key, skills]) => ({
        category: LABELS[key] || key,
        icon: ICONS[key] || '🔧',
        skills: Array.isArray(skills) ? skills : [],
      })).filter(g => g.skills.length > 0)
    : []

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <motion.span className="section-tag" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Expertise
        </motion.span>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Skills &amp; Technologies
        </motion.h2>
        <motion.p className="section-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          A versatile toolkit covering the full stack from frontend design to data analysis.
        </motion.p>

        <div className="skills-layout">
          {/* Badges */}
          <div className="skills-groups">
            {skillGroups.map((group, gi) => (
              <motion.div key={group.category} className="skill-group glass" variants={fadeUp} custom={gi} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="skill-group-header">
                  <span className="skill-icon">{group.icon}</span>
                  <span className="skill-category">{group.category}</span>
                </div>
                <div className="skill-badges">
                  {group.skills.map((s, si) => (
                    <motion.span key={s} className="skill-badge" variants={fadeUp} custom={si * 0.5} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      whileHover={{ scale: 1.08, y: -2 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="skills-progress">
            <h3 className="progress-heading">Top Skills</h3>
            {topSkills.map((s, i) => (
              <motion.div key={s.name} className="progress-item" variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="progress-meta">
                  <span className="progress-name">{s.name}</span>
                  <span className="progress-pct gradient-text">{s.pct}%</span>
                </div>
                <div className="progress-bar-bg">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
