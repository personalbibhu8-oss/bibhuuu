import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

const SKILLS = [
  { name:'Core Java',      shape:'box',  color:'#8833ff', em:'#4400bb', pos:[-3.2, 1.4,  0]  },
  { name:'MySQL',          shape:'cyl',  color:'#cc55ff', em:'#773399', pos:[ -.6, 2.0, -.4] },
  { name:'JDBC',           shape:'oct',  color:'#9944ff', em:'#552299', pos:[ 2.8, 1.6, -.2] },
  { name:'Apache Tomcat',  shape:'icos', color:'#bb44ff', em:'#661188', pos:[ 3.6, -.4,  .2] },
  { name:'Git',            shape:'tor',  color:'#7722ee', em:'#440099', pos:[ 2.0,-1.9,  .1] },
  { name:'HTML/CSS/JS',    shape:'box',  color:'#dd88ff', em:'#883388', pos:[ -.4,-2.0,  .3] },
  { name:'Servlets · JSP', shape:'tet',  color:'#aa44ee', em:'#551177', pos:[-3.0, -.8, -.2] },
  { name:'Dialogflow',     shape:'oct',  color:'#cc66ff', em:'#774499', pos:[-1.4,  .2,  .8] },
]

function SkillMesh({ skill, index, onHover }) {
  const meshRef = useRef()
  const wireRef = useRef()
  const { size, camera } = useThree()
  const [hov, setHov] = useState(false)

  useFrame((s, d) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += d * .5
    meshRef.current.rotation.y += d * .7
    meshRef.current.position.y = skill.pos[1] + Math.sin(s.clock.elapsedTime + index * 1.1) * .15
    if (wireRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation)
      wireRef.current.position.y = meshRef.current.position.y
    }
  })

  const getScreenPos = () => {
    if (!meshRef.current) return { x: 0, y: 0 }
    const pos = meshRef.current.position.clone()
    pos.project(camera)
    return {
      x: (pos.x * 0.5 + 0.5) * size.width,
      y: (-pos.y * 0.5 + 0.5) * size.height,
    }
  }

  const sc = hov ? 1.35 : 1.0
  const geo = {
    box:  <boxGeometry args={[.65,.65,.65]} />,
    cyl:  <cylinderGeometry args={[.35,.35,.65,8]} />,
    oct:  <octahedronGeometry args={[.44,0]} />,
    icos: <icosahedronGeometry args={[.41,0]} />,
    tor:  <torusGeometry args={[.33,.13,10,30]} />,
    tet:  <tetrahedronGeometry args={[.5,0]} />,
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={skill.pos}
        scale={sc}
        onPointerOver={e => {
          e.stopPropagation()
          setHov(true)
          onHover({ name: skill.name, ...getScreenPos() })
        }}
        onPointerOut={() => {
          setHov(false)
          onHover(null)
        }}
      >
        {geo[skill.shape]}
        <meshStandardMaterial
          color={skill.color} roughness={.1} metalness={.85}
          emissive={skill.em} emissiveIntensity={hov ? .8 : .35}
        />
      </mesh>
      <mesh ref={wireRef} position={skill.pos} scale={sc * 1.18}>
        {geo[skill.shape]}
        <meshStandardMaterial color={skill.color} wireframe transparent opacity={hov ? .4 : .15} />
      </mesh>
    </group>
  )
}

function Lines() {
  const pairs = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,7],[7,4]]
  return pairs.map((p, i) => (
    <line key={i}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2}
          array={new Float32Array([...SKILLS[p[0]].pos, ...SKILLS[p[1]].pos])} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#440088" transparent opacity={.3} />
    </line>
  ))
}

export default function Skills() {
  const [tooltip, setTooltip] = useState(null)

  return (
    <section id="skills" style={{ padding:'7rem 3rem', position:'relative', zIndex:10 }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <motion.span className="sec-label"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}}>
          Skills
        </motion.span>
        <motion.h2
          initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,delay:.1}}>
          Tools I Actually Know
        </motion.h2>
        <motion.p style={{ fontSize:'.72rem', color:'var(--text-faint)', marginTop:'.5rem', marginBottom:'2.5rem', lineHeight:1.8 }}
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,delay:.2}}>
          Hover the shapes — each one is a real tool in my stack.
        </motion.p>

        <motion.div
          style={{
            height: 420,
            border: '1px solid rgba(153,68,255,.1)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 50%,rgba(80,0,160,.08) 0%,transparent 70%)',
            position: 'relative',
          }}
          initial={{opacity:0,scale:.96}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.9,delay:.2}}
        >
          <Canvas camera={{ position:[0,0,8.5], fov:65 }} gl={{ alpha:true, antialias:true }}>
            <ambientLight intensity={.3} color="#1a0040" />
            <pointLight position={[0,4,5]} intensity={5} color="#9933ff" distance={18} />
            <pointLight position={[-4,-2,3]} intensity={3} color="#6600cc" distance={14} />
            <Lines />
            {SKILLS.map((sk, i) => (
              <SkillMesh key={sk.name} skill={sk} index={i} onHover={setTooltip} />
            ))}
          </Canvas>

          {tooltip && (
            <div style={{
              position: 'absolute',
              left: tooltip.x + 12,
              top: tooltip.y - 36,
              pointerEvents: 'none',
              background: 'rgba(13,0,37,.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(153,68,255,.4)',
              color: 'rgba(204,136,255,.95)',
              fontFamily: 'var(--font-mono)',
              fontSize: '.62rem',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              padding: '.35rem .85rem',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              zIndex: 99,
            }}>
              {tooltip.name}
            </div>
          )}
        </motion.div>

        <motion.div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', marginTop:'1.4rem' }}
          initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,delay:.4}}>
          {SKILLS.map((sk, i) => (
            <motion.span key={sk.name}
              initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.4+i*.06}}
              whileHover={{ background:'rgba(153,68,255,.15)', boxShadow:'0 0 16px rgba(153,68,255,.2)', y:-2 }}
              style={{
                border:'1px solid rgba(153,68,255,.22)', background:'rgba(153,68,255,.06)',
                color:'rgba(204,136,255,.85)', fontSize:'.62rem', letterSpacing:'.1em',
                padding:'.35rem .8rem', borderRadius:3, cursor:'none',
              }}>
              {sk.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}