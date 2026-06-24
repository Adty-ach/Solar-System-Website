import { useSimStore }       from '../store/useSimStore'
import { useLocationStore }  from '../store/useLocationStore'
import { useAstronomyStore } from '../store/useAstronomyStore'
import { decimalHoursToHHMM } from '../engines/astronomy'
import { motion, AnimatePresence } from 'framer-motion'
import { useSceneStore }     from '../store/useSceneStore'

// ── Helpers ───────────────────────────────────────────────────

function getSeason(date: Date, lat: number): string {
  const doy = Math.floor(
    (date.getTime() - new Date(date.getUTCFullYear(), 0, 0).getTime()) / 86400000
  )
  const southern = lat < 0
  if      (doy < 80  || doy >= 355) return southern ? 'Summer' : 'Winter'
  else if (doy < 172)               return southern ? 'Autumn' : 'Spring'
  else if (doy < 264)               return southern ? 'Winter' : 'Summer'
  else                              return southern ? 'Spring' : 'Autumn'
}

function formatUTC(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  })
}

function formatLocal(date: Date, offset: number): string {
  const local = new Date(date.getTime() + offset * 3600000)
  return local.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  })
}

function formatCoord(val: number, posLabel: string, negLabel: string): string {
  return `${Math.abs(val).toFixed(4)}° ${val >= 0 ? posLabel : negLabel}`
}

// ── Sub-components ────────────────────────────────────────────

function Row({ label, value, highlight }: {
  label:     string
  value:     string
  highlight?: boolean
}) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      padding:        '4px 0',
      borderBottom:   '1px solid rgba(255,255,255,0.05)',
      gap:            '8px',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <span style={{
        color:      highlight ? '#93C5FD' : '#E2E8F0',
        fontSize:   '12px',
        fontWeight: highlight ? 600 : 400,
        textAlign:  'right',
      }}>
        {value}
      </span>
    </div>
  )
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{
      fontSize:      '9px',
      color:         '#60A5FA',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginTop:     '12px',
      marginBottom:  '5px',
      borderBottom:  '1px solid rgba(96,165,250,0.2)',
      paddingBottom: '3px',
    }}>
      {text}
    </div>
  )
}

function MoonPhaseIcon({ phase }: { phase: number }) {
  // Simple SVG moon phase indicator
  const angle = phase * Math.PI * 2
  const lit   = Math.cos(angle)
  const rx    = Math.abs(lit) * 8
  const sweep = lit > 0 ? 1 : 0

  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="#1a1a2e" stroke="#888" strokeWidth="0.5" />
      <path
        d={`M10 2 A8 8 0 0 ${sweep} 10 18 A${rx} 8 0 0 ${1-sweep} 10 2`}
        fill="#E2E8F0"
        opacity="0.9"
      />
    </svg>
  )
}

// ── Main Observatory Panel ────────────────────────────────────

interface EarthObservatoryProps {
  visible: boolean
}

export function EarthObservatory({ visible }: EarthObservatoryProps) {
  const simTime    = useSimStore((s) => s.simTime)
  const loc        = useLocationStore ((s) => s)
  const astro      = useAstronomyStore((s) => s.result)
  const setSelected = useSceneStore((s) => s.setSelectedObject)

  const season     = getSeason(simTime, loc.latitude)
  const utcTime    = formatUTC(simTime)
  const localTime  = formatLocal(simTime, loc.utcOffset)

  const utcDateStr = simTime.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
    timeZone: 'UTC',
  })

  const solar = astro?.solar
  const events = astro?.events
  const moon   = astro?.moon

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 40  }}
          animate={{ opacity: 1, x: 0   }}
          exit={{    opacity: 0, x: 40  }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position:       'fixed',
            top:            '16px',
            right:          '20px',
            bottom:         '16px',
            width:          '290px',
            background:     'rgba(3, 8, 20, 0.92)',
            border:         '1px solid rgba(59,130,246,0.3)',
            borderRadius:   '16px',
            backdropFilter: 'blur(16px)',
            padding:        '18px',
            zIndex:         20,
            fontFamily:     'system-ui, sans-serif',
            color:          '#fff',
            overflowY:      'auto',
            boxShadow:      '0 0 40px rgba(59,130,246,0.1)',
          }}
        >
          {/* ── Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#93C5FD' }}>
                🌍 Earth Observatory
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                {utcDateStr}
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{
                background:   'rgba(255,255,255,0.08)',
                border:       'none',
                borderRadius: '6px',
                color:        '#fff',
                cursor:       'pointer',
                padding:      '2px 10px',
                fontSize:     '16px',
                alignSelf:    'flex-start',
              }}
            >
              ×
            </button>
          </div>

          {/* ── Time ── */}
          <SectionTitle text="Time" />
          <Row label="UTC Time"   value={utcTime}             highlight />
          <Row label="Local Time" value={`${localTime} (UTC${loc.utcOffset >= 0 ? '+' : ''}${loc.utcOffset})`} highlight />
          <Row label="Timezone"   value={loc.timezone}        />

          {/* ── Location ── */}
          <SectionTitle text="Location" />
          <Row label="Latitude"  value={formatCoord(loc.latitude,  'N', 'S')} />
          <Row label="Longitude" value={formatCoord(loc.longitude, 'E', 'W')} />
          <Row label="Country"   value={loc.countryName || '—'}               />
          <Row label="Season"    value={season}                                />
          {loc.detected && (
            <div style={{
              marginTop:    '4px',
              fontSize:     '10px',
              color:        '#34D399',
              display:      'flex',
              alignItems:   'center',
              gap:          '4px',
            }}>
              <span>●</span> GPS location active
            </div>
          )}

          {/* ── Sun ── */}
          <SectionTitle text="Solar Data" />
          {solar ? (
            <>
              <Row label="Elevation"  value={`${solar.elevation}°`}   highlight={solar.elevation > 0} />
              <Row label="Azimuth"    value={`${solar.azimuth}°`}     />
              <Row label="Declination" value={`${solar.declination}°`} />
              <Row label="Hour Angle" value={`${solar.hourAngle}°`}   />
              <Row label="Distance"   value={`${solar.distance} AU`}  />
            </>
          ) : (
            <Row label="Status" value="Calculating..." />
          )}

          {/* ── Solar Events ── */}
          <SectionTitle text="Solar Events" />
          {events ? (
            <>
              <Row label="Sunrise"    value={events.sunrise   ? decimalHoursToHHMM(events.sunrise,   loc.utcOffset) : 'N/A'} />
              <Row label="Solar Noon" value={decimalHoursToHHMM(events.solarNoon, loc.utcOffset)}                            />
              <Row label="Sunset"     value={events.sunset    ? decimalHoursToHHMM(events.sunset,    loc.utcOffset) : 'N/A'} />
              <Row label="Day Length" value={events.dayLength ? `${events.dayLength.toFixed(2)} hrs` : 'N/A'}                />
              <Row label="Civil Dawn" value={events.dawnCivil ? decimalHoursToHHMM(events.dawnCivil, loc.utcOffset) : 'N/A'} />
              <Row label="Civil Dusk" value={events.duskCivil ? decimalHoursToHHMM(events.duskCivil, loc.utcOffset) : 'N/A'} />
            </>
          ) : (
            <Row label="Status" value="Calculating..." />
          )}

          {/* ── Moon ── */}
          <SectionTitle text="Moon" />
          {moon ? (
            <div>
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '10px',
                padding:      '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '4px',
              }}>
                <MoonPhaseIcon phase={moon.phase} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
                    {moon.phaseName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                    {moon.illumination}% illuminated
                  </div>
                </div>
              </div>
              <Row label="Age"       value={`${moon.age} days`}                      />
              <Row label="Distance"  value={`${moon.distance.toLocaleString()} km`}  />
              <Row label="Elevation" value={`${moon.elevation}°`}                    />
              <Row label="Azimuth"   value={`${moon.azimuth}°`}                      />
            </div>
          ) : (
            <Row label="Status" value="Calculating..." />
          )}

          {/* ── Tip ── */}
          <div style={{
            marginTop:    '14px',
            padding:      '10px',
            background:   'rgba(59,130,246,0.08)',
            borderRadius: '8px',
            border:       '1px solid rgba(59,130,246,0.15)',
            fontSize:     '11px',
            color:        'rgba(255,255,255,0.5)',
            lineHeight:   '1.5',
          }}>
            💡 Double-click Earth to enter Observatory mode. Use time controls to simulate any date.
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}