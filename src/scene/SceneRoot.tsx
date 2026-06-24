import { Canvas }    from '@react-three/fiber'
import { Suspense }  from 'react'
import { StarField } from './environment/StarField'
import { SolarSystem } from './solar-system/SolarSystem'
import { MilkyWay }  from './environment/MilkyWay'
import { CameraRig } from './CameraRig'

export function SceneRoot() {
  return (
    <Canvas
      camera={{
        position: [0, 120, 280],
        fov:      55,
        near:     0.1,
        far:      3000,        // increased for Neptune
      }}
      gl={{
        antialias:           true,
        toneMapping:         1,
        toneMappingExposure: 1.2,
      }}
      style={{ background: '#000005' }}
    >
      <ambientLight intensity={0.25} color="#334466" />
      <hemisphereLight args={['#223366', '#000000', 0.4]} />

      {/* CameraRig replaces raw OrbitControls */}
      <CameraRig />

      <StarField count={8000} radius={800} />

      <Suspense fallback={null}>
        <MilkyWay />
        <SolarSystem />
      </Suspense>

      <fog attach="fog" args={['#000010', 800, 2400]} />
    </Canvas>
  )
}