import { useUIStore } from '../../../store/useUIStore'

interface ToggleRowProps {
  label:   string
  desc:    string
  enabled: boolean
  onFlip:  () => void
  future?: boolean
}

function ToggleRow({ label, desc, enabled, onFlip, future }: ToggleRowProps) {
  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '10px 0',
      borderBottom:   '1px solid rgba(255,255,255,0.05)',
      gap:            '12px',
      opacity:        future ? 0.4 : 1,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#E2E8F0', fontFamily: 'system-ui' }}>
            {label}
          </span>
          {future && (
            <span style={{
              fontSize:     '9px',
              padding:      '1px 6px',
              borderRadius: '4px',
              background:   'rgba(251,191,36,0.15)',
              color:        '#FBBF24',
              border:       '1px solid rgba(251,191,36,0.2)',
            }}>
              Soon
            </span>
          )}
        </div>
        <div style={{
          fontSize:   '10px',
          color:      'rgba(255,255,255,0.35)',
          marginTop:  '2px',
          fontFamily: 'system-ui',
        }}>
          {desc}
        </div>
      </div>

      <div
        onClick={() => !future && onFlip()}
        style={{
          width:        '36px',
          height:       '20px',
          borderRadius: '10px',
          background:   (!future && enabled) ? '#3B82F6' : 'rgba(255,255,255,0.1)',
          position:     'relative',
          cursor:       future ? 'not-allowed' : 'pointer',
          flexShrink:   0,
          transition:   'background 0.2s',
        }}
      >
        <div style={{
          position:     'absolute',
          top:          '2px',
          left:         (!future && enabled) ? '18px' : '2px',
          width:        '16px',
          height:       '16px',
          borderRadius: '50%',
          background:   '#fff',
          transition:   'left 0.2s',
        }} />
      </div>
    </div>
  )
}

export function SettingsPanel() {
  const showOrbitLines     = useUIStore((s) => s.showOrbitLines)
  const showPlanetLabels   = useUIStore((s) => s.showPlanetLabels)
  const toggleOrbitLines   = useUIStore((s) => s.toggleOrbitLines)
  const togglePlanetLabels = useUIStore((s) => s.togglePlanetLabels)

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>
      <div style={{
        fontSize:      '10px',
        color:         'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom:  '12px',
      }}>
        Display Settings
      </div>

      <ToggleRow
        label="Orbit Lines"
        desc="Show orbital path ellipses for all planets"
        enabled={showOrbitLines}
        onFlip={toggleOrbitLines}
      />
      <ToggleRow
        label="Planet Labels"
        desc="Show name labels above planets in the scene"
        enabled={showPlanetLabels}
        onFlip={togglePlanetLabels}
      />
      <ToggleRow
        label="Constellation Layer"
        desc="Overlay constellation line patterns"
        enabled={false}
        onFlip={() => {}}
        future
      />
      <ToggleRow
        label="Spacecraft Mode"
        desc="Show active mission trajectories"
        enabled={false}
        onFlip={() => {}}
        future
      />

      <div style={{
        marginTop:    '16px',
        padding:      '10px 12px',
        borderRadius: '8px',
        background:   'rgba(251,191,36,0.05)',
        border:       '1px solid rgba(251,191,36,0.12)',
        fontSize:     '11px',
        color:        'rgba(255,255,255,0.35)',
        lineHeight:   '1.5',
      }}>
        Settings persist while the app is open.
        Items marked "Soon" are planned for future releases.
      </div>
    </div>
  )
}