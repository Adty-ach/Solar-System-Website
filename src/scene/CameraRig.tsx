import { useRef, useEffect }  from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls }      from '@react-three/drei'
import * as THREE             from 'three'
import { useSceneStore }      from '../store/useSceneStore'
import { useSimStore }        from '../store/useSimStore'
import { calculatePlanetPosition } from '../engines/orbital'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { PlanetName }    from '../engines/orbital'

type CelestialObjectId =
  | 'sun' | 'moon'
  | 'mercury' | 'venus' | 'earth' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune'

const FOCUS_OFFSETS: Record<CelestialObjectId, number> = {
  sun:     30,
  moon:    8,
  mercury: 8,
  venus:   10,
  earth:   12,
  mars:    10,
  jupiter: 28,
  saturn:  26,
  uranus:  20,
  neptune: 20,
}

const PLANET_NAMES: PlanetName[] = [
  'mercury','venus','earth','mars',
  'jupiter','saturn','uranus','neptune',
]

const DEFAULT_CAM_POS = new THREE.Vector3(0, 120, 280)
const DEFAULT_TARGET  = new THREE.Vector3(0, 0, 0)
const LERP_SPEED      = 0.04
const SCALE           = 28

function getObjectPosition(
  id: CelestialObjectId,
  simTime: Date,
): THREE.Vector3 {
  if (id === 'sun') {
    return new THREE.Vector3(0, 0, 0)
  }

  if (id === 'moon') {
    const earthPos = calculatePlanetPosition('earth', simTime, SCALE)
    const days     = simTime.getTime() / 86_400_000
    const angle    = (days / 27.3) * Math.PI * 2
    return new THREE.Vector3(
      earthPos.x + 4.5 * Math.cos(angle),
      0,
      earthPos.z + 4.5 * Math.sin(angle),
    )
  }

  if (PLANET_NAMES.includes(id as PlanetName)) {
    const pos = calculatePlanetPosition(id as PlanetName, simTime, SCALE)
    return new THREE.Vector3(pos.x, 0, pos.z)
  }

  return new THREE.Vector3(0, 0, 0)
}

export function CameraRig() {
  const controlsRef  = useRef<OrbitControlsImpl>(null)
  const { camera }   = useThree()

  const targetPos    = useRef(new THREE.Vector3(0, 120, 280))
  const isAnimating  = useRef(false)

  const cameraTarget = useSceneStore((s) => s.cameraTarget)
  const cameraMode   = useSceneStore((s) => s.cameraMode)
  const triggerReset = useSceneStore((s) => s.triggerReset)
  const triggerFocus = useSceneStore((s) => s.triggerFocus)
  const simTime      = useSimStore((s) => s.simTime)

  // ── Reset ──────────────────────────────────────────────────
  useEffect(() => {
    if (triggerReset === 0) return
    targetPos.current.copy(DEFAULT_CAM_POS)
    isAnimating.current = true
    if (controlsRef.current) {
      controlsRef.current.target.copy(DEFAULT_TARGET)
    }
  }, [triggerReset])

  // ── Focus ──────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraTarget || cameraMode !== 'focus') return

    const objPos = getObjectPosition(cameraTarget as CelestialObjectId, simTime)
    const offset = FOCUS_OFFSETS[cameraTarget as CelestialObjectId] ?? 15
    const camOffset = new THREE.Vector3(offset, offset * 0.5, offset)

    targetPos.current.copy(objPos).add(camOffset)
    isAnimating.current = true

    if (controlsRef.current) {
      controlsRef.current.target.copy(objPos)
    }
  }, [triggerFocus, cameraTarget, cameraMode])

  // ── Frame loop ─────────────────────────────────────────────
  useFrame(() => {
    if (!controlsRef.current) return

    // Follow mode
    if (cameraMode === 'follow' && cameraTarget) {
      const objPos = getObjectPosition(cameraTarget as CelestialObjectId, simTime)
      controlsRef.current.target.lerp(objPos, 0.05)
    }

    // Smooth lerp
    if (isAnimating.current) {
      camera.position.lerp(targetPos.current, LERP_SPEED)
      if (camera.position.distanceTo(targetPos.current) < 0.5) {
        isAnimating.current = false
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      enableDamping
      dampingFactor={0.06}
      minDistance={5}
      maxDistance={1800}
      zoomSpeed={1.2}
      rotateSpeed={0.5}
      panSpeed={0.8}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      mouseButtons={{
        LEFT:   0,
        MIDDLE: 1,
        RIGHT:  2,
      }}
    />
  )
}