import { Sun }           from './Sun'
import { Planet }        from './Planet'
import { Moon }          from './Moon'
import { OrbitalPath }   from './OrbitalPath'
import { PLANET_CONFIGS, PLANET_IDS } from './planetData'
import { useSceneStore } from '../../store/useSceneStore'
import type { PlanetName } from '../../engines/orbital'

export function SolarSystem() {
  const setSelectedObject = useSceneStore((s) => s.setSelectedObject)
  const setCameraTarget   = useSceneStore((s) => s.setCameraTarget)

  function handleSelect(id: string) {
    setSelectedObject(id as PlanetName)
    setCameraTarget(id as PlanetName)
  }

  return (
    <group>
      <Sun radius={6} />

      {PLANET_IDS.map((id) => (
        <OrbitalPath key={id} planet={id as PlanetName} scaleAU={28} />
      ))}

      {PLANET_IDS.map((id) => (
        <Planet
          key={id}
          planetId={id as PlanetName}
          config={PLANET_CONFIGS[id]}
          onSelect={handleSelect}
        />
      ))}

      <Moon />
    </group>
  )
}