import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'

function ScanPayScene() {
  const g = useRef()
  useFrame(s => {
    g.current.rotation.y = s.clock.elapsedTime * .4
    g.current.rotation.x = Math.sin(s.clock.elapsedTime * .3) * .2
  })
  const cubes = []
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) {
    const on = (x + y) % 2 === 0
    cubes.push(
      <mesh key={`${x}${y}`} position={[x * .55, y * .55, 0]}>
        <boxGeometry args={[.38, .38, .38]} />
        <meshStandardMaterial
          color={on ? '#9944ff' : '#0d0025'}
          emissive={on ? '#6622cc' : '#000'}
          emissiveIntensity={on ? .9 : 0}
          metalness={.8} roughness={.15}
        />
      </mesh>
    )
  }
  return <group ref={g}>{cubes}</group>
}

function HospitalScene() {
  const g1 = useRef(), g2 = useRef(), ring = useRef()
  useFrame(s => {
    const t = s.clock.elapsedTime
    g1.current.position.x = Math.cos(t * .8) * 1.1
    g1.current.position.z = Math.sin(t * .8) * 1.1
    g2.current.position.x = Math.cos(t * .8 + Math.PI) * 1.1
    g2.current.position.z = Math.sin(t * .8 + Math.PI) * 1.1
    ring.current.rotation.z += .006
  })
  return (
    <group>
      <mesh ref={g1}>
        <icosahedronGeometry args={[.38, 0]} />
        <meshStandardMaterial color="#9944ff" emissive="#550099" emissiveIntensity={.7} metalness={.9} roughness={.1} />
      </mesh>
      <mesh ref={g2}>
        <icosahedronGeometry args={[.28, 0]} />
        <meshStandardMaterial color="#7722ee" emissive="#3300aa" emissiveIntensity={.7} metalness={.9} roughness={.1} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[1.1, .018, 4, 80]} />
        <meshBasicMaterial color="#7722ee" transparent opacity={.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[.45, 16, 16]} />
        <meshStandardMaterial color="#0d0025" emissive="#4400aa" emissiveIntensity={.6} metalness={.95} roughness={.05} />
      </mesh>
      <pointLight color="#9933ff" intensity={1.5} distance={4} />
    </group>
  )
}

const PROJECTS = [
  {
    id: 'hospital',
    tag: 'HealthTech · Java · MySQL',
    num: '01 / 02',
    title: 'Hospital Management System',
    year: '2024 – 2025',
    desc: 'Comprehensive web-based hospital platform for managing patients, doctors, OPD scheduling and billing — built with Java Servlets, JSP and MySQL on Apache Tomcat.',
    bullets: [
      'Patient registration & medical records',
      'Doctor scheduling & appointment management',
      'OPD queue & billing system',
      'Admin dashboard with live stats',
    ],
    tech: ['Core Java', 'Servlets', 'JSP', 'MySQL', 'Apache Tomcat', 'HTML/CSS'],
    Scene: HospitalScene,
    github: null,
    readme: null,
  },
  {
    id: 'scanpay',
    tag: 'Fintech · Java · MySQL',
    num: '02 / 02',
    title: 'ScanPay – Retail Self-Checkout',
    year: '2025',
    desc: 'Web-based retail self-checkout system where customers scan product barcodes, pay via Razorpay, and exit after guard verification — eliminating billing queues.',
    bullets: [
      'Barcode scan & Razorpay payment (UPI / Card / Wallet)',
      'Guard exit-verification with anti-reuse logic',
      'Admin dashboard: revenue, transactions, top products',
      'Hibernate ORM + MySQL with full referential integrity',
    ],
    tech: ['Core Java', 'Servlets', 'Hibernate ORM', 'MySQL', 'Razorpay API', 'Apache Tomcat'],
    Scene: ScanPayScene,
    // Replace YOUR_USERNAME with your real GitHub username after pushing
    github: 'https://github.com/YOUR_USERNAME/ScanPay',
    readme: 'https://github.com/YOUR_USERNAME/ScanPay#readme',
  },
]

function Card({ project, index }) {
  const cardRef = useRef()

  const onMove = e => {
    const r = cardRef.current.getBoundingClientRect()
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
    gsap.to(cardRef.current, {
      rotateY: dx * 6, rotateX: -dy * 5,
      duration: .35, ease: 'power2.out', transformPerspective: 900,
    })
  }

  const onLeave = () => gsap.to(cardRef.current, {
    rotateY: 0, rotateX: 0,
    duration: .6, ease: 'elastic.out(1,.7)',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: .7, delay: index * .15 }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          border: '1px solid rgba(153,68,255,.2)',
          background: 'rgba(13,0,37,.65)',
          backdropFilter: 'blur(12px)',
          borderRadius: 12,
          overflow: 'hidden',
          willChange: 'transform',
        }}
      >
        {/* 3D Scene */}
        <div style={{
          height: 220,
          background: 'radial-gradient(ellipse at 50% 50%,rgba(80,0,160,.15) 0%,transparent 70%)',
        }}>
          <Canvas camera={{ position: [0, 0, 3.5], fov: 55 }} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={.25} />
            <pointLight position={[2, 3, 2]} intensity={6} color="#9944ff" />
            <pointLight position={[-2, -1, 1]} intensity={3} color="#5500aa" />
            <project.Scene />
          </Canvas>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 1.6rem 2rem' }}>

          {/* Tag + Year */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem', flexWrap: 'wrap', gap: '.4rem' }}>
            <span style={{ fontSize: '.55rem', letterSpacing: '.18em', color: 'var(--violet)', textTransform: 'uppercase', opacity: .6 }}>
              {project.tag}
            </span>
            <span style={{ fontSize: '.55rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
              {project.year}
            </span>
          </div>

          {/* Title */}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: '.6rem' }}>
            {project.title}
          </div>

          {/* Description */}
          <p style={{ fontSize: '.72rem', color: 'var(--text-dim)', lineHeight: 1.85, marginBottom: '1rem' }}>
            {project.desc}
          </p>

          {/* Bullets */}
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.3rem', marginBottom: '1.2rem' }}>
            {project.bullets.map(b => (
              <li key={b} style={{ fontSize: '.65rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--violet)', flexShrink: 0 }} />
                {b}
              </li>
            ))}
          </ul>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: project.github || project.readme ? '1.2rem' : 0 }}>
            {project.tech.map(t => (
              <span key={t} style={{
                fontSize: '.55rem', letterSpacing: '.1em',
                padding: '.25rem .6rem',
                border: '1px solid rgba(153,68,255,.18)',
                borderRadius: 2,
                color: 'var(--text-faint)',
              }}>
                {t}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          {(project.github || project.readme) && (
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '.58rem', letterSpacing: '.12em',
                    textTransform: 'uppercase', padding: '.55rem 1.2rem', borderRadius: 3,
                    background: 'transparent', color: 'var(--violet)',
                    border: '1px solid rgba(153,68,255,.35)',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                    transition: 'background .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(153,68,255,.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  ↗ GitHub
                </a>
              )}
              {project.readme && (
                <a
                  href={project.readme}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '.58rem', letterSpacing: '.12em',
                    textTransform: 'uppercase', padding: '.55rem 1.2rem', borderRadius: 3,
                    background: 'var(--purple-2)', color: '#fff',
                    border: 'none', boxShadow: '0 0 20px rgba(102,34,204,.4)',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                    transition: 'box-shadow .2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 36px rgba(102,34,204,.7)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(102,34,204,.4)'}
                >
                  ✦ View README
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" style={{ padding: '7rem 3rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.span
          className="sec-label"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
        >
          Work
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7, delay: .1 }}
        >
          Selected <em style={{ fontStyle: 'italic', color: 'var(--violet)' }}>projects.</em>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))',
          gap: '1.5rem',
          marginTop: '3rem',
        }}>
          {PROJECTS.map((p, i) => <Card key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}