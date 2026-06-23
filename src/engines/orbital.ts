// ============================================================
// Orbital Engine — Pure TypeScript, no React, no Three.js
// Uses simplified Keplerian mechanics with J2000.0 epoch
// Reference: NASA Jet Propulsion Laboratory planetary data
// ============================================================

// ── Types ────────────────────────────────────────────────────

export interface PlanetOrbitalData {
  name:          string
  /** Semi-major axis in AU */
  semiMajorAxis: number
  /** Orbital eccentricity (0 = circular) */
  eccentricity:  number
  /** Sidereal orbital period in Earth days */
  period:        number
  /** Mean longitude at J2000.0 epoch in degrees */
  meanLongitude: number
  /** Longitude of perihelion at J2000.0 in degrees */
  perihelion:    number
}

export interface OrbitalPosition {
  /** X position in AU (ecliptic plane) */
  x:             number
  /** Z position in AU (ecliptic plane, Y-up convention) */
  z:             number
  /** Current orbital angle in radians (0 = perihelion) */
  angle:         number
  /** Orbital progress 0–1 (0 = start of period) */
  progress:      number
  /** Distance from Sun in AU */
  distance:      number
}

export type PlanetName =
  | 'mercury' | 'venus' | 'earth' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune'

// ── Planetary constants (J2000.0 epoch) ──────────────────────
// Source: NASA/JPL Keplerian Elements for Approximate Positions
// https://ssd.jpl.nasa.gov/planets/approx_pos.html

export const PLANET_DATA: Record<PlanetName, PlanetOrbitalData> = {
  mercury: {
    name:          'Mercury',
    semiMajorAxis: 0.38709927,
    eccentricity:  0.20563593,
    period:        87.9691,
    meanLongitude: 252.25032350,
    perihelion:    77.45779628,
  },
  venus: {
    name:          'Venus',
    semiMajorAxis: 0.72333566,
    eccentricity:  0.00677672,
    period:        224.7008,
    meanLongitude: 181.97909950,
    perihelion:    131.60246718,
  },
  earth: {
    name:          'Earth',
    semiMajorAxis: 1.00000261,
    eccentricity:  0.01671123,
    period:        365.25,
    meanLongitude: 100.46457166,
    perihelion:    102.93768193,
  },
  mars: {
    name:          'Mars',
    semiMajorAxis: 1.52371034,
    eccentricity:  0.09339410,
    period:        686.9957,
    meanLongitude: 355.45332350,
    perihelion:    -23.94362959,
  },
  jupiter: {
    name:          'Jupiter',
    semiMajorAxis: 5.20288700,
    eccentricity:  0.04838624,
    period:        4332.5890,
    meanLongitude: 34.39644051,
    perihelion:    14.72847983,
  },
  saturn: {
    name:          'Saturn',
    semiMajorAxis: 9.53667594,
    eccentricity:  0.05386179,
    period:        10759.220,
    meanLongitude: 49.95424423,
    perihelion:    92.59887831,
  },
  uranus: {
    name:          'Uranus',
    semiMajorAxis: 19.18916464,
    eccentricity:  0.04725744,
    period:        30688.500,
    meanLongitude: 313.23810451,
    perihelion:    170.95427630,
  },
  neptune: {
    name:          'Neptune',
    semiMajorAxis: 30.06992276,
    eccentricity:  0.00859048,
    period:        60182.000,
    meanLongitude: 304.87997031,
    perihelion:    44.96476227,
  },
}

// ── Math helpers ─────────────────────────────────────────────

const DEG2RAD = Math.PI / 180

/** J2000.0 epoch in milliseconds */
const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0)

/** Days elapsed since J2000.0 */
function daysSinceJ2000(date: Date): number {
  return (date.getTime() - J2000_MS) / 86_400_000
}

/** Normalize angle to 0–360 degrees */
function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360
}

/**
 * Solve Kepler's equation: M = E - e * sin(E)
 * Uses Newton-Raphson iteration for accuracy.
 * @param M - Mean anomaly in radians
 * @param e - Eccentricity
 * @returns Eccentric anomaly in radians
 */
function solveKepler(M: number, e: number): number {
  let E = M // initial guess
  for (let i = 0; i < 10; i++) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E))
    E += dE
    if (Math.abs(dE) < 1e-9) break
  }
  return E
}

// ── Core calculations ─────────────────────────────────────────

/**
 * Calculate the orbital angle (true anomaly) of a planet at a given date.
 * @returns Angle in radians, 0 = perihelion
 */
export function calculateOrbitalAngle(
  planet: PlanetName,
  date: Date
): number {
  const data = PLANET_DATA[planet]
  const days = daysSinceJ2000(date)

  // Mean anomaly: how far along the orbit in a perfect circle
  const meanAnomaly = normalizeDeg(
    (data.meanLongitude - data.perihelion) + (360 / data.period) * days
  ) * DEG2RAD

  // Eccentric anomaly via Kepler's equation
  const E = solveKepler(meanAnomaly, data.eccentricity)

  // True anomaly: actual angular position accounting for eccentricity
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + data.eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - data.eccentricity) * Math.cos(E / 2)
  )

  return trueAnomaly
}

/**
 * Calculate orbital progress as a value between 0 and 1.
 * 0 = start of period, 1 = full orbit complete.
 */
export function calculateOrbitalProgress(
  planet: PlanetName,
  date: Date
): number {
  const data = PLANET_DATA[planet]
  const days = daysSinceJ2000(date)

  const raw = ((days % data.period) + data.period) % data.period
  return raw / data.period
}

/**
 * Calculate the 2D ecliptic position of a planet.
 * Returns x/z in AU (Three.js Y-up convention: orbital plane = XZ).
 *
 * Scale factor converts AU to scene units:
 *   - 1 AU = 10 scene units by default
 *   - Pass scaleAU to override (e.g. 50 for a larger scene)
 */
export function calculatePlanetPosition(
  planet: PlanetName,
  date: Date,
  scaleAU = 10
): OrbitalPosition {
  const data  = PLANET_DATA[planet]
  const angle = calculateOrbitalAngle(planet, date)

  // Distance from Sun at true anomaly (ellipse equation)
  const distance =
    (data.semiMajorAxis * (1 - data.eccentricity ** 2)) /
    (1 + data.eccentricity * Math.cos(angle))

  // Heliocentric ecliptic coordinates in AU
  const xAU = distance * Math.cos(angle)
  const zAU = distance * Math.sin(angle)

  return {
    x:        xAU * scaleAU,
    z:        zAU * scaleAU,
    angle,
    progress: calculateOrbitalProgress(planet, date),
    distance,
  }
}

/**
 * Get positions for all planets in one call.
 * Useful for driving the entire scene from a single simTime.
 */
export function calculateAllPlanetPositions(
  date: Date,
  scaleAU = 10
): Record<PlanetName, OrbitalPosition> {
  const names = Object.keys(PLANET_DATA) as PlanetName[]
  return Object.fromEntries(
    names.map((name) => [name, calculatePlanetPosition(name, date, scaleAU)])
  ) as Record<PlanetName, OrbitalPosition>
}