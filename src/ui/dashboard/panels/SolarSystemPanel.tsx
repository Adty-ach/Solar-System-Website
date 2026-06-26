import { useSceneStore } from '../../../store/useSceneStore'
import { useUIStore }    from '../../../store/useUIStore'

const PLANETS = [
  { id: 'mercury', name: 'Mercury', color: '#B5A9A0', radius: '2,439 km',  period: '88 days',    dist: '0.39 AU' },
  { id: 'venus',   name: 'Venus',   color: '#E8C070', radius: '6,051 km',  period: '225 days',   dist: '0.72 AU' },
  { id: 'earth',   name: 'Earth',   color: '#4A90D9', radius: '6,371 km',  period: '365 days',   dist: '1.00 AU' },
  { id: 'moon',    name: 'Moon',    color: '#C8C0B0', radius: '1,737 km',  period: '27.3 days',  dist: '1.00 AU' },
  { id: 'mars',    name: 'Mars',    color: '#C1440E', radius: '3,389 km',  period: '687 days',   dist: '1.52 AU' },
  { id: 'jupiter', name: 'Jupiter', color: '#C88B3A', radius: '69,911 km', period: '11.9 years', dist: '5.20 AU' },
  { id: 'saturn',  name: 'Saturn',  color: '#E4D090', radius: '58,232 km', period: '29.5 years', dist: '9.54 AU' },
  { id: 'uranus',  name: 'Uranus',  color: '#7ECFC4', radius: '25,362 km', period: '84 years',   dist: '19.2 AU' },
  { id: 'neptune', name: 'Neptune', color: '#4060C8', radius: '24,622 km', period: '165 years',  dist: '30.1 AU' },
]

export function SolarSystemPanel() {
  const setSelected     = useSceneStore((s) => s.setSelectedObject)
  const setCameraTarget = useSceneStore((s) => s.setCameraTarget)
  const setCamMode      = useSceneStore((s) => s.setCameraMode)
  const focusTarget     = useSceneStore((s) => s.focusTarget)
  const closeDashboard  = useUIStore((s) => s.closeDashboard)

  function handleFocus(id: string) {
    setSelected(id as any)
    setCameraTarget(id as any)
    setCamMode('focus')
    focusTarget()
    closeDashboard()
  }

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
        Click to focus camera
      </div>

      {/* Sun */}
      <button
        onClick={() => handleFocus('sun')}
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '12px',
          width:        '100%',
          padding:      '10px 12px',
          borderRadius: '10px',
          background:   'rgba(253,184,19,0.08)',
          border:       '1px solid rgba(253,184,19,0.25)',
          cursor:       'pointer',
          marginBottom: '8px',
          textAlign:    'left',
          color:        '#fff',
          fontFamily:   'system-ui',
        }}
      >
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FDB813', boxShadow: '0 0 8px #FDB813', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FDB813' }}>Sun</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
            695,700 km · G-type star · Center
          </div>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>›</span>
      </button>

      {/* Planets */}
      {PLANETS.map((p) => (
        <button
          key={p.id}
          onClick={() => handleFocus(p.id)}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '12px',
            width:        '100%',
            padding:      '9px 12px',
            borderRadius: '9px',
            background:   'rgba(255,255,255,0.03)',
            border:       '1px solid rgba(255,255,255,0.07)',
            cursor:       'pointer',
            marginBottom: '4px',
            textAlign:    'left',
            color:        '#fff',
            fontFamily:   'system-ui',
            transition:   'background 0.15s',
          }}
        >
          <div style={{
            width:        '8px',
            height:       '8px',
            borderRadius: '50%',
            background:   p.color,
            flexShrink:   0,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: p.color }}>
              {p.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
              r={p.radius} · {p.period} · {p.dist}
            </div>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>›</span>
        </button>
      ))}
    </div>
  )
}