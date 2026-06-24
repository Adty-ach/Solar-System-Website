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
        position: [0, 80, 200],
        fov:      50,
        near:     0.1,
        far:      3000,
      }}
      gl={{
        antialias:           true,
        toneMapping:         1,
        toneMappingExposure: 1.0,
      }}
      style={{ background: '#000005' }}
    >
      <ambientLight intensity={0.04} color="#223355" />
      <hemisphereLight args={['#112244', '#000000', 0.15]} />

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