import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import './Hero.css'

const TITLES = ['Data Analyst', 'Full Stack Developer']

export default function Hero() {
  const canvasRef = useRef(null)
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 3

    const geo = new THREE.BufferGeometry()
    const count = 1200
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      particles.rotation.y += 0.0008
      particles.rotation.x += 0.0003
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  // Typewriter
  useEffect(() => {
    const current = TITLES[titleIndex]
    if (!deleting && displayed === current) {
      const t = setTimeout(() => setDeleting(true), 1800)
      return () => clearTimeout(t)
    }
    if (deleting && displayed === '') {
      setDeleting(false)
      setTitleIndex(i => (i + 1) % TITLES.length)
      return
    }
    const speed = deleting ? 40 : 80
    const t = setTimeout(() => {
      setDisplayed(prev =>
        deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      )
    }, speed)
    return () => clearTimeout(t)
  }, [displayed, deleting, titleIndex])

  return (
    <section id="home" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-overlay" />

      <div className="container hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          👋 Available for opportunities
        </motion.div>

        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
        >
          Khushal<br />
          <span className="gradient-text">Vadhavana</span>
        </motion.h1>

        <motion.div
          className="hero-typewriter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span className="typewriter-prefix">I'm a </span>
          <span className="typewriter-text">{displayed}</span>
          <span className="typewriter-cursor">|</span>
        </motion.div>

        <motion.p
          className="hero-bio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Eager data enthusiast and React developer with a passion for
          building dynamic web applications and extracting insights from data.
          Based in <strong>Somnath, Veraval</strong>.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <a href="#contact" className="btn btn-primary" id="hero-contact-btn">
            Get in Touch
          </a>
          <a href="#projects" className="btn btn-outline" id="hero-projects-btn">
            View Projects
          </a>
        </motion.div>

        <motion.div
          className="hero-socials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <a href="https://github.com/khushalvadhavana" target="_blank" rel="noreferrer" className="social-link">
            GitHub
          </a>
          <span className="social-sep">·</span>
          <a href="https://www.linkedin.com/in/khushalvadhavana" target="_blank" rel="noreferrer" className="social-link">
            LinkedIn
          </a>
          <span className="social-sep">·</span>
          <a href="mailto:khushalvadhavana856@gmail.com" className="social-link">
            Email
          </a>
        </motion.div>
      </div>

      <a href="#about" className="scroll-indicator" aria-label="Scroll down">
        <span className="scroll-dot" />
      </a>
    </section>
  )
}
