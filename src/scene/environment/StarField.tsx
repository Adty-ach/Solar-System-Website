import { useMemo, useRef } from 'react'
import { useFrame }        from '@react-three/fiber'
import * as THREE          from 'three'

interface StarFieldProps {
  count?:  number
  radius?: number
}

export function StarField({ count = 8000, radius = 800 }: StarFieldProps) {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)
    const color     = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = radius * (0.6 + Math.random() * 0.4)

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const temp = Math.random()
      if      (temp > 0.85) color.setHSL(0.60, 0.8, 0.9)
      else if (temp > 0.60) color.setHSL(0.00, 0.0, 1.0)
      else if (temp > 0.30) color.setHSL(0.12, 0.5, 0.9)
      else                  color.setHSL(0.07, 0.8, 0.8)

      colors[i * 3]     = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() < 0.02
        ? 3.0 + Math.random() * 2.0
        : 0.5 + Math.random() * 1.0
    }

    return { positions, colors, sizes }
  }, [count, radius])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.005
      meshRef.current.rotation.x += delta * 0.001
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes,     1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.9}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        fog={false}
      />
    </points>
  )
}