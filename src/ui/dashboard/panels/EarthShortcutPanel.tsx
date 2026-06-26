import { useSceneStore } from '../../../store/useSceneStore'
import { useUIStore }    from '../../../store/useUIStore'

export function EarthShortcutPanel() {
  const setSelected     = useSceneStore((s) => s.setSelectedObject)
  const setCameraTarget = useSceneStore((s) => s.setCameraTarget)
  const setCamMode      = useSceneStore((s) => s.setCameraMode)
  const focusTarget     = useSceneStore((s) => s.focusTarget)
  const closeDashboard  = useUIStore((s) => s.closeDashboard)

  function openEarthObservatory() {
    setSelected('earth')
    setCameraTarget('earth')
    setCamMode('focus')
    focusTarget()
    closeDashboard()
    // Earth Observatory opens automatically in App.tsx
    // when selectedObject === 'earth'
  }

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>
      <div style={{
        textAlign:    'center',
        padding:      '20px 0 24px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌍</div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#4A90D9', marginBottom: '8px' }}>
          Earth Observatory
        </div>
        <div style={{
          fontSize:   '12px',
          color:      'rgba(255,255,255,0.5)',
          lineHeight: '1.6',
          marginBottom: '20px',
        }}>
          Real-time solar data, sunrise/sunset, moon phase,
          and GPS location tracking.
        </div>
        <button
          onClick={openEarthObservatory}
          style={{
            padding:      '10px 28px',
            borderRadius: '10px',
            background:   'rgba(74,144,217,0.2)',
            border:       '1px solid rgba(74,144,217,0.5)',
            color:        '#4A90D9',
            cursor:       'pointer',
            fontSize:     '13px',
            fontWeight:   600,
            fontFamily:   'system-ui',
          }}
        >
          Open Earth Observatory →
        </button>
      </div>

      <div style={{
        padding:      '14px',
        borderRadius: '10px',
        background:   'rgba(74,144,217,0.06)',
        border:       '1px solid rgba(74,144,217,0.15)',
      }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
          What you'll see
        </div>
        {[
          'UTC and local time',
          'GPS coordinates and country',
          'Current season',
          'Solar elevation and azimuth',
          'Sunrise, solar noon, sunset',
          'Moon phase and illumination',
        ].map((item) => (
          <div key={item} style={{
            fontSize:     '11px',
            color:        'rgba(255,255,255,0.5)',
            padding:      '3px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            · {item}
          </div>
        ))}
      </div>
    </div>
  )
}