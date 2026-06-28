'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ACCENT = '#2EC4C6'

function Rings() {
  const group = useRef<THREE.Group>(null)
  const r1 = useRef<THREE.Mesh>(null)
  const r2 = useRef<THREE.Mesh>(null)
  const r3 = useRef<THREE.Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    if (r1.current) {
      r1.current.rotation.x += d * 0.25
      r1.current.rotation.y += d * 0.35
    }
    if (r2.current) {
      r2.current.rotation.x -= d * 0.4
      r2.current.rotation.z += d * 0.3
    }
    if (r3.current) {
      r3.current.rotation.y += d * 0.2
      r3.current.rotation.z -= d * 0.25
    }
    if (group.current) {
      // Sanfter Parallax-Tilt zur Mausposition
      group.current.rotation.y +=
        (mouse.current.x * 0.5 - group.current.rotation.y) * 0.05
      group.current.rotation.x +=
        (mouse.current.y * 0.3 - group.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={group}>
      <mesh ref={r1}>
        <torusGeometry args={[2.2, 0.06, 18, 140]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.5}
          roughness={0.25}
          metalness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.65, 0.045, 18, 140]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.2}
          roughness={0.25}
          metalness={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={r3} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[2.75, 0.035, 18, 160]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.0}
          roughness={0.25}
          metalness={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  )
}

export default function HeroTorus() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={60} color={ACCENT} />
      <pointLight position={[-5, -3, 2]} intensity={25} color="#ffffff" />
      <Rings />
    </Canvas>
  )
}
