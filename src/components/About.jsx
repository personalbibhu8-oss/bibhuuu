import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'

function JellyfishOrb() {
  const outer = useRef(), inner = useRef(), ring = useRef()
  useFrame((s, d) => {
    outer.current.rotation.y += d * .4
    outer.current.rotation.x  = Math.sin(s.clock.elapsedTime * .5) * .3
    inner.current.rotation.y -= d * .6
    ring.current.rotation.z  += d * .5
    const pulse = 1 + Math.sin(s.clock.elapsedTime * 2) * .07
    outer.current.scale.set(pulse, 1, pulse)
  })
  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial color="#6622cc" wireframe transparent opacity={.45} emissive="#4400aa" emissiveIntensity={.5} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[.8, 0]} />
        <meshStandardMaterial color="#1a0040" metalness={.9} roughness={.1} emissive="#5500cc" emissiveIntensity={.7} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[1.8, .018, 4, 120]} />
        <meshBasicMaterial color="#9944ff" transparent opacity={.5} />
      </mesh>
      <pointLight color="#9933ff" intensity={2} distance={5} />
    </group>
  )
}

export default function About() {
  const cv = { hidden:{}, visible:{ transition:{ staggerChildren:.12 } } }
  const iv = { hidden:{ opacity:0, y:30 }, visible:{ opacity:1, y:0, transition:{ duration:.7, ease:[.16,1,.3,1] } } }

  const skills = [
    { label:'Backend',  val:'Core Java · Servlets · JSP · Apache Tomcat · JDBC' },
    { label:'Database', val:'MySQL · SQL · Schema Design · CRUD' },
    { label:'Frontend', val:'HTML5 · CSS3 · JavaScript · Responsive' },
    { label:'Tools',    val:'Eclipse IDE · Git · Dialogflow · FastAPI' },
  ]

  return (
    <section id="about">
      <div style={{
        padding:'8rem 3rem', display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:'5rem', alignItems:'center', maxWidth:1100, margin:'0 auto',
      }}>
        <motion.div style={{
          height:380,
          background:'radial-gradient(ellipse at 50% 50%,rgba(100,20,200,.1) 0%,transparent 70%)',
          border:'1px solid rgba(153,68,255,.1)', borderRadius:12,
        }} initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.9}}>
          <Canvas camera={{ position:[0,0,4.5], fov:55 }} gl={{ alpha:true, antialias:true }}>
            <ambientLight intensity={.15} />
            <pointLight position={[3,4,3]} intensity={8} color="#7722ff" />
            <pointLight position={[-3,-2,2]} intensity={4} color="#cc55ff" />
            <JellyfishOrb />
          </Canvas>
        </motion.div>

        <motion.div variants={cv} initial="hidden" whileInView="visible" viewport={{once:true}}>
          <motion.span className="sec-label" variants={iv}>About</motion.span>
          <motion.h2 variants={iv}>Engineering<br/><em style={{fontStyle:'italic',color:'var(--violet)'}}>with purpose.</em></motion.h2>
          <motion.p variants={iv} style={{ color:'var(--text-dim)', fontSize:'.78rem', lineHeight:1.95, marginTop:'.8rem' }}>
            I'm <strong style={{color:'var(--text)'}}>Bibhudutta Mohanty</strong>, a final-year BCA student at
            Sage University, Indore (graduating 2026), currently interning as a
            Java Full Stack developer at <strong style={{color:'var(--text)'}}>JSpiders Training Institute, Bengaluru.</strong>
          </motion.p>
          <motion.p variants={iv} style={{ color:'var(--text-dim)', fontSize:'.78rem', lineHeight:1.95, marginTop:'.6rem' }}>
            I build applications that solve genuine problems. I value honesty over buzzword inflation —
            engineering-first: understand the problem, design the system, then execute.
          </motion.p>

          <motion.div variants={cv} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.8rem', marginTop:'2rem' }}>
            {skills.map(sk => (
              <motion.div key={sk.label} variants={iv}
                whileHover={{ borderColor:'rgba(153,68,255,.4)', background:'rgba(153,68,255,.08)' }}
                style={{
                  padding:'.9rem 1.1rem', border:'1px solid rgba(153,68,255,.12)',
                  background:'rgba(153,68,255,.04)', borderRadius:6,
                }}>
                <div style={{ fontSize:'.55rem', letterSpacing:'.15em', color:'var(--violet)', textTransform:'uppercase', marginBottom:'.2rem' }}>{sk.label}</div>
                <div style={{ fontSize:'.68rem', color:'var(--text-dim)' }}>{sk.val}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
