// ============================================================
// Prayer Computation Engine — Pure TypeScript
// Based on astronomical calculations — no external APIs
// Methods: MWL, ISNA, Egypt, Makkah, Karachi, Tehran, Jafari
// ============================================================

import { toJulianDate } from './astronomy'

// ── Types ─────────────────────────────────────────────────────

export interface PrayerTimes {
  fajr:    number | null   // decimal hours UTC
  sunrise: number | null
  dhuhr:   number | null
  asr:     number | null
  maghrib: number | null
  isha:    number | null
}

export interface PrayerSchedule {
  times:        PrayerTimes
  nextPrayer:   PrayerName | null
  currentPrayer: PrayerName | null
  secondsToNext: number
  method:       PrayerMethod
}

export type PrayerName =
  | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

export type PrayerMethod =
  | 'MWL'      // Muslim World League
  | 'ISNA'     // Islamic Society of North America
  | 'Egypt'    // Egyptian General Authority
  | 'Makkah'   // Umm Al-Qura University
  | 'Karachi'  // University of Islamic Sciences Karachi

export interface MethodParams {
  fajrAngle:    number   // solar depression angle for Fajr
  ishaAngle:    number   // solar depression angle for Isha
  asrFactor:    number   // 1 = Shafi, 2 = Hanafi
  description:  string
}

// ── Method parameters ─────────────────────────────────────────

export const PRAYER_METHODS: Record<PrayerMethod, MethodParams> = {
  MWL: {
    fajrAngle:   18,
    ishaAngle:   17,
    asrFactor:   1,
    description: 'Muslim World League — used in Europe, Far East, parts of US',
  },
  ISNA: {
    fajrAngle:   15,
    ishaAngle:   15,
    asrFactor:   1,
    description: 'Islamic Society of North America — used in North America',
  },
  Egypt: {
    fajrAngle:   19.5,
    ishaAngle:   17.5,
    asrFactor:   1,
    description: 'Egyptian General Authority — used in Africa, Syria, Lebanon',
  },
  Makkah: {
    fajrAngle:   18.5,
    ishaAngle:   90,    // Isha = 90 min after Maghrib (special case)
    asrFactor:   1,
    description: 'Umm Al-Qura, Makkah — used in Arabian Peninsula',
  },
  Karachi: {
    fajrAngle:   18,
    ishaAngle:   18,
    asrFactor:   1,
    description: 'Karachi — used in Pakistan, Bangladesh, India, Afghanistan',
  },
}

// ── Constants ──────────────────────────────────────────────────
const DEG = Math.PI / 180
const RAD = 180 / Math.PI
const J2000 = 2451545.0

// ── Core math ─────────────────────────────────────────────────

function normDeg(d: number): number {
  return ((d % 360) + 360) % 360
}

function getSunDeclAndEqTime(date: Date): {
  declination: number
  equationOfTime: number
  solarNoon: (lon: number) => number
} {
  const JD = toJulianDate(date)
  const n  = JD - J2000

  const L = normDeg(280.460 + 0.9856474 * n)
  const g = normDeg(357.528 + 0.9856003 * n) * DEG

  const lambda = normDeg(
    L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)
  ) * DEG

  const epsilon   = (23.439 - 0.0000004 * n) * DEG
  const sinLambda = Math.sin(lambda)
  const RA        = Math.atan2(
    Math.cos(epsilon) * sinLambda,
    Math.cos(lambda),
  ) * RAD

  const declination   = Math.asin(Math.sin(epsilon) * sinLambda) * RAD
  const equationOfTime = 4 * (
    L - 0.0057183 - RA
    + 360 * Math.floor((L - RA) / 360 + 0.5)
  )

  return {
    declination,
    equationOfTime,
    solarNoon: (lon: number) => 12 - lon / 15 - equationOfTime / 60,
  }
}

/**
 * Calculate time when sun reaches a given angle below horizon.
 * @param angle   Solar depression (positive = below horizon)
 * @param lat     Observer latitude
 * @param decl    Solar declination
 * @param noon    Solar noon in decimal UTC hours
 * @param after   true = afternoon (set), false = morning (rise)
 */
function angleTime(
  angle:  number,
  lat:    number,
  decl:   number,
  noon:   number,
  after:  boolean,
): number | null {
  const latR  = lat  * DEG
  const declR = decl * DEG

  const cosH = (Math.sin(-angle * DEG) - Math.sin(latR) * Math.sin(declR))
    / (Math.cos(latR) * Math.cos(declR))

  if (cosH < -1 || cosH > 1) return null  // midnight sun / polar night

  const H = Math.acos(cosH) * RAD
  return after ? noon + H / 15 : noon - H / 15
}

/**
 * Asr time using shadow length method.
 * factor = 1 (Shafi/Maliki/Hanbali) or 2 (Hanafi)
 */
function asrTime(
  factor: number,
  lat:    number,
  decl:   number,
  noon:   number,
): number | null {
  const latR  = lat  * DEG
  const declR = decl * DEG
  const target = Math.atan(1 / (factor + Math.tan(Math.abs(latR - declR))))
  return angleTime(-target * RAD, lat, decl, noon, true)
}

// ── Main calculation ──────────────────────────────────────────

export function calcPrayerTimes(
  date:   Date,
  lat:    number,
  lon:    number,
  method: PrayerMethod = 'MWL',
): PrayerTimes {
  const params = PRAYER_METHODS[method]
  const { declination, solarNoon } = getSunDeclAndEqTime(date)
  const noon = solarNoon(lon)
  const decl = declination

  const fajr    = angleTime(params.fajrAngle, lat, decl, noon, false)
  const sunrise = angleTime(0.833,             lat, decl, noon, false)
  const dhuhr   = noon
  const asr     = asrTime(params.asrFactor,   lat, decl, noon)
  const maghrib = angleTime(0.833,             lat, decl, noon, true)

  let isha: number | null
  if (method === 'Makkah' && maghrib !== null) {
    // Isha = 90 minutes after Maghrib for Makkah method
    isha = maghrib + 90 / 60
  } else {
    isha = angleTime(params.ishaAngle, lat, decl, noon, true)
  }

  return { fajr, sunrise, dhuhr, asr, maghrib, isha }
}

// ── Schedule builder ──────────────────────────────────────────

export const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  fajr:    'Fajr',
  sunrise: 'Sunrise',
  dhuhr:   'Dhuhr',
  asr:     'Asr',
  maghrib: 'Maghrib',
  isha:    'Isha',
}

export const PRAYER_ORDER: PrayerName[] = [
  'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha',
]

/**
 * Convert decimal UTC hours to local decimal hours.
 */
function toLocal(utcH: number, utcOffset: number): number {
  return ((utcH + utcOffset) % 24 + 24) % 24
}

/**
 * Convert decimal hours to HH:MM string.
 */
export function prayerTimeToString(
  h: number | null,
  utcOffset: number,
): string {
  if (h === null) return '--:--'
  const local = toLocal(h, utcOffset)
  const hh    = Math.floor(local)
  const mm    = Math.floor((local - hh) * 60)
  return `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}`
}

/**
 * Determine current and next prayer from simTime.
 * Returns current prayer window + seconds until next prayer.
 */
export function calcPrayerSchedule(
  date:      Date,
  lat:       number,
  lon:       number,
  utcOffset: number,
  method:    PrayerMethod = 'MWL',
): PrayerSchedule {
  const times = calcPrayerTimes(date, lat, lon, method)

  // Current time in decimal local hours
  const nowUTC   = date.getUTCHours()
    + date.getUTCMinutes()   / 60
    + date.getUTCSeconds()   / 3600

  const nowLocal = toLocal(nowUTC, utcOffset)

  // Build ordered list with local hours
  const ordered: { name: PrayerName; local: number }[] = PRAYER_ORDER
    .map((name) => ({
      name,
      local: times[name] !== null ? toLocal(times[name]!, utcOffset) : -1,
    }))
    .filter((p) => p.local >= 0)

  let currentPrayer: PrayerName | null  = null
  let nextPrayer:    PrayerName | null  = null
  let secondsToNext: number             = 0

  for (let i = 0; i < ordered.length; i++) {
    if (nowLocal >= ordered[i].local) {
      currentPrayer = ordered[i].name
      const nextItem = ordered[i + 1] ?? ordered[0]
      nextPrayer = nextItem.name

      // Seconds to next
      let diff = nextItem.local - nowLocal
      if (diff < 0) diff += 24
      secondsToNext = Math.round(diff * 3600)
    }
  }

  // Before first prayer of day
  if (currentPrayer === null && ordered.length > 0) {
    nextPrayer    = ordered[0].name
    const diff    = ordered[0].local - nowLocal
    secondsToNext = Math.round((diff < 0 ? diff + 24 : diff) * 3600)
  }

  return { times, nextPrayer, currentPrayer, secondsToNext, method }
}

/**
 * Format countdown seconds → HH:MM:SS
 */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((v) => v.toString().padStart(2, '0')).join(':')
}