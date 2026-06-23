import { useRef }             from 'react'
import { useFrame }           from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE             from 'three'
import { useSceneStore }      from '../../store/useSceneStore'

interface SunProps {
  radius?: number
}

export function Sun({ radius = 6 }: SunProps) {
  const coronaRef  = useRef<THREE.Mesh>(null)
  const corona2Ref = useRef<THREE.Mesh>(null)
  const glowRef    = useRef<THREE.Mesh>(null)
  const meshRef    = useRef<THREE.Mesh>(null)

  const sunTex         = useTexture('/textures/sun.jpg')
  const setSelected    = useSceneStore((s) => s.setSelectedObject)
  const setCameraTarget = useSceneStore((s) => s.setCameraTarget)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (coronaRef.current) {
      coronaRef.current.rotation.y =  t * 0.05
      coronaRef.current.rotation.z =  t * 0.03
    }
    if (corona2Ref.current) {
      corona2Ref.current.rotation.y = -t * 0.04
      corona2Ref.current.rotation.z =  t * 0.02
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + 0.04 * Math.sin(t * 1.5))
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0008
    }
  })

  function handleClick(e: any) {
    e.stopPropagation()
    setSelected('sun')
    setCameraTarget('sun')
  }

  return (
    <group>
      <pointLight position={[0,0,0]} intensity={12} distance={1600} decay={0.8} color="#FFF6E0" />
      <pointLight position={[0,0,0]} intensity={2}  distance={800}  decay={0.5} color="#FFD580" />

      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 2.8, 32, 32]} />
        <meshBasicMaterial color="#FF6600" transparent opacity={0.04} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[radius * 1.8, 32, 32]} />
        <meshBasicMaterial color="#FF9900" transparent opacity={0.07} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.25, 32, 32]} />
        <meshBasicMaterial color="#FFD000" transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh ref={corona2Ref}>
        <sphereGeometry args={[radius * 1.15, 32, 32]} />
        <meshBasicMaterial color="#FF8800" transparent opacity={0.10} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <Sphere
        ref={meshRef}
        args={[radius, 64, 64]}
        onClick={handleClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={()  => { document.body.style.cursor = 'auto'    }}
      >
        <meshStandardMaterial
          map={sunTex}
          emissive="#FF4400"
          emissiveIntensity={1.2}
          emissiveMap={sunTex}
          roughness={0.8}
          metalness={0.0}
        />
      </Sphere>
    </group>
  )
}