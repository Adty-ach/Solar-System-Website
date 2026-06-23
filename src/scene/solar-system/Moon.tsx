import { useRef }             from 'react'
import { useFrame }           from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE             from 'three'
import { useSimStore }             from '../../store/useSimStore'
import { useSceneStore }           from '../../store/useSceneStore'
import { calculatePlanetPosition } from '../../engines/orbital'

const MOON_ORBIT_RADIUS = 4.5
const MOON_RADIUS       = 0.55

function getMoonPhase(date: Date): { name: string; illumination: number } {
  // Days since known new moon (Jan 6, 2000)
  const knownNewMoon = new Date('2000-01-06T18:14:00Z')
  const daysSince    = (date.getTime() - knownNewMoon.getTime()) / 86_400_000
  const cycle        = 29.53058867
  const progress     = ((daysSince % cycle) + cycle) % cycle
  const illumination = Math.round(50 - 50 * Math.cos((progress / cycle) * Math.PI * 2))

  let name: string
  if      (progress < 1.85)  name = 'New Moon'
  else if (progress < 7.38)  name = 'Waxing Crescent'
  else if (progress < 9.22)  name = 'First Quarter'
  else if (progress < 14.77) name = 'Waxing Gibbous'
  else if (progress < 16.61) name = 'Full Moon'
  else if (progress < 22.15) name = 'Waning Gibbous'
  else if (progress < 23.99) name = 'Last Quarter'
  else                       name = 'Waning Crescent'

  return { name, illumination }
}

export function Moon() {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef  = useRef<THREE.Mesh>(null)
  const simTime  = useSimStore((s) => s.simTime)
  const setSelected     = useSceneStore((s) => s.setSelectedObject)
  const setCameraTarget = useSceneStore((s) => s.setCameraTarget)

  const moonTex = useTexture('/textures/moon.jpg')

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const earthPos = calculatePlanetPosition('earth', simTime, 28)
    const days     = simTime.getTime() / 86_400_000
    const angle    = (days / 27.3) * Math.PI * 2

    groupRef.current.position.set(
      earthPos.x + MOON_ORBIT_RADIUS * Math.cos(angle),
      0,
      earthPos.z + MOON_ORBIT_RADIUS * Math.sin(angle),
    )
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.002
  })

  function handleClick(e: any) {
    e.stopPropagation()
    setSelected('moon')
    setCameraTarget('moon')
  }

  return (
    <group ref={groupRef}>
      <Sphere
        ref={meshRef}
        args={[MOON_RADIUS, 32, 32]}
        onClick={handleClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={()  => { document.body.style.cursor = 'auto'    }}
      >
        <meshStandardMaterial map={moonTex} roughness={0.95} metalness={0.0} />
      </Sphere>
    </group>
  )
}

export { getMoonPhase }