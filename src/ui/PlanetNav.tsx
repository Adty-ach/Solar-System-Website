import { useSceneStore } from '../store/useSceneStore'

interface NavItem {
  id:    string
  label: string
  emoji: string
  color: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'sun',     label: 'Sun',     emoji: '☀️', color: '#FDB813' },
  { id: 'mercury', label: 'Mercury', emoji: '⚫', color: '#B5A9A0' },
  { id: 'venus',   label: 'Venus',   emoji: '🟡', color: '#E8C070' },
  { id: 'earth',   label: 'Earth',   emoji: '🌍', color: '#4A90D9' },
  { id: 'moon',    label: 'Moon',    emoji: '🌙', color: '#C8C0B0' },
  { id: 'mars',    label: 'Mars',    emoji: '🔴', color: '#C1440E' },
  { id: 'jupiter', label: 'Jupiter', emoji: '🟠', color: '#C88B3A' },
  { id: 'saturn',  label: 'Saturn',  emoji: '💛', color: '#E4D090' },
  { id: 'uranus',  label: 'Uranus',  emoji: '🔵', color: '#7ECFC4' },
  { id: 'neptune', label: 'Neptune', emoji: '🟣', color: '#4060C8' },
]

export function PlanetNav() {
  const setSelected = useSceneStore((s) => s.setSelectedObject)
  const setTarget   = useSceneStore((s) => s.setCameraTarget)
  const setCamMode  = useSceneStore((s) => s.setCameraMode)
  const focusTarget = useSceneStore((s) => s.focusTarget)
  const resetCamera = useSceneStore((s) => s.resetCamera)
  const selectedObj = useSceneStore((s) => s.selectedObject)

  function handleNav(id: string) {
    setSelected(id as any)
    setTarget(id as any)
    setCamMode('focus')
    focusTarget()
  }

  return (
    <div style={{
      position:       'fixed',
      left:           '16px',
      top:            '50%',
      transform:      'translateY(-50%)',
      zIndex:         20,
      display:        'flex',
      flexDirection:  'column',
      gap:            '4px',
      background:     'rgba(5,10,25,0.80)',
      border:         '1px solid rgba(100,160,255,0.2)',
      borderRadius:   '14px',
      backdropFilter: 'blur(12px)',
      padding:        '12px 10px',
      fontFamily:     'system-ui, sans-serif',
    }}>

      <div style={{
        fontSize:      '9px',
        color:         'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        textAlign:     'center',
        marginBottom:  '4px',
      }}>
        Navigate
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = selectedObj === item.id
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         '8px',
              padding:     '5px 10px',
              borderRadius:'8px',
              border:      isActive ? `1px solid ${item.color}60` : '1px solid transparent',
              background:  isActive ? `${item.color}18` : 'transparent',
              color:       isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              cursor:      'pointer',
              fontSize:    '12px',
              fontWeight:  isActive ? 600 : 400,
              transition:  'all 0.15s',
              minWidth:    '100px',
            }}
          >
            <span style={{ fontSize: '13px' }}>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        )
      })}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />

      <button
        onClick={resetCamera}
        style={{
          padding:      '5px 10px',
          borderRadius: '8px',
          border:       '1px solid rgba(255,255,255,0.1)',
          background:   'rgba(255,255,255,0.05)',
          color:        'rgba(255,255,255,0.5)',
          cursor:       'pointer',
          fontSize:     '11px',
        }}
      >
        ↺ Reset View
      </button>
    </div>
  )
}