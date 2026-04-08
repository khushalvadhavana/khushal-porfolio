import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Skeleton } from './Skeleton'
import './Hero.css'

import developer1 from '../assets/images/developer-1.jpg'
import developer2 from '../assets/images/developer-2.jpg'

const TITLES = ['Data Analyst', 'Full Stack Developer', 'Freelancer']

export default function Hero({ data, loading }) {
  const canvasRef = useRef(null)
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Split title from API if it exists and contains multiple roles, else use defaults
  const apiTitles = data?.title ? data.title.split(/[&,]/).map(t => t.trim()) : []
  const titles = apiTitles.length > 0 ? [...new Set([...apiTitles, ...TITLES])] : TITLES
  const firstName = data?.name ? data.name.split(' ')[0] : 'Khushal'
  const lastName = data?.name ? data.name.split(' ').slice(1).join(' ') : 'Vadhavana'

  // Particle background (Cyberpunk neon colors)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 3

    const geo = new THREE.BufferGeometry()
    const count = 1200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    // Mix of Cyan and Magenta for particles
    const color1 = new THREE.Color(0x00ffff) // Cyan
    const color2 = new THREE.Color(0xff00ff) // Magenta

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12

      const mixedColor = Math.random() > 0.5 ? color1 : color2
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending
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

  // Typewriter effect
  useEffect(() => {
    const current = titles[titleIndex]
    if (!titles.length) return;
    if (!deleting && displayed === current) {
      const t = setTimeout(() => setDeleting(true), 2500)
      return () => clearTimeout(t)
    }
    if (deleting && displayed === '') {
      setDeleting(false)
      setTitleIndex(i => (i + 1) % titles.length)
      return
    }
    const speed = deleting ? 30 : 60
    const t = setTimeout(() => {
      setDisplayed(prev =>
        deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      )
    }, speed)
    return () => clearTimeout(t)
  }, [displayed, deleting, titleIndex, titles])

  return (
    <section id="home" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-overlay" />

      <div className="container hero-grid">
        <div className="hero-content">
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
            {loading && !data?.name ? <Skeleton width="200px" height="40px" /> : firstName}<br />
            <span className="gradient-text neon-text">
              {loading && !data?.name ? <Skeleton width="300px" height="50px" className="mt-2" /> : lastName}
            </span>
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
            {loading && !data?.summary ? (
              <>
                <Skeleton width="100%" height="20px" />
                <Skeleton width="80%" height="20px" className="mt-2" />
              </>
            ) : (
              <>
                {data?.summary || 'Eager data enthusiast and React developer with a passion for building dynamic web applications and extracting insights from data.'}
                {data?.location && <><br />Based in <strong>{data.location}</strong>.</>}
              </>
            )}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {loading && !data ? (
              <>
                <Skeleton width="160px" height="48px" borderRadius="8px" />
                <Skeleton width="160px" height="48px" borderRadius="8px" />
              </>
            ) : (
              <>
                <a href="#contact" className="btn btn-primary" id="hero-contact-btn">
                  Get in Touch
                </a>
                <a href="#projects" className="btn btn-outline neon-border" id="hero-projects-btn">
                  View Projects
                </a>
              </>
            )}
          </motion.div>

          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {loading && !data ? (
              <Skeleton width="200px" height="20px" />
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        </div>

        <div className="hero-visuals">
          <motion.div 
            className="image-wrapper main-img"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
          >
            <motion.img 
              src={developer2} 
              alt="Cyberpunk Developer" 
              className="hero-img glowing"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div 
            className="image-wrapper secondary-img"
            initial={{ opacity: 0, scale: 0.6, x: -30, y: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 90, delay: 0.8 }}
          >
            <motion.img 
              src={developer1} 
              alt="3D Floating Developer" 
              className="hero-img neon-border-img"
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </div>
      </div>

      <a href="#about" className="scroll-indicator" aria-label="Scroll down">
        <span className="scroll-dot pulse-dot" />
      </a>
    </section>
  )
}
