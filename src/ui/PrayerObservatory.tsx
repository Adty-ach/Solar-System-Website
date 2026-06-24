import { motion }            from 'framer-motion'
import { usePrayerStore }    from '../store/usePrayerStore'
import { useSimStore }       from '../store/useSimStore'
import { useLocationStore }  from '../store/useLocationStore'
import {
  PRAYER_ORDER,
  PRAYER_DISPLAY_NAMES,
  PRAYER_METHODS,
  prayerTimeToString,
  formatCountdown,
} from '../engines/prayer'
import type { PrayerMethod, PrayerName } from '../engines/prayer'

const PRAYER_ICONS: Record<PrayerName, string> = {
  fajr:    '🌙',
  sunrise: '🌅',
  dhuhr:   '☀️',
  asr:     '🌤',
  maghrib: '🌇',
  isha:    '🌃',
}

const PRAYER_COLORS: Record<PrayerName, string> = {
  fajr:    '#818CF8',
  sunrise: '#FBBF24',
  dhuhr:   '#F59E0B',
  asr:     '#FB923C',
  maghrib: '#F87171',
  isha:    '#60A5FA',
}

const PRAYER_DESC: Record<PrayerName, string> = {
  fajr:    'Dawn prayer — begins when sun is 18° below horizon',
  sunrise: 'End of Fajr — moment sun appears above horizon',
  dhuhr:   'Midday prayer — begins at solar noon',
  asr:     'Afternoon — when shadow equals object height plus noon shadow',
  maghrib: 'Sunset prayer — immediately after sun dips below horizon',
  isha:    'Night prayer — sun 17° below horizon, twilight disappears',
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{
      fontSize:      '9px',
      color:         '#A78BFA',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginTop:     '14px',
      marginBottom:  '6px',
      borderBottom:  '1px solid rgba(167,139,250,0.2)',
      paddingBottom: '3px',
    }}>
      {text}
    </div>
  )
}

function PrayerRow({ name, timeStr, isCurrent, isNext }: {
  name:      PrayerName
  timeStr:   string
  isCurrent: boolean
  isNext:    boolean
}) {
  const color = PRAYER_COLORS[name]
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      padding:      '8px 10px',
      borderRadius: '10px',
      marginBottom: '4px',
      background:   isCurrent
        ? `${color}22`
        : isNext ? 'rgba(255,255,255,0.04)' : 'transparent',
      border: isCurrent
        ? `1px solid ${color}55`
        : isNext ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
    }}>
      <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
        {PRAYER_ICONS[name]}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize:   '13px',
          fontWeight: isCurrent ? 600 : 400,
          color:      isCurrent ? color : '#E2E8F0',
        }}>
          {PRAYER_DISPLAY_NAMES[name]}
        </div>
        {isCurrent && (
          <div style={{ fontSize: '10px', color: `${color}AA`, marginTop: '1px' }}>
            Current prayer
          </div>
        )}
        {isNext && !isCurrent && (
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
            Up next
          </div>
        )}
      </div>
      <div style={{
        fontSize:   '14px',
        fontWeight: 600,
        color:      isCurrent ? color : isNext ? '#fff' : 'rgba(255,255,255,0.6)',
        fontFamily: 'monospace',
      }}>
        {timeStr}
      </div>
    </div>
  )
}

interface PrayerObservatoryProps {
  onClose: () => void
}

export function PrayerObservatory({ onClose }: PrayerObservatoryProps) {
  const schedule    = usePrayerStore((s) => s.schedule)
  const method      = usePrayerStore((s) => s.method)
  const setMethod   = usePrayerStore((s) => s.setMethod)
  const simTime     = useSimStore((s) => s.simTime)
  const utcOffset   = useLocationStore((s) => s.utcOffset)
  const countryName = useLocationStore((s) => s.countryName)

  // ── Countdown dihitung langsung dari simTime ──────────────
  const liveCountdown = (() => {
    if (!schedule?.nextPrayer || !schedule.times[schedule.nextPrayer]) return '--:--:--'

    const nextUTC   = schedule.times[schedule.nextPrayer]!
    const nowUTC    = simTime.getUTCHours()
      + simTime.getUTCMinutes() / 60
      + simTime.getUTCSeconds() / 3600

    let diff = nextUTC - nowUTC
    if (diff < 0) diff += 24   // next day

    return formatCountdown(Math.round(diff * 3600))
  })()

  const dateStr = simTime.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'UTC',
  })

  const nextName    = schedule?.nextPrayer
  const currentName = schedule?.currentPrayer

  return (
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
        width:          '300px',
        background:     'rgba(5, 5, 20, 0.93)',
        border:         '1px solid rgba(167,139,250,0.3)',
        borderRadius:   '16px',
        backdropFilter: 'blur(16px)',
        padding:        '18px',
        zIndex:         20,
        fontFamily:     'system-ui, sans-serif',
        color:          '#fff',
        overflowY:      'auto',
        boxShadow:      '0 0 40px rgba(167,139,250,0.1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#A78BFA' }}>
            🕌 Prayer Observatory
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            {countryName} · {dateStr}
          </div>
        </div>
        <button
          onClick={onClose}
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

      {/* Countdown */}
      {nextName && (
        <div style={{
          textAlign:    'center',
          padding:      '16px 12px',
          background:   'rgba(167,139,250,0.08)',
          borderRadius: '12px',
          border:       '1px solid rgba(167,139,250,0.2)',
          marginTop:    '12px',
          marginBottom: '4px',
        }}>
          <div style={{
            fontSize:      '11px',
            color:         'rgba(255,255,255,0.45)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            Next Prayer
          </div>
          <div style={{
            fontSize:   '20px',
            fontWeight: 600,
            color:      PRAYER_COLORS[nextName],
            margin:     '4px 0 2px',
          }}>
            {PRAYER_ICONS[nextName]} {PRAYER_DISPLAY_NAMES[nextName]}
          </div>
          <div style={{
            fontSize:      '28px',
            fontWeight:    200,
            fontFamily:    'monospace',
            letterSpacing: '3px',
            color:         '#fff',
          }}>
            {liveCountdown}
          </div>
          <div style={{
            fontSize:  '10px',
            color:     'rgba(255,255,255,0.3)',
            marginTop: '4px',
          }}>
            {PRAYER_DESC[nextName]}
          </div>
        </div>
      )}

      {/* Schedule */}
      <SectionTitle text="Today's Schedule" />
      {schedule ? (
        PRAYER_ORDER.map((name) => (
          <PrayerRow
            key={name}
            name={name}
            timeStr={prayerTimeToString(schedule.times[name], utcOffset)}
            isCurrent={currentName === name}
            isNext={nextName === name && currentName !== name}
          />
        ))
      ) : (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '8px 0' }}>
          Calculating...
        </div>
      )}

      {/* Method selector */}
      <SectionTitle text="Calculation Method" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {(Object.keys(PRAYER_METHODS) as PrayerMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            style={{
              padding:      '7px 10px',
              borderRadius: '8px',
              border:       method === m
                ? '1px solid rgba(167,139,250,0.5)'
                : '1px solid rgba(255,255,255,0.07)',
              background:   method === m
                ? 'rgba(167,139,250,0.15)'
                : 'transparent',
              color:        method === m ? '#A78BFA' : 'rgba(255,255,255,0.45)',
              cursor:       'pointer',
              fontSize:     '11px',
              textAlign:    'left',
              fontWeight:   method === m ? 600 : 400,
            }}
          >
            <span style={{ fontWeight: 600 }}>{m}</span>
            <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '10px' }}>
              Fajr {PRAYER_METHODS[m].fajrAngle}° / Isha {PRAYER_METHODS[m].ishaAngle}°
            </span>
          </button>
        ))}
      </div>

      {/* Science note */}
      <div style={{
        marginTop:    '14px',
        padding:      '10px 12px',
        background:   'rgba(167,139,250,0.06)',
        borderRadius: '10px',
        border:       '1px solid rgba(167,139,250,0.12)',
        fontSize:     '11px',
        color:        'rgba(255,255,255,0.45)',
        lineHeight:   '1.6',
      }}>
        💡 Prayer times are derived from solar geometry. Fajr and Isha use depression angles, Dhuhr uses solar noon, and Asr uses shadow length — all calculated astronomically.
      </div>
    </motion.div>
  )
}