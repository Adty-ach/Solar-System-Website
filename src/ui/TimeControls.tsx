import React from 'react'
import { useSimStore, SpeedMultiplier } from '../store/useSimStore'
import { useSimTime } from '../hooks/useSimTime'

const SPEEDS: SpeedMultiplier[] = [1, 10, 100, 1000, 10000]

const SPEED_LABEL: Record<SpeedMultiplier, string> = {
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

export function TimeControls(): React.ReactElement {
  // One mount point for the entire RAF loop
  useSimTime()

  const simTime         = useSimStore((s) => s.simTime)
  const paused          = useSimStore((s) => s.paused)
  const speedMultiplier = useSimStore((s) => s.speedMultiplier)
  const togglePause     = useSimStore((s) => s.togglePause)
  const setSpeed        = useSimStore((s) => s.setSpeedMultiplier)

  return (
    <div
      className="flex flex-col gap-2 px-4 py-3 rounded-2xl
                 bg-black/60 border border-white/10 backdrop-blur-md
                 text-white font-mono select-none min-w-[320px]"
    >
      {/* Sim date + time */}
      <div className="flex justify-between items-baseline">
        <span className="text-white/40 text-xs uppercase tracking-widest">
          Sim Time
        </span>
        <div className="text-right">
          <div className="text-sm text-blue-300 leading-none">
            {formatDate(simTime)}
          </div>
          <div className="text-xs text-white/60 mt-0.5">
            {formatTime(simTime)}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Controls row */}
      <div className="flex items-center gap-2">

        {/* Play / Pause */}
        <button
          onClick={togglePause}
          aria-label={paused ? 'Resume' : 'Pause'}
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     bg-white/10 hover:bg-white/20 active:scale-95
                     transition-all text-base"
        >
          {paused ? '▶' : '⏸'}
        </button>

        {/* Speed buttons */}
        <div className="flex gap-1 flex-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold
                          transition-all active:scale-95
                          ${speedMultiplier === s
                            ? 'bg-blue-500/70 text-white border border-blue-400/60'
                            : 'bg-white/8 hover:bg-white/15 text-white/60'
                          }`}
            >
              {SPEED_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Paused indicator */}
      {paused && (
        <div className="text-center text-xs text-yellow-400/80 tracking-widest uppercase">
          ⏸ Paused
        </div>
      )}
    </div>
  )
}