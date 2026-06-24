import { useState } from 'react'
import { useSceneStore } from '../store/useSceneStore'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  id:    string
  label: string
  color: string
  size:  number   // relative size indicator
}

const NAV_ITEMS: NavItem[] = [
  { id: 'sun',     label: 'Sun',     color: '#FDB813', size: 18 },
  { id: 'mercury', label: 'Mercury', color: '#B5A9A0', size: 6  },
  { id: 'venus',   label: 'Venus',   color: '#E8C070', size: 10 },
  { id: 'earth',   label: 'Earth',   color: '#4A90D9', size: 10 },
  { id: 'moon',    label: 'Moon',    color: '#C8C0B0', size: 5  },
  { id: 'mars',    label: 'Mars',    color: '#C1440E', size: 7  },
  { id: 'jupiter', label: 'Jupiter', color: '#C88B3A', size: 16 },
  { id: 'saturn',  label: 'Saturn',  color: '#E4D090', size: 14 },
  { id: 'uranus',  label: 'Uranus',  color: '#7ECFC4', size: 12 },
  { id: 'neptune', label: 'Neptune', color: '#4060C8', size: 11 },
]

// ── Planet SVG icons ───────────────────────────────────────────
function PlanetIcon({ item, size = 22 }: { item: NavItem; size?: number }) {
  if (item.id === 'sun') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" fill="#FDB813" />
        <circle cx="12" cy="12" r="5" fill="url(#sunGlow)" opacity="0.6" />
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line
            key={i}
            x1={12 + 6.5 * Math.cos(deg * Math.PI/180)}
            y1={12 + 6.5 * Math.sin(deg * Math.PI/180)}
            x2={12 + 9   * Math.cos(deg * Math.PI/180)}
            y2={12 + 9   * Math.sin(deg * Math.PI/180)}
            stroke="#FFD700"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        <defs>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    )
  }

  if (item.id === 'saturn') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <ellipse cx="12" cy="13" rx="9" ry="3" fill="none" stroke={item.color} strokeWidth="1" opacity="0.5" />
        <circle cx="12" cy="12" r="5.5" fill={item.color} />
        <ellipse cx="12" cy="13" rx="9" ry="3" fill="none" stroke={item.color} strokeWidth="1.2" opacity="0.8"
          strokeDasharray="6 5" />
      </svg>
    )
  }

  if (item.id === 'earth') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="#1a4a8a" />
        <path d="M6 9 Q9 7 11 10 Q13 13 10 14 Q7 15 6 12 Z" fill="#2d7a3a" />
        <path d="M13 8 Q16 6 18 9 Q19 12 16 13 Q14 14 13 11 Z" fill="#2d7a3a" />
        <path d="M8 15 Q11 14 12 17 Q11 19 8 18 Z" fill="#2d7a3a" />
        <circle cx="12" cy="12" r="8" fill="none" stroke="#4A90D9" strokeWidth="0.5" opacity="0.5" />
      </svg>
    )
  }

  if (item.id === 'moon') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path
          d="M16 12 A7 7 0 1 1 9 5 A5 5 0 1 0 16 12 Z"
          fill={item.color}
        />
      </svg>
    )
  }

  if (item.id === 'jupiter') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="#C88B3A" />
        <path d="M4 10 Q12 9 20 10" fill="none" stroke="#A0622A" strokeWidth="1.5" opacity="0.7" />
        <path d="M4 12 Q12 11.5 20 12" fill="none" stroke="#E0A050" strokeWidth="1" opacity="0.6" />
        <path d="M4 14 Q12 14.5 20 14" fill="none" stroke="#A0622A" strokeWidth="1.5" opacity="0.7" />
        <ellipse cx="8" cy="13" rx="2.5" ry="1.5" fill="#CC4400" opacity="0.8" />
      </svg>
    )
  }

  // Generic planet with radial gradient
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id={`grad-${item.id}`} cx="35%" cy="35%" r="60%">
          <stop offset="0%"   stopColor={item.color} stopOpacity="1"   />
          <stop offset="70%"  stopColor={item.color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={item.color} stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="8" fill={`url(#grad-${item.id})`} />
    </svg>
  )
}

// ── Toggle button ──────────────────────────────────────────────
function NavToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={open ? 'Close Navigation' : 'Open Navigation'}
      style={{
        width:          '44px',
        height:         '44px',
        borderRadius:   '12px',
        background:     open
          ? 'rgba(59,130,246,0.25)'
          : 'rgba(5,10,25,0.85)',
        border:         `1px solid ${open
          ? 'rgba(59,130,246,0.5)'
          : 'rgba(255,255,255,0.12)'}`,
        backdropFilter: 'blur(12px)',
        cursor:         'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        transition:     'all 0.2s',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        {open ? (
          // Close X
          <>
            <line x1="6" y1="6" x2="18" y2="18" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="6" x2="6"  y2="18" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          // Solar system icon
          <>
            <circle cx="12" cy="12" r="3"  fill="#FDB813" />
            <circle cx="12" cy="12" r="7"  fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="19" cy="12" r="1.5" fill="#4A90D9" />
            <circle cx="5"  cy="12" r="1"   fill="#C1440E" />
          </>
        )}
      </svg>
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────
export function PlanetNav() {
  const [open, setOpen] = useState(false)

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
      position: 'fixed',
      left:     '16px',
      top:      '50%',
      transform:'translateY(-50%)',
      zIndex:   20,
      display:  'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap:      '6px',
    }}>
      {/* Toggle button — always visible */}
      <NavToggle open={open} onClick={() => setOpen((v) => !v)} />

      {/* Nav panel — collapsible */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0,   scale: 1    }}
            exit={{    opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              background:     'rgba(5,10,25,0.88)',
              border:         '1px solid rgba(100,160,255,0.2)',
              borderRadius:   '14px',
              backdropFilter: 'blur(14px)',
              padding:        '10px 8px',
              display:        'flex',
              flexDirection:  'column',
              gap:            '2px',
              minWidth:       '150px',
            }}
          >
            <div style={{
              fontSize:      '9px',
              color:         'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              textAlign:     'center',
              marginBottom:  '6px',
              paddingBottom: '6px',
              borderBottom:  '1px solid rgba(255,255,255,0.06)',
            }}>
              Solar System
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
                    gap:         '10px',
                    padding:     '6px 10px',
                    borderRadius:'8px',
                    border:      isActive
                      ? `1px solid ${item.color}50`
                      : '1px solid transparent',
                    background:  isActive
                      ? `${item.color}15`
                      : 'transparent',
                    color:       isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                    cursor:      'pointer',
                    fontSize:    '12px',
                    fontWeight:  isActive ? 600 : 400,
                    transition:  'all 0.15s',
                    width:       '100%',
                    textAlign:   'left',
                  }}
                >
                  <PlanetIcon item={item} size={20} />
                  <span style={{ color: isActive ? item.color : undefined }}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span style={{
                      marginLeft:  'auto',
                      width:       '6px',
                      height:      '6px',
                      borderRadius:'50%',
                      background:  item.color,
                      flexShrink:  0,
                    }} />
                  )}
                </button>
              )
            })}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '6px 0 2px' }} />

            <button
              onClick={() => { resetCamera(); setOpen(false) }}
              style={{
                padding:      '6px 10px',
                borderRadius: '8px',
                border:       '1px solid rgba(255,255,255,0.08)',
                background:   'rgba(255,255,255,0.04)',
                color:        'rgba(255,255,255,0.4)',
                cursor:       'pointer',
                fontSize:     '11px',
                display:      'flex',
                alignItems:   'center',
                gap:          '6px',
                width:        '100%',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 12 A9 9 0 1 1 6 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 7 L3 12 L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Reset View
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}