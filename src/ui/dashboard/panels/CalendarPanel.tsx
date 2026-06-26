import { useSimStore }       from '../../../store/useSimStore'
import { useAstronomyStore } from '../../../store/useAstronomyStore'
import { usePrayerStore }    from '../../../store/usePrayerStore'
import { useLocationStore }  from '../../../store/useLocationStore'
import {
  PRAYER_ORDER,
  PRAYER_DISPLAY_NAMES,
  prayerTimeToString,
} from '../../../engines/prayer'
import { toJulianDate } from '../../../engines/astronomy'

// ── Helpers ───────────────────────────────────────────────────

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

function getDOY(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0))
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000)
}

interface AstroEvent {
  name:        string
  doy:         number
  icon:        string
  description: string
}

function getAstroEvents(): AstroEvent[] {
  return [
    { name: 'March Equinox',     doy: 79,  icon: '🌸', description: 'Spring begins in Northern Hemisphere. Day and night equal length.'             },
    { name: 'June Solstice',     doy: 171, icon: '☀️', description: 'Longest day in Northern Hemisphere. Sun at maximum declination +23.5°.'        },
    { name: 'September Equinox', doy: 264, icon: '🍂', description: 'Autumn begins in Northern Hemisphere. Day and night equal length.'             },
    { name: 'December Solstice', doy: 355, icon: '❄️', description: 'Shortest day in Northern Hemisphere. Sun at minimum declination −23.5°.' },
  ]
}

function getClosestEvent(doy: number, events: AstroEvent[]): AstroEvent {
  return events.reduce((closest, event) => {
    return Math.abs(doy - event.doy) < Math.abs(doy - closest.doy)
      ? event
      : closest
  })
}

const SPEED_LABELS: Record<number, string> = {
  1: '1×', 10: '10×', 100: '100×', 1000: '1K×', 10000: '10K×', 100000: '100K×',
}

const ASTRONOMY_FACTS = [
  'Earth reaches perihelion (closest to Sun) around January 3rd each year.',
  "Solstices are caused by Earth's 23.5° axial tilt relative to its orbital plane.",
  'A sidereal day (23h 56m) differs from a solar day (24h) by about 4 minutes.',
  'The Moon is gradually moving away from Earth at ~3.8 cm per year.',
  "Jupiter's Great Red Spot has been an active storm for over 350 years.",
  'Venus rotates so slowly that its day is longer than its year.',
  'A lunar month (synodic) is 29.53 days — the basis of the Islamic Hijri calendar.',
  "The Sun's light takes approximately 8 minutes 20 seconds to reach Earth.",
  "Saturn's rings are made mostly of ice particles and rocky debris.",
  'Uranus rotates on its side with an axial tilt of 98°.',
  'Neptune has the fastest winds in the Solar System at up to 2,100 km/h.',
  'The Milky Way galaxy completes one rotation approximately every 225 million years.',
]

// ── Sub-components ────────────────────────────────────────────

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{
      fontSize:      '9px',
      color:         '#60A5FA',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginTop:     '16px',
      marginBottom:  '8px',
      borderBottom:  '1px solid rgba(96,165,250,0.15)',
      paddingBottom: '4px',
      fontFamily:    'system-ui',
    }}>
      {text}
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      padding:        '5px 0',
      borderBottom:   '1px solid rgba(255,255,255,0.05)',
      fontSize:       '12px',
      fontFamily:     'system-ui',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export function CalendarPanel() {
  const simTime   = useSimStore((s) => s.simTime)
  const speed     = useSimStore((s) => s.speedMultiplier)
  const astro     = useAstronomyStore((s) => s.result)
  const schedule  = usePrayerStore((s) => s.schedule)
  const utcOffset = useLocationStore((s) => s.utcOffset)

  const doy    = getDOY(simTime)
  const jd     = toJulianDate(simTime).toFixed(2)
  const events = getAstroEvents()
  const closest = getClosestEvent(doy, events)

  const timeStr = simTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  })

  const fact = ASTRONOMY_FACTS[doy % ASTRONOMY_FACTS.length]

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>

      {/* Hero date */}
      <div style={{
        background:   'linear-gradient(135deg, rgba(30,58,138,0.35), rgba(91,33,182,0.2))',
        borderRadius: '12px',
        padding:      '14px 16px',
        border:       '1px solid rgba(99,102,241,0.25)',
        marginBottom: '4px',
      }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
          Current Simulation Date
        </div>
        <div style={{ fontSize: '17px', fontWeight: 600, color: '#93C5FD', lineHeight: 1.2 }}>
          {simTime.toLocaleDateString('en-US', {
            day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
          })}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontFamily: 'monospace' }}>
          {timeStr} UTC
        </div>
      </div>

      {/* Section 1 — Simulation */}
      <SectionTitle text="Simulation" />
      <DataRow
        label="Date"
        value={simTime.toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC',
        })}
      />
      <DataRow label="Time UTC"    value={timeStr} />
      <DataRow label="Day of Year" value={`${doy} / ${isLeapYear(simTime.getUTCFullYear()) ? 366 : 365}`} />
      <DataRow label="Julian Date" value={jd} />
      <DataRow label="Speed"       value={SPEED_LABELS[speed] ?? `${speed}×`} />

      {/* Section 2 — Astronomical events */}
      <SectionTitle text="Astronomical Events" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {events.map((ev) => {
          const isClosest = ev.name === closest.name
          const daysAway  = ev.doy - doy
          const badge     = daysAway === 0
            ? 'Today'
            : daysAway > 0
              ? `in ${daysAway}d`
              : `${Math.abs(daysAway)}d ago`

          return (
            <div
              key={ev.name}
              style={{
                display:      'flex',
                alignItems:   'flex-start',
                gap:          '10px',
                padding:      '9px 11px',
                borderRadius: '9px',
                background:   isClosest ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                border:       isClosest ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{ev.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize:   '12px',
                  fontWeight: isClosest ? 600 : 400,
                  color:      isClosest ? '#93C5FD' : '#E2E8F0',
                }}>
                  {ev.name}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                  {ev.description}
                </div>
              </div>
              <div style={{
                fontSize:   '10px',
                color:      isClosest ? '#60A5FA' : 'rgba(255,255,255,0.3)',
                fontWeight: isClosest ? 600 : 400,
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
              }}>
                {badge}
              </div>
            </div>
          )
        })}
      </div>

      {/* Section 3 — Moon cycle */}
      <SectionTitle text="Moon Cycle" />
      {astro?.moon ? (
        <>
          <DataRow label="Phase"        value={astro.moon.phaseName}                          />
          <DataRow label="Age"          value={`${astro.moon.age} days`}                      />
          <DataRow label="Illumination" value={`${astro.moon.illumination}%`}                 />
          <DataRow label="Distance"     value={`${astro.moon.distance.toLocaleString()} km`}  />
        </>
      ) : (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', padding: '6px 0' }}>
          Calculating...
        </div>
      )}

      {/* Section 4 — Prayer summary */}
      <SectionTitle text="Prayer Summary" />
      {schedule ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {PRAYER_ORDER.map((name) => {
            const isCurrent = schedule.currentPrayer === name
            const isNext    = schedule.nextPrayer    === name
            return (
              <div
                key={name}
                style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  padding:        '5px 8px',
                  borderRadius:   '6px',
                  background:     isCurrent
                    ? 'rgba(59,130,246,0.12)'
                    : isNext ? 'rgba(255,255,255,0.04)' : 'transparent',
                  fontSize:       '12px',
                }}
              >
                <span style={{
                  color:      isCurrent ? '#93C5FD' : 'rgba(255,255,255,0.5)',
                  fontWeight: isCurrent ? 600 : 400,
                }}>
                  {PRAYER_DISPLAY_NAMES[name]}
                  {isCurrent && (
                    <span style={{ fontSize: '9px', marginLeft: '5px', color: '#60A5FA' }}>
                      ● now
                    </span>
                  )}
                </span>
                <span style={{
                  color:      isCurrent ? '#E2E8F0' : 'rgba(255,255,255,0.55)',
                  fontFamily: 'monospace',
                  fontWeight: isCurrent ? 600 : 400,
                }}>
                  {prayerTimeToString(schedule.times[name], utcOffset)}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', padding: '6px 0' }}>
          Calculating...
        </div>
      )}

      {/* Section 5 — Did you know */}
      <SectionTitle text="Did You Know" />
      <div style={{
        padding:      '11px 13px',
        borderRadius: '9px',
        background:   'rgba(99,102,241,0.07)',
        border:       '1px solid rgba(99,102,241,0.18)',
        fontSize:     '11px',
        color:        'rgba(255,255,255,0.6)',
        lineHeight:   '1.65',
        marginBottom: '8px',
      }}>
        {fact}
      </div>

    </div>
  )
}