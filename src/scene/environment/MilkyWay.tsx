import { useTexture } from '@react-three/drei'
import * as THREE     from 'three'

function MilkyWayInner() {
  const texture = useTexture('/textures/milkyway.png')

  texture.mapping = THREE.EquirectangularReflectionMapping

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[900, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  )
}

export function MilkyWay() {
  return <MilkyWayInner />
}