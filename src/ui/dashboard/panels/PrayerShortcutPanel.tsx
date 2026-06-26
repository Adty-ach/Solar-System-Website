import { useUIStore }    from '../../../store/useUIStore'
import { usePrayerStore } from '../../../store/usePrayerStore'
import { useLocationStore } from '../../../store/useLocationStore'
import {
  PRAYER_ORDER,
  PRAYER_DISPLAY_NAMES,
  prayerTimeToString,
} from '../../../engines/prayer'

export function PrayerShortcutPanel() {
  const closeDashboard = useUIStore((s) => s.closeDashboard)
  const schedule       = usePrayerStore((s) => s.schedule)
  const utcOffset      = useLocationStore((s) => s.utcOffset)

  // Expose the existing PrayerObservatory via App-level state
  // We use a custom event to signal App.tsx to show it
  function openPrayerObservatory() {
    closeDashboard()
    // Dispatch custom event — App.tsx listens for this
    window.dispatchEvent(new CustomEvent('open-prayer-observatory'))
  }

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>
      <div style={{ textAlign: 'center', padding: '16px 0 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🕌</div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#A78BFA', marginBottom: '8px' }}>
          Prayer Observatory
        </div>
        <div style={{
          fontSize:     '12px',
          color:        'rgba(255,255,255,0.5)',
          lineHeight:   '1.6',
          marginBottom: '20px',
        }}>
          Astronomically calculated prayer times with live countdown
          and multiple calculation methods.
        </div>
        <button
          onClick={openPrayerObservatory}
          style={{
            padding:      '10px 28px',
            borderRadius: '10px',
            background:   'rgba(167,139,250,0.2)',
            border:       '1px solid rgba(167,139,250,0.5)',
            color:        '#A78BFA',
            cursor:       'pointer',
            fontSize:     '13px',
            fontWeight:   600,
            fontFamily:   'system-ui',
          }}
        >
          Open Prayer Observatory →
        </button>
      </div>

      {/* Preview today's times */}
      {schedule && (
        <div style={{
          padding:      '12px 14px',
          borderRadius: '10px',
          background:   'rgba(167,139,250,0.06)',
          border:       '1px solid rgba(167,139,250,0.15)',
        }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
            Today's Schedule
          </div>
          {PRAYER_ORDER.map((name) => (
            <div key={name} style={{
              display:        'flex',
              justifyContent: 'space-between',
              padding:        '4px 0',
              borderBottom:   '1px solid rgba(255,255,255,0.04)',
              fontSize:       '12px',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                {PRAYER_DISPLAY_NAMES[name]}
              </span>
              <span style={{ color: '#E2E8F0', fontWeight: 500, fontFamily: 'monospace' }}>
                {prayerTimeToString(schedule.times[name], utcOffset)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}