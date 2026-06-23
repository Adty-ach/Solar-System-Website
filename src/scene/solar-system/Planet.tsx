import { useRef, Suspense }        from 'react'
import { useFrame }                from '@react-three/fiber'
import { Sphere, useTexture }      from '@react-three/drei'
import * as THREE                  from 'three'
import { useSimStore }             from '../../store/useSimStore'
import { calculatePlanetPosition } from '../../engines/orbital'
import type { PlanetName }         from '../../engines/orbital'
import type { PlanetConfig }       from './planetData'

interface PlanetProps {
  planetId: PlanetName
  config:   PlanetConfig
  onSelect: (id: string) => void
}

// ── Fallback warna solid saat texture loading ─────────────────
function PlanetFallback({ radius, color }: { radius: number; color: string }) {
  return (
    <Sphere args={[radius, 32, 32]}>
      <meshStandardMaterial color={color} roughness={0.8} />
    </Sphere>
  )
}

// ── Earth dengan cloud layer ──────────────────────────────────
function EarthMesh({ radius }: { radius: number }) {
  const cloudRef = useRef<THREE.Mesh>(null)
  const [earthTex, cloudTex] = useTexture([
    '/textures/earth.jpg',
    '/textures/earth_clouds.jpg',
  ])

  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.012
  })

  return (
    <>
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial
          map={earthTex}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[radius * 1.02, 64, 64]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.06, 32, 32]} />
        <meshBasicMaterial
          color="#4488FF"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

// ── Saturn ring dengan texture ────────────────────────────────
function SaturnRing({ radius }: { radius: number }) {
  const ringTex = useTexture('/textures/saturn_ring.png')
  return (
    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.4, 128]} />
      <meshBasicMaterial
        map={ringTex}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ── Saturn ring fallback ──────────────────────────────────────
function SaturnRingFallback({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.4, 128]} />
      <meshBasicMaterial
        color="#C8B870"
        transparent
        opacity={0.55}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ── Generic planet dengan texture ────────────────────────────
function PlanetMesh({
  radius,
  texturePath,
  roughness,
  metalness,
}: {
  radius:      number
  texturePath: string
  roughness:   number
  metalness:   number
}) {
  const tex = useTexture(texturePath)
  return (
    <Sphere args={[radius, 64, 64]}>
      <meshStandardMaterial
        map={tex}
        roughness={roughness}
        metalness={metalness}
      />
    </Sphere>
  )
}

// ── Main Planet component ─────────────────────────────────────
export function Planet({ planetId, config, onSelect }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef  = useRef<THREE.Group>(null)
  const simTime  = useSimStore((s) => s.simTime)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const pos = calculatePlanetPosition(planetId, simTime, config.scaleAU)
    groupRef.current.position.set(pos.x, 0, pos.z)
    if (meshRef.current) {
      meshRef.current.rotation.y += config.rotationSpeed * delta
    }
  })

  return (
    <group ref={groupRef}>
      <group
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(config.id)
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={()  => { document.body.style.cursor = 'auto'    }}
      >
        {/* Earth pakai komponen khusus dengan clouds */}
        {planetId === 'earth' ? (
          <Suspense fallback={
            <PlanetFallback radius={config.radius} color={config.color} />
          }>
            <EarthMesh radius={config.radius} />
          </Suspense>
        ) : (
          <Suspense fallback={
            <PlanetFallback radius={config.radius} color={config.color} />
          }>
            <PlanetMesh
              radius={config.radius}
              texturePath={`/textures/${planetId}.jpg`}
              roughness={config.roughness}
              metalness={config.metalness}
            />
          </Suspense>
        )}

        {/* Saturn ring */}
        {planetId === 'saturn' && (
          <Suspense fallback={
            <SaturnRingFallback radius={config.radius} />
          }>
            <SaturnRing radius={config.radius} />
          </Suspense>
        )}
      </group>
    </group>
  )
}