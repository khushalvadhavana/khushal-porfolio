import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ data }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const location = useLocation()

  if (location.pathname === '/admin') return null;

  const firstName = data?.name ? data.name.split(' ')[0] : 'Khushal'
  const firstLetter = firstName.charAt(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`navbar${scrolled ? ' scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-inner">
        <a href="#home" className="nav-logo">
          <span className="logo-k">{firstLetter}</span>{firstName.slice(1)}
        </a>

        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`nav-link${active === link.href.slice(1) ? ' active' : ''}`}
                onClick={() => setActive(link.href.slice(1))}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="/Khushal_Vadhavana_Resume.pdf" download className="btn btn-primary nav-cta">
          Download CV
        </a>

        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="mobile-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
