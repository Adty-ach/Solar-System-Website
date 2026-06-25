import React              from 'react'
import { useState }       from 'react'
import { SceneRoot }      from './scene/SceneRoot'
import { TimeControls }   from './ui/TimeControls'
import { InfoPanel }      from './ui/InfoPanel'
import { PlanetNav }      from './ui/PlanetNav'
import { EarthObservatory }  from './ui/EarthObservatory'
import { PrayerObservatory } from './ui/PrayerObservatory'
import { useAstronomy }   from './hooks/useAstronomy'
import { useUserLocation } from './hooks/useUserLocation'
import { usePrayer }      from './hooks/usePrayer'
import { useSceneStore }  from './store/useSceneStore'
import { DashboardMenu } from './ui/dashboard/DashboardMenu'


function Engines() {
  useAstronomy()
  useUserLocation()
  usePrayer()
  return null
}

function AppUI() {
  const selectedObject  = useSceneStore((s) => s.selectedObject)
  const [showPrayer, setShowPrayer] = useState(false)

  const isEarth = selectedObject === 'earth'

  return (
    <>
      {showPrayer ? (
        <PrayerObservatory onClose={() => setShowPrayer(false)} />
      ) : isEarth ? (
        <EarthObservatory visible />
      ) : (
        <InfoPanel />
      )}

      <button
        onClick={() => setShowPrayer((v) => !v)}
        style={{
          position:       'fixed',
          top:            '16px',
          left:           '50%',
          transform:      'translateX(-50%)',
          zIndex:         30,
          background:     showPrayer
            ? 'rgba(167,139,250,0.3)'
            : 'rgba(5,5,20,0.80)',
          border:         `1px solid ${showPrayer
            ? 'rgba(167,139,250,0.6)'
            : 'rgba(255,255,255,0.1)'}`,
          borderRadius:   '20px',
          color:          showPrayer ? '#A78BFA' : 'rgba(255,255,255,0.6)',
          padding:        '8px 20px',
          cursor:         'pointer',
          fontSize:       '12px',
          fontWeight:     600,
          backdropFilter: 'blur(12px)',
          fontFamily:     'system-ui',
          letterSpacing:  '0.5px',
          transition:     'all 0.2s',
        }}
      >
        🕌 Prayer Observatory
      </button>

      <PlanetNav />

      <DashboardMenu />

      <div style={{
        position:  'fixed',
        bottom:    '24px',
        left:      '50%',
        transform: 'translateX(-50%)',
        zIndex:    10,
      }}>
        <TimeControls />
      </div>
    </>
  )
}

export default function App(): React.ReactElement {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Engines />
      <SceneRoot />
      <AppUI />
    </div>
  )
}