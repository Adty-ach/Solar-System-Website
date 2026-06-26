import { useEffect, useRef }       from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore }              from '../../store/useUIStore'
import { HomePanel }               from './panels/HomePanel'
import { AboutPanel }              from './panels/AboutPanel'
import type { ActivePanel }        from '../../store/useUIStore'
import { SolarSystemPanel } from './panels/SolarSystemPanel'
import { AstronomyPanel }   from './panels/AstronomyPanel'
import { LearnPanel }       from './panels/LearnPanel'
import { SettingsPanel }    from './panels/SettingsPanel'
import { EarthShortcutPanel }  from './panels/EarthShortcutPanel'
import { PrayerShortcutPanel } from './panels/PrayerShortcutPanel'
import { CalendarPanel } from './panels/CalendarPanel'
import { CommunityPanel } from './panels/CommunityPanel'


// ── Menu config ───────────────────────────────────────────────
const MENU_ITEMS: { id: ActivePanel; icon: string; label: string }[] = [
  { id: 'home',         icon: '🏠', label: 'Home'                },
  { id: 'solar-system', icon: '🌌', label: 'Solar System'        },
  { id: 'earth',        icon: '🌍', label: 'Earth Observatory'   },
  { id: 'astronomy',    icon: '☀️', label: 'Astronomy'           },
  { id: 'prayer',       icon: '🕌', label: 'Prayer Observatory'  },
  { id: 'calendar',     icon: '📅', label: 'Calendar'            },
  { id: 'learn',        icon: '📖', label: 'Learn'               },
  { id: 'community',    icon: '💬', label: 'Community' },
  { id: 'settings',     icon: '⚙️', label: 'Settings'            },
  { id: 'about',        icon: 'ℹ️', label: 'About'               },
]

// ── Panel renderer ────────────────────────────────────────────
function PanelContent({ panel }: { panel: ActivePanel }) {
  if (panel === 'home')  return <HomePanel />
  if (panel === 'about')        return <AboutPanel />
  if (panel === 'solar-system') return <SolarSystemPanel />
  if (panel === 'astronomy')    return <AstronomyPanel />
  if (panel === 'learn')        return <LearnPanel />
  if (panel === 'settings')     return <SettingsPanel />
  if (panel === 'earth')        return <EarthShortcutPanel />
  if (panel === 'prayer')       return <PrayerShortcutPanel />
  if (panel === 'calendar') return <CalendarPanel />
  if (panel === 'community') return <CommunityPanel />


  // Placeholder for panels not yet implemented
  return (
    <div style={{
      color:     'rgba(255,255,255,0.35)',
      fontSize:  '13px',
      padding:   '20px 0',
      textAlign: 'center',
      lineHeight:'1.8',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚧</div>
      Coming soon.
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export function DashboardMenu() {
  const dashboardOpen  = useUIStore((s) => s.dashboardOpen)
  const activePanel    = useUIStore((s) => s.activePanel)
  const toggleDashboard = useUIStore((s) => s.toggleDashboard)
  const closeDashboard  = useUIStore((s) => s.closeDashboard)
  const setActivePanel  = useUIStore((s) => s.setActivePanel)
  const closePanel      = useUIStore((s) => s.closePanel)

  const sidebarRef = useRef<HTMLDivElement>(null)

  // ESC closes dashboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDashboard()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeDashboard])

  return (
    <>
      {/* ── Hamburger trigger ── */}
      <button
        onClick={toggleDashboard}
        style={{
          position:       'fixed',
          top:            '16px',
          left:           '16px',
          zIndex:         200,
          display:        'flex',
          alignItems:     'center',
          gap:            '8px',
          padding:        '8px 14px',
          borderRadius:   '12px',
          background:     dashboardOpen
            ? 'rgba(59,130,246,0.3)'
            : 'rgba(5,10,25,0.85)',
          border:         dashboardOpen
            ? '1px solid rgba(59,130,246,0.6)'
            : '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          color:          '#93C5FD',
          cursor:         'pointer',
          fontFamily:     'system-ui',
          fontSize:       '12px',
          fontWeight:     600,
          letterSpacing:  '0.3px',
          transition:     'all 0.2s',
        }}
      >
        {/* Hamburger / X icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          {dashboardOpen ? (
            <>
              <line x1="6"  y1="6"  x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="18" y1="6"  x2="6"  y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="3" y1="6"  x2="21" y2="6"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </svg>
        AstroVerse
      </button>

      <AnimatePresence>
        {dashboardOpen && (
          <>
            {/* ── Backdrop — click outside to close ── */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDashboard}
              style={{
                position:       'fixed',
                inset:          0,
                zIndex:         150,
                background:     'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(2px)',
              }}
            />

            {/* ── Sidebar ── */}
            <motion.div
              key="sidebar"
              ref={sidebarRef}
              initial={{ x: -280 }}
              animate={{ x: 0    }}
              exit={{    x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position:      'fixed',
                top:           0,
                left:          0,
                bottom:        0,
                width:         '260px',
                zIndex:        160,
                display:       'flex',
                flexDirection: 'column',
                background:    'rgba(4,7,18,0.98)',
                borderRight:   '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Header — clears hamburger button */}
              <div style={{
                padding:      '72px 20px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                flexShrink:   0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🔭</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#93C5FD', fontFamily: 'system-ui' }}>
                      AstroVerse
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'system-ui' }}>
                      Observatory Platform
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <nav style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {MENU_ITEMS.map((item, idx) => {
                  const isActive = activePanel === item.id
                  const addDivider = idx === 6  // before Settings

                  return (
                    <div key={item.id}>
                      {addDivider && (
                        <div style={{
                          height:     '1px',
                          background: 'rgba(255,255,255,0.06)',
                          margin:     '6px 8px',
                        }} />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActivePanel(item.id)
                        }}
                        style={{
                          display:      'flex',
                          alignItems:   'center',
                          gap:          '10px',
                          width:        '100%',
                          padding:      '9px 12px',
                          borderRadius: '9px',
                          border:       isActive
                            ? '1px solid rgba(59,130,246,0.4)'
                            : '1px solid transparent',
                          background:   isActive
                            ? 'rgba(59,130,246,0.15)'
                            : 'transparent',
                          color:        isActive
                            ? '#93C5FD'
                            : 'rgba(255,255,255,0.55)',
                          cursor:       'pointer',
                          fontSize:     '13px',
                          fontWeight:   isActive ? 600 : 400,
                          fontFamily:   'system-ui',
                          textAlign:    'left',
                          marginBottom: '1px',
                          transition:   'all 0.15s',
                        }}
                      >
                        <span style={{ fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>
                          {item.icon}
                        </span>
                        {item.label}
                        {isActive && (
                          <span style={{
                            marginLeft:   'auto',
                            width:        '5px',
                            height:       '5px',
                            borderRadius: '50%',
                            background:   '#3B82F6',
                            flexShrink:   0,
                          }} />
                        )}
                      </button>
                    </div>
                  )
                })}
              </nav>

              {/* Footer */}
              <div style={{
                padding:    '10px 20px',
                borderTop:  '1px solid rgba(255,255,255,0.06)',
                fontSize:   '10px',
                color:      'rgba(255,255,255,0.18)',
                textAlign:  'center',
                fontFamily: 'system-ui',
                flexShrink: 0,
              }}>
                AstroVerse Observatory v1.0
              </div>
            </motion.div>

            {/* ── Content panel ── */}
            <AnimatePresence mode="wait">
              {activePanel && (
                <motion.div
                  key={activePanel}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0   }}
                  exit={{    opacity: 0, x: -10  }}
                  transition={{ duration: 0.15   }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position:      'fixed',
                    top:           0,
                    left:          '260px',
                    bottom:        0,
                    width:         '300px',
                    zIndex:        160,
                    display:       'flex',
                    flexDirection: 'column',
                    background:    'rgba(5,10,22,0.97)',
                    borderRight:   '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Panel header */}
                  <div style={{
                    padding:        '20px',
                    borderBottom:   '1px solid rgba(255,255,255,0.07)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    flexShrink:     0,
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'system-ui' }}>
                      {MENU_ITEMS.find((m) => m.id === activePanel)?.label ?? ''}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); closePanel() }}
                      style={{
                        background:   'rgba(255,255,255,0.08)',
                        border:       'none',
                        borderRadius: '6px',
                        color:        'rgba(255,255,255,0.5)',
                        cursor:       'pointer',
                        padding:      '3px 10px',
                        fontSize:     '16px',
                        lineHeight:   1,
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Panel content */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                    <PanelContent panel={activePanel} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </>
        )}
      </AnimatePresence>
    </>
  )
}