// ============================================================
// Astronomy Engine — Pure TypeScript
// Implements USNO/Jean Meeus algorithms (Astronomical Algorithms)
// No external APIs — all calculations from first principles
// ============================================================

// ── Types ────────────────────────────────────────────────────

export interface SolarPosition {
  /** Degrees above/below horizon. Negative = below horizon */
  elevation:    number
  /** Compass degrees 0=N 90=E 180=S 270=W */
  azimuth:      number
  /** True solar noon in decimal hours UTC */
  solarNoon:    number
  /** Equation of time in minutes */
  equationOfTime: number
  /** Solar declination in degrees */
  declination:  number
  /** Hour angle in degrees */
  hourAngle:    number
  /** Distance from Earth in AU */
  distance:     number
}

export interface SolarEvents {
  /** Decimal hours UTC — null if sun never rises */
  sunrise:    number | null
  /** Decimal hours UTC — null if sun never sets */
  sunset:     number | null
  /** Decimal hours UTC */
  solarNoon:  number
  /** Day length in decimal hours */
  dayLength:  number | null
  /** Civil twilight start (sun at -6°) */
  dawnCivil:  number | null
  /** Civil twilight end */
  duskCivil:  number | null
}

export interface MoonData {
  /** Phase name */
  phaseName:    string
  /** 0–1 fraction of cycle (0 = new moon) */
  phase:        number
  /** Illumination percentage 0–100 */
  illumination: number
  /** Age in days since last new moon */
  age:          number
  /** Distance from Earth in km */
  distance:     number
  /** Moon elevation in degrees */
  elevation:    number
  /** Moon azimuth in degrees */
  azimuth:      number
}

export interface AstronomyResult {
  solar:  SolarPosition
  events: SolarEvents
  moon:   MoonData
}

// ── Constants ─────────────────────────────────────────────────

const DEG = Math.PI / 180
const RAD = 180 / Math.PI
const J2000 = 2451545.0

// ── Julian Date ───────────────────────────────────────────────

export function toJulianDate(date: Date): number {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate()
    + date.getUTCHours()   / 24
    + date.getUTCMinutes() / 1440
    + date.getUTCSeconds() / 86400

  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  const y2 = m <= 2 ? y - 1 : y
  const m2 = m <= 2 ? m + 12 : m

  return Math.floor(365.25 * (y2 + 4716))
    + Math.floor(30.6001 * (m2 + 1))
    + d + B - 1524.5
}

// ── Normalize helpers ─────────────────────────────────────────

function normDeg(d: number): number { return ((d % 360) + 360) % 360 }

// ── Solar position ────────────────────────────────────────────

export function calcSolarPosition(
  date: Date,
  lat:  number,
  lon:  number,
): SolarPosition {
  const JD = toJulianDate(date)
  const n  = JD - J2000

  // Mean longitude and mean anomaly (degrees)
  const L = normDeg(280.460 + 0.9856474 * n)
  const g = normDeg(357.528 + 0.9856003 * n)
  const gR = g * DEG

  // Ecliptic longitude
  const lambda = normDeg(L + 1.915 * Math.sin(gR) + 0.020 * Math.sin(2 * gR))
  const lambdaR = lambda * DEG

  // Obliquity of ecliptic
  const epsilon = (23.439 - 0.0000004 * n) * DEG

  // Right ascension & declination
  const sinLambda = Math.sin(lambdaR)
  const RA  = Math.atan2(Math.cos(epsilon) * sinLambda, Math.cos(lambdaR)) * RAD
  const dec = Math.asin(Math.sin(epsilon)  * sinLambda) * RAD

  // Equation of time (minutes)
  const eqTime = 4 * (L - 0.0057183 - RA + 360 * Math.floor((L - RA) / 360 + 0.5))

  // Solar noon (UTC decimal hours)
  const solarNoon = 12 - lon / 15 - eqTime / 60

  // Hour angle
  const utcH   = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  const hourAngle = (utcH - solarNoon) * 15

  // Elevation & azimuth
  const latR = lat * DEG
  const decR = dec * DEG
  const haR  = hourAngle * DEG

  const sinAlt = Math.sin(latR) * Math.sin(decR)
    + Math.cos(latR) * Math.cos(decR) * Math.cos(haR)
  const elevation = Math.asin(sinAlt) * RAD

  const cosAz = (Math.sin(decR) - Math.sin(latR) * sinAlt)
    / (Math.cos(latR) * Math.cos(Math.asin(sinAlt)))
  const azRaw = Math.acos(Math.max(-1, Math.min(1, cosAz))) * RAD
  const azimuth = hourAngle > 0 ? normDeg(180 + azRaw) : normDeg(180 - azRaw)

  // Earth-Sun distance (AU)
  const distance = 1.00014
    - 0.01671 * Math.cos(gR)
    - 0.00014 * Math.cos(2 * gR)

  return {
    elevation:      Math.round(elevation * 100) / 100,
    azimuth:        Math.round(azimuth   * 100) / 100,
    solarNoon:      Math.round(solarNoon * 1000) / 1000,
    equationOfTime: Math.round(eqTime   * 100)  / 100,
    declination:    Math.round(dec      * 100)  / 100,
    hourAngle:      Math.round(hourAngle * 100)  / 100,
    distance:       Math.round(distance  * 10000) / 10000,
  }
}

// ── Solar events (rise/set) ───────────────────────────────────

function calcRiseSet(
  date:        Date,
  lat:         number,
  lon:         number,
  depression:  number = 0.833,  // standard refraction
): { rise: number | null; set: number | null; noon: number } {
  const JD = toJulianDate(date)
  const n  = JD - J2000

  const L = normDeg(280.460 + 0.9856474 * n)
  const g = normDeg(357.528 + 0.9856003 * n) * DEG
  const lambda = normDeg(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * DEG
  const epsilon = (23.439 - 0.0000004 * n) * DEG
  const RA  = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)) * RAD
  const dec = Math.asin(Math.sin(epsilon) * Math.sin(lambda)) * RAD
  const eqTime = 4 * ((L - 0.0057183 - RA + 360 * Math.floor((L - RA) / 360 + 0.5)))
  const noon = 12 - lon / 15 - eqTime / 60

  const latR = lat * DEG
  const decR = dec * DEG
  const cosH = (Math.sin(-depression * DEG) - Math.sin(latR) * Math.sin(decR))
    / (Math.cos(latR) * Math.cos(decR))

  if (cosH < -1) return { rise: null, set: null, noon } // midnight sun
  if (cosH >  1) return { rise: null, set: null, noon } // polar night

  const H = Math.acos(cosH) * RAD
  return {
    rise: noon - H / 15,
    set:  noon + H / 15,
    noon,
  }
}

export function calcSolarEvents(
  date: Date,
  lat:  number,
  lon:  number,
): SolarEvents {
  const { rise, set, noon } = calcRiseSet(date, lat, lon, 0.833)
  const civil               = calcRiseSet(date, lat, lon, 6.0)

  return {
    sunrise:   rise !== null ? Math.round(rise * 1000) / 1000 : null,
    sunset:    set  !== null ? Math.round(set  * 1000) / 1000 : null,
    solarNoon: Math.round(noon * 1000) / 1000,
    dayLength: rise !== null && set !== null
      ? Math.round((set - rise) * 100) / 100
      : null,
    dawnCivil: civil.rise !== null ? Math.round(civil.rise * 1000) / 1000 : null,
    duskCivil: civil.set  !== null ? Math.round(civil.set  * 1000) / 1000 : null,
  }
}

// ── Moon data ─────────────────────────────────────────────────

export function calcMoonData(
  date: Date,
  lat:  number,
  lon:  number,
): MoonData {
  const JD = toJulianDate(date)
  const T  = (JD - J2000) / 36525

  // Moon mean longitude
  const Lm = normDeg(218.3164477
    + 481267.88123421 * T
    - 0.0015786 * T * T)

  // Moon mean anomaly
  const Mm = normDeg(134.9633964
    + 477198.8675055 * T
    + 0.0087414 * T * T)

  // Sun mean anomaly
  const Ms = normDeg(357.5291092 + 35999.0502909 * T)

  // Moon argument of latitude
  const F = normDeg(93.2720950
    + 483202.0175233 * T
    - 0.0036539 * T * T)

  // Moon elongation
  const D = normDeg(297.8501921
    + 445267.1114034 * T
    - 0.1851644 * T * T)

  // Phase angle
  const phaseAngle = normDeg(
    180
    - D * 1.0
    - 6.289 * Math.sin(Mm * DEG)
    + 2.100 * Math.sin(Ms * DEG)
    - 1.274 * Math.sin((2 * D - Mm) * DEG)
    - 0.658 * Math.sin(2 * D * DEG)
    - 0.214 * Math.sin(2 * Mm * DEG)
    - 0.110 * Math.sin(D * DEG)
  )

  const illumination = Math.round((1 + Math.cos(phaseAngle * DEG)) / 2 * 100)

  // Phase cycle (synodic month = 29.53059 days)
  const knownNew = 2451549.5 // Jan 6, 2000 new moon
  const cycle    = 29.53059
  const age      = ((JD - knownNew) % cycle + cycle) % cycle
  const phase    = age / cycle

  // Phase name
  let phaseName: string
  if      (age < 1.85)  phaseName = 'New Moon'
  else if (age < 7.38)  phaseName = 'Waxing Crescent'
  else if (age < 9.22)  phaseName = 'First Quarter'
  else if (age < 14.77) phaseName = 'Waxing Gibbous'
  else if (age < 16.61) phaseName = 'Full Moon'
  else if (age < 22.15) phaseName = 'Waning Gibbous'
  else if (age < 23.99) phaseName = 'Last Quarter'
  else                  phaseName = 'Waning Crescent'

  // Moon distance (simplified)
  const distance = Math.round(
    385001
    - 20905 * Math.cos(Mm * DEG)
    - 3699  * Math.cos((2 * D - Mm) * DEG)
    - 2956  * Math.cos(2 * D * DEG)
  )

  // Moon ecliptic coordinates → equatorial → horizontal
  const lambdaM = normDeg(
    Lm
    + 6.289 * Math.sin(Mm * DEG)
    - 1.274 * Math.sin((2 * D - Mm) * DEG)
    + 0.658 * Math.sin(2 * D * DEG)
    - 0.186 * Math.sin(Ms * DEG)
    - 0.059 * Math.sin((2 * D - 2 * Mm) * DEG)
    - 0.057 * Math.sin((2 * D - Mm - Ms) * DEG)
    + 0.053 * Math.sin((2 * D + Mm) * DEG)
    + 0.046 * Math.sin((2 * D - Ms) * DEG)
    + 0.041 * Math.sin((Mm - Ms) * DEG)
  )
  const betaM = normDeg(
    5.128 * Math.sin(F * DEG)
    + 0.280 * Math.sin((Mm + F) * DEG)
    + 0.277 * Math.sin((Mm - F) * DEG)
    + 0.173 * Math.sin((2 * D - F) * DEG)
  )

  const epsilon = 23.439 - 0.0000004 * (JD - J2000)
  const lambdaMR = lambdaM * DEG
  const betaMR   = betaM   * DEG
  const epsilonR = epsilon * DEG

  const RAm  = Math.atan2(
    Math.sin(lambdaMR) * Math.cos(epsilonR) - Math.tan(betaMR) * Math.sin(epsilonR),
    Math.cos(lambdaMR),
  ) * RAD

  const decM = Math.asin(
    Math.sin(betaMR) * Math.cos(epsilonR)
    + Math.cos(betaMR) * Math.sin(epsilonR) * Math.sin(lambdaMR),
  ) * RAD

  // Local hour angle
  const GMST = normDeg(280.46061837 + 360.98564736629 * (JD - J2000))
  const LST  = normDeg(GMST + lon)
  const HA   = normDeg(LST - RAm)

  const latR = lat * DEG
  const decR = decM * DEG
  const haR  = HA  * DEG

  const sinAlt = Math.sin(latR) * Math.sin(decR)
    + Math.cos(latR) * Math.cos(decR) * Math.cos(haR)
  const moonElevation = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * RAD

  const cosAz = (Math.sin(decR) - Math.sin(latR) * sinAlt)
    / (Math.cos(latR) * Math.cos(Math.asin(Math.max(-1, Math.min(1, sinAlt)))))
  const azRaw = Math.acos(Math.max(-1, Math.min(1, cosAz))) * RAD
  const moonAzimuth = HA > 180 ? normDeg(180 + azRaw) : normDeg(180 - azRaw)

  return {
    phaseName,
    phase:        Math.round(phase * 1000) / 1000,
    illumination,
    age:          Math.round(age  * 10) / 10,
    distance,
    elevation:    Math.round(moonElevation * 100) / 100,
    azimuth:      Math.round(moonAzimuth   * 100) / 100,
  }
}

// ── Decimal hours → HH:MM string ─────────────────────────────

export function decimalHoursToHHMM(h: number, utcOffset = 0): string {
  const local   = ((h + utcOffset) % 24 + 24) % 24
  const hh      = Math.floor(local)
  const mm      = Math.floor((local - hh) * 60)
  return `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}`
}

// ── Master function ───────────────────────────────────────────

export function calcAstronomy(
  date: Date,
  lat:  number,
  lon:  number,
): AstronomyResult {
  return {
    solar:  calcSolarPosition(date, lat, lon),
    events: calcSolarEvents(date, lat, lon),
    moon:   calcMoonData(date, lat, lon),
  }
}