import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Stars ── */
function Stars({ count = 4000 }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - .5) * 120
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])

  return (
    <points geometry={geo}>
      <pointsMaterial size={.06} color="#a0d8ff" transparent opacity={.65} sizeAttenuation />
    </points>
  )
}

/* ── Hero torus knot ── */
function HeroKnot() {
  const ref = useRef()
  useFrame((_, d) => {
    ref.current.rotation.x += d * .12
    ref.current.rotation.y += d * .18
  })
  return (
    <mesh ref={ref} position={[2.5, -.5, -4]}>
      <torusKnotGeometry args={[1.6, .5, 200, 32, 2, 3]} />
      <meshStandardMaterial
        color="#001a44" roughness={.08} metalness={.95}
        emissive="#003399" emissiveIntensity={.4}
        wireframe={false}
      />
    </mesh>
  )
}

/* ── Wire ring ── */
function Ring({ radius, speed, tilt }) {
  const ref = useRef()
  useFrame((s) => {
    ref.current.rotation.z = s.clock.elapsedTime * speed
    ref.current.rotation.x = tilt
  })
  return (
    <mesh ref={ref} position={[2.5, -.5, -4]}>
      <torusGeometry args={[radius, .015, 4, 160]} />
      <meshBasicMaterial color="#0044bb" transparent opacity={.35} />
    </mesh>
  )
}

/* ── Floating debris ── */
function Debris({ count = 18 }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    pos: [(Math.random() - .5) * 24, (Math.random() - .5) * 14, (Math.random() - .5) * 8 - 3],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    spd: .1 + Math.random() * .25,
    size: .06 + Math.random() * .18,
    type: Math.floor(Math.random() * 3),
  })), [count])

  return items.map((it, i) => {
    const Ref = useRef()
    return (
      <mesh key={i} ref={Ref} position={it.pos} rotation={it.rot}>
        {it.type === 0 && <octahedronGeometry args={[it.size, 0]} />}
        {it.type === 1 && <tetrahedronGeometry args={[it.size, 0]} />}
        {it.type === 2 && <icosahedronGeometry args={[it.size, 0]} />}
        <meshStandardMaterial color="#002266" emissive="#001133" emissiveIntensity={.6} metalness={.9} roughness={.1} />
      </mesh>
    )
  })
}

/* ── Scene camera mouse parallax ── */
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useRef(() => {
    const fn = e => {
      mouse.current.x = (e.clientX / window.innerWidth  - .5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - .5) * 2
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  })

  // inline mousemove listener via useFrame
  useFrame(() => {
    // lerp
    current.current.x += (mouse.current.x - current.current.x) * .025
    current.current.y += (mouse.current.y - current.current.y) * .025
    camera.position.x = current.current.x * .8
    camera.position.y = -current.current.y * .5 + 0
  })

  return null
}

// Need to capture mouse outside React tree
let _mx = 0, _my = 0
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', e => {
    _mx = (e.clientX / window.innerWidth  - .5) * 2
    _my = (e.clientY / window.innerHeight - .5) * 2
  })
}

function CamRig2() {
  const { camera } = useThree()
  const cur = useRef({ x: 0, y: 0 })
  useFrame(() => {
    cur.current.x += (_mx - cur.current.x) * .03
    cur.current.y += (_my - cur.current.y) * .03
    camera.position.x = cur.current.x * .9
    camera.position.y = -cur.current.y * .6
  })
  return null
}

export default function SpaceBG() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      background: 'radial-gradient(ellipse 80% 80% at 60% 50%, #001028 0%, #020408 70%)',
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 70 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <fog attach="fog" args={['#020408', 18, 55]} />
        <ambientLight intensity={.15} color="#001833" />
        <pointLight position={[0, 4, 4]}  intensity={6}  color="#0066ff" distance={22} />
        <pointLight position={[-5,-3, 2]} intensity={3}  color="#00c8ff" distance={18} />
        <pointLight position={[6,  2, 0]} intensity={2}  color="#0033cc" distance={16} />

        <Stars />
        <HeroKnot />
        <Ring radius={2.5} speed={.4}  tilt={Math.PI / 5} />
        <Ring radius={3.2} speed={-.25} tilt={Math.PI / 3} />
        <Debris />
        <CamRig2 />
      </Canvas>
    </div>
  )
}
