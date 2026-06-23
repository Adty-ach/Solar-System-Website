import { Canvas }        from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense }      from 'react'
import { StarField }     from './environment/StarField'
import { SolarSystem }   from './solar-system/SolarSystem'
import { MilkyWay }      from './environment/MilkyWay'

function SceneFallback() {
  return null
}

export function SceneRoot() {
  return (
    <Canvas
      camera={{
        position: [0, 120, 280],
        fov:      55,
        near:     0.1,
        far:      2000,
      }}
      gl={{
        antialias:           true,
        toneMapping:         1,
        toneMappingExposure: 1.2,
      }}
      style={{ background: '#000005' }}
    >
      {/* Base ambient — mencegah sisi gelap pure black */}
      <ambientLight intensity={0.25} color="#334466" />

      {/* Hemisphere — langit biru gelap, tanah hitam */}
      <hemisphereLight
        args={['#223366', '#000000', 0.4]}
      />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.06}
        minDistance={15}
        maxDistance={900}
        zoomSpeed={0.8}
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

      <StarField count={8000} radius={800} />

      <Suspense fallback={<SceneFallback />}>
        <MilkyWay />
        <SolarSystem />
      </Suspense>

      <fog attach="fog" args={['#000010', 600, 1600]} />
    </Canvas>
  )
}