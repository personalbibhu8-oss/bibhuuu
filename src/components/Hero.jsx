
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { Canvas, useFrame } from '@react-three/fiber'

/* Animated 3D avatar orb */
function AvatarOrb() {
  const outer = useRef(), mid = useRef(), inner = useRef(), ring1 = useRef(), ring2 = useRef()
  useFrame((s, d) => {
    const t = s.clock.elapsedTime
    outer.current.rotation.y += d * .3
    outer.current.rotation.x = Math.sin(t * .4) * .25
    mid.current.rotation.y   -= d * .5
    mid.current.rotation.z   += d * .2
    inner.current.rotation.x += d * .7
    inner.current.rotation.y -= d * .4
    ring1.current.rotation.z += d * .6
    ring1.current.rotation.x  = Math.sin(t * .5) * .5
    ring2.current.rotation.z -= d * .4
    ring2.current.rotation.y  = Math.cos(t * .3) * .4
    const pulse = 1 + Math.sin(t * 2.2) * .06
    inner.current.scale.setScalar(pulse)
  })
  return (
    <group>
      {/* outer wireframe */}
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color="#7722cc" wireframe transparent opacity={.35} emissive="#4400aa" emissiveIntensity={.5} />
      </mesh>
      {/* mid */}
      <mesh ref={mid}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#9933ff" wireframe transparent opacity={.25} emissive="#6600cc" emissiveIntensity={.4} />
      </mesh>
      {/* inner solid */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[.7, 1]} />
        <meshStandardMaterial color="#1a0040" metalness={.95} roughness={.05} emissive="#7722ff" emissiveIntensity={.9} />
      </mesh>
      {/* rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.0, .022, 4, 120]} />
        <meshBasicMaterial color="#9944ff" transparent opacity={.55} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[1.5, .014, 4, 100]} />
        <meshBasicMaterial color="#cc66ff" transparent opacity={.4} />
      </mesh>
      <pointLight color="#9933ff" intensity={3} distance={6} />
      <pointLight color="#cc55ff" intensity={1.5} distance={4} position={[1,1,1]} />
    </group>
  )
}

export default function Hero() {
  const ctaRef = useRef()
  const statsRef = useRef()

  useEffect(() => {
    // Only animate things that are guaranteed visible
    gsap.from(ctaRef.current.children, {
      opacity: 0, y: 20, stagger: .12, duration: .6, ease: 'power2.out', delay: .4
    })
    gsap.from(statsRef.current.children, {
      opacity: 0, y: 16, stagger: .1, duration: .6, ease: 'power2.out', delay: .7
    })
  }, [])

  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      padding: '0 3rem',
      paddingTop: '5rem',
      position: 'relative',
      zIndex: 10,
      gap: '2rem',
    }}>
      {/* LEFT — text */}
      <div>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, delay: .1 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '.62rem',
            letterSpacing: '.22em',
            color: 'var(--violet)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '1.2rem',
            opacity: .8,
          }}>
          Java Full Stack Intern · JSpiders, Bengaluru
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, delay: .2, ease: [.16, 1, .3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-.02em',
            color: '#fff',
            marginBottom: '.15em',
          }}>
          Bibhudutta
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, delay: .32, ease: [.16, 1, .3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-.02em',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(204,136,255,.6)',
            marginBottom: '1.2rem',
          }}>
          Mohanty.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7, delay: .45 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '.78rem',
            color: 'var(--text-dim)',
            maxWidth: 440,
            lineHeight: 1.95,
            marginBottom: '1.6rem',
          }}>
          Building <strong style={{ color: 'var(--text)' }}>real-world systems</strong> that solve real
          problems — from hospital management to QR payment platforms.
          BCA '26, Sage University, Indore.
        </motion.p>

        {/* divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: .8, delay: .55, ease: [.16,1,.3,1] }}
          style={{
            width: 80, height: 1,
            background: 'linear-gradient(90deg,var(--violet),transparent)',
            marginBottom: '1.6rem',
            transformOrigin: 'left',
          }} />

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#projects" style={{
            fontFamily: 'var(--font-mono)', fontSize: '.63rem', letterSpacing: '.15em',
            textTransform: 'uppercase', cursor: 'none', padding: '.75rem 2rem',
            borderRadius: '2px', background: 'var(--purple-2)', color: '#fff',
            border: 'none', boxShadow: '0 0 28px rgba(102,34,204,.5)',
          }}
          onMouseEnter={e => e.target.style.boxShadow = '0 0 44px rgba(102,34,204,.8)'}
          onMouseLeave={e => e.target.style.boxShadow = '0 0 28px rgba(102,34,204,.5)'}>
            View Work
          </a>
          <a href="mailto:bibhumohanty26024@gmail.com" style={{
            fontFamily: 'var(--font-mono)', fontSize: '.63rem', letterSpacing: '.15em',
            textTransform: 'uppercase', cursor: 'none', padding: '.75rem 2rem',
            borderRadius: '2px', background: 'transparent', color: 'var(--violet)',
            border: '1px solid rgba(153,68,255,.4)',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(153,68,255,.1)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}>
            Let's Talk
          </a>
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem' }}>
          {[['2','Projects'],['1','Internship'],['2026','Graduating']].map(([n, l]) => (
            <div key={l}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800,
                color: 'var(--violet)', lineHeight: 1,
              }}>{n}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '.55rem', letterSpacing: '.15em',
                color: 'var(--text-faint)', textTransform: 'uppercase', marginTop: '.3rem',
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — 3D avatar */}
      <motion.div
        initial={{ opacity: 0, scale: .85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: .3, ease: [.16,1,.3,1] }}
        style={{
          height: 480,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(100,20,200,.12) 0%, transparent 70%)',
          border: '1px solid rgba(153,68,255,.1)',
          borderRadius: '50%',
          position: 'relative',
        }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 55 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={.1} />
          <pointLight position={[4, 4, 4]} intensity={6} color="#9933ff" />
          <pointLight position={[-4, -2, 2]} intensity={3} color="#cc55ff" />
          <AvatarOrb />
        </Canvas>

        {/* floating label */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '12%', left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)', fontSize: '.6rem',
            letterSpacing: '.2em', textTransform: 'uppercase',
            color: 'var(--violet)', opacity: .7,
            background: 'rgba(13,0,37,.7)', backdropFilter: 'blur(8px)',
            padding: '.4rem 1rem', borderRadius: 20,
            border: '1px solid rgba(153,68,255,.2)',
            whiteSpace: 'nowrap',
          }}>
          ✦ Open to Work
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: 'absolute', right: '2rem', bottom: '2.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '.5rem',
          letterSpacing: '.2em', color: 'var(--text-faint)',
          textTransform: 'uppercase', writingMode: 'vertical-rl',
        }}>scroll</span>
        <motion.div
          animate={{ scaleY: [1, .4, 1], opacity: [.5, 1, .5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 1, height: 44, background: 'linear-gradient(180deg,var(--violet),transparent)' }} />
      </motion.div>
    </section>
  )
}
