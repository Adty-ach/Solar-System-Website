import { useRef, Suspense }   from 'react'
import { useFrame }           from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE             from 'three'
import { useSimStore }        from '../../store/useSimStore'
import { useSceneStore }      from '../../store/useSceneStore'
import { useLocationStore }   from '../../store/useLocationStore'
import { calculatePlanetPosition } from '../../engines/orbital'
import type { PlanetName }    from '../../engines/orbital'
import type { PlanetConfig }  from './planetData'

// ── GMST Earth rotation ───────────────────────────────────────
function calcEarthRotation(date: Date): number {
  const JD = 2440587.5 + date.getTime() / 86_400_000

  // GMST in degrees — IAU formula
  const GMST = (
    280.46061837
    + 360.98564736629 * (JD - 2451545.0)
  )

  // Normalize to 0-360
  const gmstNorm = ((GMST % 360) + 360) % 360

  // Convert to radians
  // Subtract PI/2 to align texture (solarsystemscope offset)
  return (gmstNorm * Math.PI / 180) - Math.PI / 2
}

// ── Location marker ───────────────────────────────────────────
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
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#FF4444" />
      </mesh>
    </group>
  )
}

// ── Earth mesh ────────────────────────────────────────────────
function EarthMesh({ radius }: { radius: number }) {
  const earthRef = useRef<THREE.Group>(null)
  const cloudRef = useRef<THREE.Mesh>(null)
  const simTime  = useSimStore((s) => s.simTime)

  const [earthTex, cloudTex, nightTex] = useTexture([
    '/textures/earth.jpg',
    '/textures/earth_clouds.jpg',
    '/textures/earth_night.jpg',
  ])

  useFrame(() => {
    const rot = calcEarthRotation(simTime)
    if (earthRef.current) {
      earthRef.current.rotation.y = rot
    }
    if (cloudRef.current) {
      // Clouds slightly offset from surface rotation
      cloudRef.current.rotation.y = rot + (simTime.getTime() / 86_400_000) * 0.005
    }
  })

  return (
    <group ref={earthRef}>

      {/* Day surface */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial
          map={earthTex}
          roughness={0.85}
          metalness={0.0}
        />
      </Sphere>

      {/* Night / city lights — additive so only visible on dark side */}
      <mesh>
        <sphereGeometry args={[radius * 1.001, 64, 64]} />
        <meshBasicMaterial
          map={nightTex}
          transparent
          opacity={0.95}
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
          opacity={0.30}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.07, 32, 32]} />
        <meshBasicMaterial
          color="#3366FF"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Location marker — inside Earth group so rotates with it */}
      <group scale={[radius, radius, radius]}>
        <LocationMarker />
      </group>

    </group>
  )
}

// ── Saturn ring ───────────────────────────────────────────────
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

// ── Generic planet ────────────────────────────────────────────
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

function PlanetFallback({ radius, color }: { radius: number; color: string }) {
  return (
    <Sphere args={[radius, 32, 32]}>
      <meshStandardMaterial color={color} roughness={0.8} />
    </Sphere>
  )
}

// ── Main Planet ───────────────────────────────────────────────
interface PlanetProps {
  planetId: PlanetName
  config:   PlanetConfig
  onSelect: (id: string) => void
}

export function Planet({ planetId, config, onSelect }: PlanetProps) {
  const groupRef    = useRef<THREE.Group>(null)
  const meshRef     = useRef<THREE.Group>(null)
  const simTime     = useSimStore((s) => s.simTime)
  const setCamMode  = useSceneStore((s) => s.setCameraMode)
  const focusTarget = useSceneStore((s) => s.focusTarget)

  useFrame(() => {
    if (!groupRef.current) return

    // Position from simTime — deterministic
    const pos = calculatePlanetPosition(planetId, simTime, config.scaleAU)
    groupRef.current.position.set(pos.x, 0, pos.z)

    // Self rotation — Earth handled by EarthMesh
    if (meshRef.current && planetId !== 'earth') {
      const rotAngle = (
        (simTime.getTime() / 86_400_000)
        * Math.PI * 2
        * config.rotationSpeed
      ) % (Math.PI * 2)
      meshRef.current.rotation.y = rotAngle
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