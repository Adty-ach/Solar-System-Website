import { useMemo } from 'react'
import * as THREE  from 'three'
import { PLANET_DATA } from '../../engines/orbital'
import type { PlanetName } from '../../engines/orbital'

interface OrbitalPathProps {
  planet:   PlanetName
  scaleAU?: number
  opacity?: number
}

export function OrbitalPath({
  planet,
  scaleAU = 28,
  opacity = 0.18,
}: OrbitalPathProps) {

  const line = useMemo(() => {
    const data     = PLANET_DATA[planet]
    const segments = 128
    const pts: THREE.Vector3[] = []

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const r =
        (data.semiMajorAxis * (1 - data.eccentricity ** 2)) /
        (1 + data.eccentricity * Math.cos(angle))

      pts.push(new THREE.Vector3(
        r * Math.cos(angle) * scaleAU,
        0,
        r * Math.sin(angle) * scaleAU,
      ))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(pts)
    const material = new THREE.LineBasicMaterial({
      color:       '#4A6FA5',
      transparent: true,
      opacity,
      depthWrite:  false,
    })

    return new THREE.Line(geometry, material)
  }, [planet, scaleAU, opacity])

  return <primitive object={line} />
}