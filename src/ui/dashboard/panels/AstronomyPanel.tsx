import { useAstronomyStore }  from '../../../store/useAstronomyStore'
import { useLocationStore }   from '../../../store/useLocationStore'
import { decimalHoursToHHMM } from '../../../engines/astronomy'

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      padding:        '5px 0',
      borderBottom:   '1px solid rgba(255,255,255,0.05)',
      fontSize:       '12px',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ color: accent ? '#FCD34D' : '#E2E8F0', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function Section({ title }: { title: string }) {
  return (
    <div style={{
      fontSize:      '10px',
      color:         '#60A5FA',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginTop:     '14px',
      marginBottom:  '6px',
    }}>
      {title}
    </div>
  )
}

export function AstronomyPanel() {
  const astro     = useAstronomyStore((s) => s.result)
  const utcOffset = useLocationStore((s)  => s.utcOffset)

  if (!astro) {
    return (
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', padding: '20px 0', textAlign: 'center' }}>
        Calculating...
      </div>
    )
  }

  const { solar, events, moon } = astro

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>
      <Section title="Solar Position" />
      <Row label="Elevation"        value={`${solar.elevation}°`}         accent={solar.elevation > 0} />
      <Row label="Azimuth"          value={`${solar.azimuth}°`}           />
      <Row label="Declination"      value={`${solar.declination}°`}       />
      <Row label="Hour Angle"       value={`${solar.hourAngle}°`}         />
      <Row label="Distance"         value={`${solar.distance} AU`}        />
      <Row label="Eq. of Time"      value={`${solar.equationOfTime} min`} />

      <Section title="Solar Events" />
      <Row label="Civil Dawn"  value={events.dawnCivil  ? decimalHoursToHHMM(events.dawnCivil,  utcOffset) : 'N/A'} />
      <Row label="Sunrise"     value={events.sunrise    ? decimalHoursToHHMM(events.sunrise,    utcOffset) : 'N/A'} />
      <Row label="Solar Noon"  value={decimalHoursToHHMM(events.solarNoon, utcOffset)}                              />
      <Row label="Sunset"      value={events.sunset     ? decimalHoursToHHMM(events.sunset,     utcOffset) : 'N/A'} />
      <Row label="Civil Dusk"  value={events.duskCivil  ? decimalHoursToHHMM(events.duskCivil,  utcOffset) : 'N/A'} />
      <Row label="Day Length"  value={events.dayLength  ? `${events.dayLength.toFixed(2)} hrs`  : 'N/A'}            />

      <Section title="Moon" />
      <Row label="Phase"        value={moon.phaseName}                           />
      <Row label="Illumination" value={`${moon.illumination}%`}                  />
      <Row label="Age"          value={`${moon.age} days`}                       />
      <Row label="Distance"     value={`${moon.distance.toLocaleString()} km`}   />
      <Row label="Elevation"    value={`${moon.elevation}°`}                     />
      <Row label="Azimuth"      value={`${moon.azimuth}°`}                       />
    </div>
  )
}