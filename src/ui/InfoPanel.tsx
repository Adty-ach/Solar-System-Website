import { useSceneStore }       from '../store/useSceneStore'
import { PLANET_CONFIGS }      from '../scene/solar-system/planetData'
import { useSimStore }         from '../store/useSimStore'
import { useAstronomyStore }   from '../store/useAstronomyStore'
import { useLocationStore }    from '../store/useLocationStore'
import { decimalHoursToHHMM }  from '../engines/astronomy'
import { motion, AnimatePresence } from 'framer-motion'

// ── Sun static data ───────────────────────────────────────────
const SUN_DATA = {
  name:            'Sun',
  diameter:        '1,392,700 km',
  mass:            '1.989 × 10³⁰ kg',
  gravity:         '274 m/s²',
  temperature:     '5,778 K (surface)',
  distanceFromSun: '0 AU — Center',
  orbitalPeriod:   '225 million years*',
  rotationPeriod:  '25 days (equator)',
  fact:            'The Sun contains 99.86% of the total mass of the Solar System.',
  description:     'The Sun is the star at the heart of our Solar System — a nearly perfect sphere of hot plasma generating energy through nuclear fusion. Every second, it converts 600 million tons of hydrogen into helium, releasing energy that travels 150 million km to warm our planet. Its gravitational pull holds all eight planets in their orbits. *Around the Milky Way galactic center.',
}

// ── Types ─────────────────────────────────────────────────────
interface PanelData {
  name:            string
  diameter:        string
  mass:            string
  gravity:         string
  temperature:     string
  distanceFromSun: string
  orbitalPeriod:   string
  rotationPeriod:  string
  fact:            string
  description:     string
  extra?:          { label: string; value: string }[]
}

// ── Data row ──────────────────────────────────────────────────
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'flex-start',
      padding:        '5px 0',
      borderBottom:   '1px solid rgba(255,255,255,0.06)',
      gap:            '12px',
    }}>
      <span style={{
        color:      'rgba(255,255,255,0.45)',
        fontSize:   '11px',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{
        color:      '#E2E8F0',
        fontSize:   '12px',
        textAlign:  'right',
        fontWeight: 500,
      }}>
        {value}
      </span>
    </div>
  )
}

// ── Section divider ───────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontSize:      '9px',
      color:         '#93C5FD',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginTop:     '10px',
      marginBottom:  '4px',
    }}>
      {text}
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────
export function InfoPanel() {
  const selectedObject = useSceneStore((s) => s.selectedObject)
  const setSelected    = useSceneStore((s) => s.setSelectedObject)
  const astro          = useAstronomyStore((s) => s.result)
  const utcOffset      = useLocationStore((s) => s.utcOffset)

  // Suppress unused warning — simTime kept for future use
  useSimStore((s) => s.simTime)

  let data: PanelData | null = null

  // ── Sun ────────────────────────────────────────────────────
  if (selectedObject === 'sun') {
    data = {
      ...SUN_DATA,
      extra: astro ? [
        { label: 'Elevation',        value: `${astro.solar.elevation}°`          },
        { label: 'Azimuth',          value: `${astro.solar.azimuth}°`            },
        { label: 'Declination',      value: `${astro.solar.declination}°`        },
        { label: 'Hour Angle',       value: `${astro.solar.hourAngle}°`          },
        { label: 'Equation of Time', value: `${astro.solar.equationOfTime} min`  },
        { label: 'Distance',         value: `${astro.solar.distance} AU`         },
        { label: 'Solar Noon',       value: decimalHoursToHHMM(astro.events.solarNoon, utcOffset)                                              },
        { label: 'Sunrise',          value: astro.events.sunrise   ? decimalHoursToHHMM(astro.events.sunrise,   utcOffset) : 'N/A'            },
        { label: 'Sunset',           value: astro.events.sunset    ? decimalHoursToHHMM(astro.events.sunset,    utcOffset) : 'N/A'            },
        { label: 'Day Length',       value: astro.events.dayLength ? `${astro.events.dayLength.toFixed(2)} hrs` : 'N/A'                       },
        { label: 'Civil Dawn',       value: astro.events.dawnCivil ? decimalHoursToHHMM(astro.events.dawnCivil, utcOffset) : 'N/A'           },
        { label: 'Civil Dusk',       value: astro.events.duskCivil ? decimalHoursToHHMM(astro.events.duskCivil, utcOffset) : 'N/A'           },
      ] : [],
    }

  // ── Moon ───────────────────────────────────────────────────
  } else if (selectedObject === 'moon') {
    const moon = astro?.moon
    data = {
      name:            'Moon',
      diameter:        '3,474 km',
      mass:            '7.35 × 10²² kg',
      gravity:         '1.62 m/s²',
      temperature:     '-53°C (avg)',
      distanceFromSun: '1.00 AU (with Earth)',
      orbitalPeriod:   '27.3 days',
      rotationPeriod:  '27.3 days (tidally locked)',
      fact:            'The Moon is slowly moving away from Earth at 3.8 cm per year.',
      description:     "The Moon is Earth's only natural satellite. Tidally locked to Earth, we always see the same face. Its gravitational pull drives ocean tides and stabilizes Earth's axial tilt.",
      extra: moon ? [
        { label: 'Phase',        value: moon.phaseName                          },
        { label: 'Illumination', value: `${moon.illumination}%`                 },
        { label: 'Age',          value: `${moon.age} days`                      },
        { label: 'Distance',     value: `${moon.distance.toLocaleString()} km`  },
        { label: 'Elevation',    value: `${moon.elevation}°`                    },
        { label: 'Azimuth',      value: `${moon.azimuth}°`                      },
      ] : [],
    }

  // ── Planets ────────────────────────────────────────────────
  } else if (selectedObject && PLANET_CONFIGS[selectedObject]) {
    data = PLANET_CONFIGS[selectedObject]
  }

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          key={selectedObject}
          initial={{ opacity: 0, x: 40  }}
          animate={{ opacity: 1, x: 0   }}
          exit={{    opacity: 0, x: 40  }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position:       'fixed',
            top:            '16px',
            right:          '20px',
            bottom:         '16px',
            width:          '290px',
            background:     'rgba(5, 10, 25, 0.90)',
            border:         '1px solid rgba(100,160,255,0.2)',
            borderRadius:   '16px',
            backdropFilter: 'blur(16px)',
            padding:        '20px',
            zIndex:         20,
            fontFamily:     'system-ui, sans-serif',
            color:          '#fff',
            overflowY:      'auto',
          }}
        >
          {/* Header */}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            marginBottom:   '8px',
          }}>
            <h2 style={{
              margin:     0,
              fontSize:   '20px',
              fontWeight: 600,
              color:      '#93C5FD',
            }}>
              {data.name}
            </h2>
            <button
              onClick={() => setSelected(null)}
              style={{
                background:   'rgba(255,255,255,0.1)',
                border:       'none',
                borderRadius: '6px',
                color:        '#fff',
                cursor:       'pointer',
                padding:      '2px 10px',
                fontSize:     '16px',
              }}
            >
              ×
            </button>
          </div>

          {/* Description */}
          <p style={{
            fontSize:      '12px',
            color:         'rgba(255,255,255,0.6)',
            lineHeight:    '1.6',
            marginBottom:  '12px',
            borderBottom:  '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '12px',
          }}>
            {data.description}
          </p>

          {/* Physical data */}
          <SectionLabel text="Physical Data" />
          <DataRow label="Diameter"        value={data.diameter}        />
          <DataRow label="Mass"            value={data.mass}            />
          <DataRow label="Gravity"         value={data.gravity}         />
          <DataRow label="Temperature"     value={data.temperature}     />
          <DataRow label="Distance Sun"    value={data.distanceFromSun} />
          <DataRow label="Orbital Period"  value={data.orbitalPeriod}   />
          <DataRow label="Rotation Period" value={data.rotationPeriod}  />

          {/* Live astronomy data (Sun + Moon) */}
          {data.extra && data.extra.length > 0 && (
            <>
              <SectionLabel text="Live Astronomy Data" />
              {data.extra.map((row) => (
                <DataRow key={row.label} label={row.label} value={row.value} />
              ))}
            </>
          )}

          {/* Did you know */}
          <div style={{
            marginTop:    '14px',
            padding:      '12px',
            background:   'rgba(100,160,255,0.08)',
            borderRadius: '10px',
            border:       '1px solid rgba(100,160,255,0.15)',
          }}>
            <div style={{
              fontSize:      '10px',
              color:         '#93C5FD',
              marginBottom:  '6px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              Did You Know
            </div>
            <p style={{
              margin:     0,
              fontSize:   '12px',
              color:      'rgba(255,255,255,0.75)',
              lineHeight: '1.6',
            }}>
              {data.fact}
            </p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}