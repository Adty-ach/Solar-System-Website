import React from 'react'
import { useSimStore, SPEED_OPTIONS } from '../store/useSimStore'
import type { SpeedMultiplier } from '../store/useSimStore'
import { useSimTime } from '../hooks/useSimTime'

const SPEED_LABEL: Record<number, string> = {
  1:     '1×',
  10:    '10×',
  100:   '100×',
  1000:  '1K×',
  10000: '10K×',
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC',
  })
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC',
  }) + ' UTC'
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '14px 18px',
    borderRadius: '16px',
    background: 'rgba(0, 0, 0, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(12px)',
    color: '#fff',
    fontFamily: 'monospace',
    minWidth: '340px',
    userSelect: 'none',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  dateText: {
    fontSize: '13px',
    color: '#93c5fd',
    textAlign: 'right',
    lineHeight: '1',
  },
  timeText: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'right',
    marginTop: '3px',
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  playBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  speedGroup: {
    display: 'flex',
    gap: '4px',
    flex: 1,
  },
  pausedBadge: {
    textAlign: 'center',
    fontSize: '10px',
    color: '#fbbf24',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
}

// ── Sub-component ─────────────────────────────────────────
interface SpeedButtonProps {
  speed: SpeedMultiplier
  active: boolean
  onClick: () => void
}

function SpeedButton({ speed, active, onClick }: SpeedButtonProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '6px 0',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'monospace',
        cursor: 'pointer',
        border: active
          ? '1px solid rgba(99,179,237,0.6)'
          : '1px solid rgba(255,255,255,0.08)',
        background: active
          ? 'rgba(59,130,246,0.45)'
          : 'rgba(255,255,255,0.06)',
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        transition: 'all 0.15s',
      }}
    >
      {SPEED_LABEL[speed]}
    </button>
  )
}

// ── Main component ────────────────────────────────────────
export function TimeControls(): React.ReactElement {
  useSimTime()

  const simTime         = useSimStore((s) => s.simTime)
  const paused          = useSimStore((s) => s.paused)
  const speedMultiplier = useSimStore((s) => s.speedMultiplier)
  const togglePause     = useSimStore((s) => s.togglePause)
  const setSpeed        = useSimStore((s) => s.setSpeedMultiplier)

  return (
    <div style={styles.wrapper}>

      <div style={styles.topRow}>
        <span style={styles.label as React.CSSProperties}>Sim Time</span>
        <div>
          <div style={styles.dateText as React.CSSProperties}>
            {formatDate(simTime)}
          </div>
          <div style={styles.timeText as React.CSSProperties}>
            {formatTime(simTime)}
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.controlRow}>
        <button
          style={styles.playBtn}
          onClick={togglePause}
          aria-label={paused ? 'Resume' : 'Pause'}
        >
          {paused ? '▶' : '⏸'}
        </button>

        <div style={styles.speedGroup}>
          {SPEED_OPTIONS.map((s) => (
            <SpeedButton
              key={s}
              speed={s}
              active={speedMultiplier === s}
              onClick={() => setSpeed(s)}
            />
          ))}
        </div>
      </div>

      {paused && (
        <div style={styles.pausedBadge as React.CSSProperties}>
          ⏸ Paused
        </div>
      )}

    </div>
  )
}