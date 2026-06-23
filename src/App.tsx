import React        from 'react'
import { SceneRoot } from './scene/SceneRoot'
import { TimeControls } from './ui/TimeControls'
import { InfoPanel }    from './ui/InfoPanel'

export default function App(): React.ReactElement {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>

      <SceneRoot />

      {/* Info panel — klik planet */}
      <InfoPanel />

      {/* Time controls */}
      <div style={{
        position:  'fixed',
        bottom:    '24px',
        left:      '50%',
        transform: 'translateX(-50%)',
        zIndex:    10,
      }}>
        <TimeControls />
      </div>

    </div>
  )
}