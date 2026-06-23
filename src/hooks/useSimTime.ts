import { useEffect, useRef } from 'react'
import { useSimStore } from '../store/useSimStore'

// Push to Zustand at max 10fps — planets will read simTime
// via useFrame at full 60fps using a shared ref instead.
const STORE_SYNC_MS = 100

export function useSimTime(): void {
  const setSimTime      = useSimStore((s) => s.setSimTime)
  const paused          = useSimStore((s) => s.paused)
  const speedMultiplier = useSimStore((s) => s.speedMultiplier)

  // Internal clock — no React state, no re-renders
  const simMs    = useRef<number>(Date.now())
  const lastReal = useRef<number>(performance.now())
  const lastSync = useRef<number>(0)
  const rafId    = useRef<number>(0)

  // Mirror latest values into refs so the loop never restarts
  const pausedRef = useRef(paused)
  const speedRef  = useRef(speedMultiplier)

  useEffect(() => { pausedRef.current = paused          }, [paused])
  useEffect(() => { speedRef.current  = speedMultiplier }, [speedMultiplier])

  useEffect(() => {
    lastReal.current = performance.now()

    function tick(now: number): void {
      const delta = now - lastReal.current
      lastReal.current = now

      if (!pausedRef.current) {
        simMs.current += delta * speedRef.current
      }

      // Throttle Zustand writes to prevent cascading re-renders
      if (now - lastSync.current >= STORE_SYNC_MS) {
        setSimTime(new Date(simMs.current))
        lastSync.current = now
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [setSimTime]) // stable ref — loop never restarts
}