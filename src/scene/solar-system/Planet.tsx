import { useRef, Suspense }        from 'react'
import { useFrame }                from '@react-three/fiber'
import { Sphere, useTexture }      from '@react-three/drei'
import * as THREE                  from 'three'
import { useSimStore }             from '../../store/useSimStore'
import { useSceneStore }           from '../../store/useSceneStore'
import { calculatePlanetPosition } from '../../engines/orbital'
import type { PlanetName }         from '../../engines/orbital'
import type { PlanetConfig }       from './planetData'
import { useLocationStore } from '../../store/useLocationStore'

function LocationMarker() {
  const lat = useLocationStore((s) => s.latitude)
  const lon = useLocationStore((s) => s.longitude)

  const phi   = (90 - lat)  * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const r     = 1.03

  const x = -r * Math.sin(phi) * Math.cos(theta)
  const y =  r * Math.cos(phi)
  const z =  r * Math.sin(phi) * Math.sin(theta)

  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#FF4444" />
      </mesh>
    </group>
  )
}

interface PlanetProps {
  planetId: PlanetName
  config:   PlanetConfig
  onSelect: (id: string) => void
}

function PlanetFallback({ radius, color }: { radius: number; color: string }) {
  return (
    <Sphere args={[radius, 32, 32]}>
      <meshStandardMaterial color={color} roughness={0.8} />
    </Sphere>
  )
}

function EarthMesh({ radius }: { radius: number }) {
  const cloudRef = useRef<THREE.Mesh>(null)
  const [earthTex, cloudTex, nightTex] = useTexture([
    '/textures/earth.jpg',
    '/textures/earth_clouds.jpg',
    '/textures/earth_night.jpg',
  ])

  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.012
  })

  return (
    <>
      {/* Earth surface */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial
          map={earthTex}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Night layer */}
      <mesh>
        <sphereGeometry args={[radius * 1.001, 64, 64]} />
        <meshBasicMaterial
          map={nightTex}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

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

      {/* Location marker — scaled to planet radius */}
      <group scale={[radius, radius, radius]}>
        <LocationMarker />
      </group>
    </>
  )
}

function SaturnRing({ radius }: { radius: number }) {
  const ringTex = useTexture('/textures/saturn_ring.png')
  return (
    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.4, 128]} />
      <meshBasicMaterial map={ringTex} transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function SaturnRingFallback({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.4, 128]} />
      <meshBasicMaterial color="#C8B870" transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

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
      <meshStandardMaterial map={tex} roughness={roughness} metalness={metalness} />
    </Sphere>
  )
}

export function Planet({ planetId, config, onSelect }: PlanetProps) {
  const groupRef     = useRef<THREE.Group>(null)
  const meshRef      = useRef<THREE.Group>(null)
  const simTime      = useSimStore((s) => s.simTime)
  const setCamMode   = useSceneStore((s) => s.setCameraMode)
  const focusTarget  = useSceneStore((s) => s.focusTarget)

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
          setCamMode('focus')
          focusTarget()
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={()  => { document.body.style.cursor = 'auto'    }}
      >
        {planetId === 'earth' ? (
          <Suspense fallback={<PlanetFallback radius={config.radius} color={config.color} />}>
            <EarthMesh radius={config.radius} />
          </Suspense>
        ) : (
          <Suspense fallback={<PlanetFallback radius={config.radius} color={config.color} />}>
            <PlanetMesh
              radius={config.radius}
              texturePath={`/textures/${planetId}.jpg`}
              roughness={config.roughness}
              metalness={config.metalness}
            />
          </Suspense>
        )}

        {planetId === 'saturn' && (
          <Suspense fallback={<SaturnRingFallback radius={config.radius} />}>
            <SaturnRing radius={config.radius} />
          </Suspense>
        )}
      </group>
    </group>
  )
}