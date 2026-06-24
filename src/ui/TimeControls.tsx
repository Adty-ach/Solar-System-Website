import React              from 'react'
import { useSimStore, SPEED_OPTIONS } from '../store/useSimStore'
import { useSimTime }     from '../hooks/useSimTime'
import type { SpeedMultiplier } from '../store/useSimStore'

const SPEED_LABEL: Record<number, string> = {
  1:      '1×',
  10:     '10×',
  100:    '100×',
  1000:   '1K×',
  10000:  '10K×',
  100000: '100K×',
}

// Jump presets in milliseconds
const JUMPS: { label: string; ms: number }[] = [
  { label: '+1D',   ms: 86_400_000              },
  { label: '+1M',   ms: 30  * 86_400_000        },
  { label: '+1Y',   ms: 365 * 86_400_000        },
  { label: '+10Y',  ms: 3650 * 86_400_000       },
  { label: '+100Y', ms: 36500 * 86_400_000      },
]

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC',
  })
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  })
}

function formatElapsed(epochMs: number, simMs: number): string {
  const diffMs   = simMs - epochMs
  const sign     = diffMs < 0 ? '-' : '+'
  const absDiff  = Math.abs(diffMs)
  const days     = absDiff / 86_400_000
  const years    = Math.floor(days / 365.25)
  const months   = Math.floor((days % 365.25) / 30.44)

  if (years > 0) return `${sign}${years}y ${months}mo`
  if (months > 0) return `${sign}${months}mo ${Math.floor(days % 30.44)}d`
  return `${sign}${Math.floor(days)}d`
}

export function TimeControls(): React.ReactElement {
  useSimTime()

  const simTime    = useSimStore((s) => s.simTime)
  const epochMs    = useSimStore((s) => s.epochMs)
  const paused     = useSimStore((s) => s.paused)
  const speed      = useSimStore((s) => s.speedMultiplier)
  const togglePause    = useSimStore((s) => s.togglePause)
  const setSpeed       = useSimStore((s) => s.setSpeedMultiplier)
  const resetToEpoch   = useSimStore((s) => s.resetToEpoch)
  const jumpBy         = useSimStore((s) => s.jumpBy)

  const elapsed = formatElapsed(epochMs, simTime.getTime())
  const isAtEpoch = Math.abs(simTime.getTime() - epochMs) < 5000

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      gap:            '8px',
      padding:        '12px 16px',
      borderRadius:   '16px',
      background:     'rgba(3,8,20,0.88)',
      border:         '1px solid rgba(100,160,255,0.2)',
      backdropFilter: 'blur(14px)',
      color:          '#fff',
      fontFamily:     'monospace',
      userSelect:     'none',
      minWidth:       '400px',
    }}>

      {/* ── Time display ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{
            fontSize:      '9px',
            color:         'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom:  '2px',
          }}>
            Simulation Time
          </div>
          <div style={{ fontSize: '18px', fontWeight: 300, color: '#93C5FD', letterSpacing: '1px' }}>
            {formatDate(simTime)}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
            {formatTime(simTime)} UTC
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize:  '10px',
            color:     isAtEpoch ? 'rgba(255,255,255,0.2)' : '#60A5FA',
            marginBottom: '2px',
          }}>
            Elapsed: {isAtEpoch ? '—' : elapsed}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
            Epoch: {formatDate(new Date(epochMs))}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

      {/* ── Playback controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

        {/* Play/Pause */}
        <button
          onClick={togglePause}
          aria-label={paused ? 'Resume' : 'Pause'}
          style={{
            width:        '34px',
            height:       '34px',
            borderRadius: '10px',
            background:   'rgba(255,255,255,0.1)',
            border:       '1px solid rgba(255,255,255,0.15)',
            color:        '#fff',
            fontSize:     '13px',
            cursor:       'pointer',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            flexShrink:   0,
          }}
        >
          {paused ? '▶' : '⏸'}
        </button>

        {/* Speed buttons */}
        <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s as SpeedMultiplier)}
              style={{
                flex:         1,
                padding:      '6px 0',
                borderRadius: '8px',
                fontSize:     '10px',
                fontWeight:   600,
                fontFamily:   'monospace',
                cursor:       'pointer',
                border:       speed === s
                  ? '1px solid rgba(99,179,237,0.6)'
                  : '1px solid rgba(255,255,255,0.08)',
                background:   speed === s
                  ? 'rgba(59,130,246,0.4)'
                  : 'rgba(255,255,255,0.05)',
                color:        speed === s ? '#fff' : 'rgba(255,255,255,0.45)',
              }}
            >
              {SPEED_LABEL[s]}
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={resetToEpoch}
          title="Reset to start date"
          style={{
            height:       '34px',
            padding:      '0 10px',
            borderRadius: '10px',
            background:   isAtEpoch
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(59,130,246,0.15)',
            border:       isAtEpoch
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(59,130,246,0.4)',
            color:        isAtEpoch ? 'rgba(255,255,255,0.25)' : '#93C5FD',
            cursor:       isAtEpoch ? 'default' : 'pointer',
            fontSize:     '13px',
            flexShrink:   0,
          }}
        >
          ⟲
        </button>
      </div>

      {/* ── Time jump presets ── */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{
          fontSize:   '9px',
          color:      'rgba(255,255,255,0.25)',
          whiteSpace: 'nowrap',
          marginRight:'2px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Jump
        </span>
        {JUMPS.map((j) => (
          <button
            key={j.label}
            onClick={() => jumpBy(j.ms)}
            style={{
              flex:         1,
              padding:      '5px 0',
              borderRadius: '7px',
              fontSize:     '10px',
              fontWeight:   600,
              fontFamily:   'monospace',
              cursor:       'pointer',
              border:       '1px solid rgba(255,255,255,0.08)',
              background:   'rgba(255,255,255,0.04)',
              color:        'rgba(255,255,255,0.5)',
              transition:   'all 0.15s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(59,130,246,0.2)'
              el.style.color      = '#93C5FD'
              el.style.border     = '1px solid rgba(59,130,246,0.3)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(255,255,255,0.04)'
              el.style.color      = 'rgba(255,255,255,0.5)'
              el.style.border     = '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {j.label}
          </button>
        ))}
        <button
          onClick={() => jumpBy(-365 * 86_400_000)}
          style={{
            flex:         1,
            padding:      '5px 0',
            borderRadius: '7px',
            fontSize:     '10px',
            fontWeight:   600,
            fontFamily:   'monospace',
            cursor:       'pointer',
            border:       '1px solid rgba(255,255,255,0.08)',
            background:   'rgba(255,255,255,0.04)',
            color:        'rgba(255,255,255,0.5)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(239,68,68,0.15)'
            el.style.color      = '#F87171'
            el.style.border     = '1px solid rgba(239,68,68,0.3)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(255,255,255,0.04)'
            el.style.color      = 'rgba(255,255,255,0.5)'
            el.style.border     = '1px solid rgba(255,255,255,0.08)'
          }}
        >
          −1Y
        </button>
      </div>

      {/* Paused badge */}
      {paused && (
        <div style={{
          textAlign:     'center',
          fontSize:      '10px',
          color:         '#FBBF24',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          ⏸ Paused
        </div>
      )}
    </div>
  )
}