import { useSimStore }   from '../../../store/useSimStore'
import { useSceneStore } from '../../../store/useSceneStore'
import { useUIStore }    from '../../../store/useUIStore'

const SPEED_LABEL: Record<number, string> = {
  1: '1×', 10: '10×', 100: '100×', 1000: '1K×', 10000: '10K×', 100000: '100K×',
}

export function HomePanel() {
  const simTime    = useSimStore((s) => s.simTime)
  const speed      = useSimStore((s) => s.speedMultiplier)
  const selected   = useSceneStore((s) => s.selectedObject)
  const setSelected    = useSceneStore((s) => s.setSelectedObject)
  const setCameraTarget = useSceneStore((s) => s.setCameraTarget)
  const setCamMode     = useSceneStore((s) => s.setCameraMode)
  const focusTarget    = useSceneStore((s) => s.focusTarget)
  const closeDashboard = useUIStore((s) => s.closeDashboard)

  const dateStr = simTime.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC',
  })
  const timeStr = simTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  })

  function focusObject(id: string) {
    setSelected(id as any)
    setCameraTarget(id as any)
    setCamMode('focus')
    focusTarget()
    closeDashboard()
  }

  const quickTargets = [
    { id: 'sun',   label: '☀️ Sun',   color: '#FDB813' },
    { id: 'earth', label: '🌍 Earth', color: '#4A90D9' },
    { id: 'moon',  label: '🌙 Moon',  color: '#C8C0B0' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>

      {/* Project header */}
      <div style={{
        background:   'linear-gradient(135deg, rgba(30,58,138,0.35), rgba(91,33,182,0.25))',
        borderRadius: '12px',
        padding:      '14px 16px',
        marginBottom: '16px',
        border:       '1px solid rgba(99,102,241,0.25)',
      }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
          AstroVerse Observatory
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
          Real-time solar system simulation with astronomy and prayer time calculations.
        </div>
      </div>

      {/* Live stats */}
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
        Simulation Status
      </div>

      {[
        { label: 'Sim Date',  value: dateStr },
        { label: 'Sim Time',  value: `${timeStr} UTC` },
        { label: 'Speed',     value: SPEED_LABEL[speed] ?? `${speed}×` },
        { label: 'Selected',  value: selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : 'None' },
        { label: 'Planets',   value: '8 + Moon' },
        { label: 'Version',   value: 'v1.0 Phase 8' },
      ].map((row) => (
        <div key={row.label} style={{
          display:        'flex',
          justifyContent: 'space-between',
          padding:        '5px 0',
          borderBottom:   '1px solid rgba(255,255,255,0.05)',
          fontSize:       '12px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
          <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{row.value}</span>
        </div>
      ))}

      {/* Quick focus */}
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '14px 0 8px' }}>
        Quick Focus
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {quickTargets.map((t) => (
          <button
            key={t.id}
            onClick={() => focusObject(t.id)}
            style={{
              flex:         1,
              padding:      '8px 4px',
              borderRadius: '9px',
              background:   `${t.color}18`,
              border:       `1px solid ${t.color}40`,
              color:        t.color,
              cursor:       'pointer',
              fontSize:     '11px',
              fontWeight:   600,
              fontFamily:   'system-ui',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Guide */}
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '14px 0 8px' }}>
        Controls
      </div>
      {[
        'Left drag — rotate camera',
        'Right drag — pan camera',
        'Scroll — zoom in / out',
        'Click planet — select & focus',
        'Click Earth — Earth Observatory',
        'Click Sun — Astronomy data',
      ].map((tip, i) => (
        <div key={i} style={{
          fontSize:     '11px',
          color:        'rgba(255,255,255,0.5)',
          padding:      '4px 0',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          lineHeight:   '1.4',
        }}>
          {tip}
        </div>
      ))}
    </div>
  )
}