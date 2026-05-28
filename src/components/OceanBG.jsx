import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Single Jellyfish ── */
function Jellyfish({ position, speed, phase, scale }) {
  const groupRef = useRef()
  const bellRef  = useRef()
  const tentRefs = useRef([])

  useFrame((s) => {
    const t = s.clock.elapsedTime * speed + phase

    // float up and down
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.6
    groupRef.current.position.x = position[0] + Math.sin(t * 0.3) * 0.4
    groupRef.current.rotation.y = t * 0.2

    // bell pulse
    const pulse = 1 + Math.sin(t * 2.5) * 0.08
    bellRef.current.scale.set(pulse, 1, pulse)

    // tentacle wave
    tentRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.rotation.x = Math.sin(t * 2 + i * 0.8) * 0.25
        ref.rotation.z = Math.cos(t * 1.5 + i * 0.6) * 0.15
      }
    })
  })

  const tentacleCount = 8
  const tentacles = Array.from({ length: tentacleCount }, (_, i) => {
    const angle = (i / tentacleCount) * Math.PI * 2
    return { angle, x: Math.cos(angle) * 0.18, z: Math.sin(angle) * 0.18 }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Bell (dome) */}
      <mesh ref={bellRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.38, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial
          color="#7b2fff"
          emissive="#5500cc"
          emissiveIntensity={0.6}
          transparent opacity={0.55}
          side={THREE.DoubleSide}
          roughness={0.1} metalness={0.2}
        />
      </mesh>
      {/* Inner glow */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.22, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#cc88ff"
          emissive="#aa55ff"
          emissiveIntensity={1.2}
          transparent opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tentacles */}
      {tentacles.map((t, i) => (
        <mesh
          key={i}
          ref={el => tentRefs.current[i] = el}
          position={[t.x, -0.28, t.z]}
        >
          <cylinderGeometry args={[0.012, 0.004, 0.9 + Math.random() * 0.5, 4]} />
          <meshStandardMaterial
            color="#cc77ff"
            emissive="#9933ff"
            emissiveIntensity={0.8}
            transparent opacity={0.5}
          />
        </mesh>
      ))}
      {/* Point light inside for glow */}
      <pointLight color="#9933ff" intensity={1.2} distance={2.5} />
    </group>
  )
}

/* ── Floating particles (bioluminescent plankton) ── */
function Plankton({ count = 600 }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      pos[i]   = (Math.random() - 0.5) * 30
      pos[i+1] = (Math.random() - 0.5) * 20
      pos[i+2] = (Math.random() - 0.5) * 12
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])

  const ref = useRef()
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.015
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.045} color="#cc99ff" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

/* ── Volumetric light rays ── */
function LightRays() {
  const rays = Array.from({ length: 6 }, (_, i) => ({
    x: (i - 3) * 2.5,
    rot: (Math.random() - 0.5) * 0.3,
  }))
  return (
    <>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 6, -6]} rotation={[0, 0, r.rot]}>
          <cylinderGeometry args={[0.05, 1.8, 14, 6, 1, true]} />
          <meshBasicMaterial color="#6622bb" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  )
}

/* ── Camera parallax ── */
let _mx = 0, _my = 0
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', e => {
    _mx = (e.clientX / window.innerWidth  - 0.5) * 2
    _my = (e.clientY / window.innerHeight - 0.5) * 2
  })
}
function CamRig() {
  const cur = useRef({ x: 0, y: 0 })
  useFrame(({ camera }) => {
    cur.current.x += (_mx - cur.current.x) * 0.025
    cur.current.y += (_my - cur.current.y) * 0.025
    camera.position.x = cur.current.x * 1.2
    camera.position.y = -cur.current.y * 0.7
  })
  return null
}

/* ── Jellyfish data ── */
const JELLIES = [
  { position: [-4,  1, -2], speed: 0.9, phase: 0,    scale: 1.2  },
  { position: [ 3,  2, -3], speed: 0.7, phase: 1.5,  scale: 0.9  },
  { position: [-1, -2, -1], speed: 1.1, phase: 3.0,  scale: 0.75 },
  { position: [ 5, -1, -4], speed: 0.6, phase: 0.8,  scale: 1.0  },
  { position: [-5, -3, -3], speed: 0.8, phase: 2.2,  scale: 0.65 },
  { position: [ 0,  3, -5], speed: 1.0, phase: 4.1,  scale: 1.4  },
  { position: [ 7,  1, -6], speed: 0.5, phase: 1.0,  scale: 0.8  },
  { position: [-7,  0, -5], speed: 0.75,phase: 2.8,  scale: 1.1  },
]

export default function OceanBG() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      background: 'radial-gradient(ellipse 100% 100% at 40% 30%, #0d0025 0%, #050010 60%, #000008 100%)',
    }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 68 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
      >
        <fog attach="fog" args={['#050010', 12, 40]} />
        <ambientLight intensity={0.08} color="#110022" />
        <pointLight position={[0, 8, 0]}   intensity={3}  color="#6600cc" distance={25} />
        <pointLight position={[-6, 2, 2]}  intensity={2}  color="#4400aa" distance={20} />
        <pointLight position={[6, -2, 2]}  intensity={1.5} color="#8833ff" distance={18} />

        <LightRays />
        <Plankton count={800} />
        {JELLIES.map((j, i) => <Jellyfish key={i} {...j} />)}
        <CamRig />
      </Canvas>
    </div>
  )
}
