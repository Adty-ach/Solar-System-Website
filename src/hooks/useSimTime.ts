import { useEffect, useRef } from 'react'
import { useSimStore }        from '../store/useSimStore'

const STORE_SYNC_MS = 50   // 20fps store updates — smooth enough

export function useSimTime(): void {
  const setSimTime = useSimStore((s) => s.setSimTime)

  // Internal high-res clock — never triggers re-renders
  const simMs    = useRef<number>(Date.now())
  const lastReal = useRef<number>(performance.now())
  const lastSync = useRef<number>(0)
  const rafId    = useRef<number>(0)

  // Mirror store values into refs — loop never restarts
  const pausedRef = useRef(false)
  const speedRef  = useRef<number>(1)

  // Sync simMs when store is externally modified (jumpBy, resetToEpoch)
  const externalSimMs = useSimStore((s) => s.simTime.getTime())
  const lastExternal  = useRef<number>(externalSimMs)

  useEffect(() => {
    // Detect external jump — sync internal clock
    if (Math.abs(externalSimMs - simMs.current) > 200) {
      simMs.current    = externalSimMs
      lastExternal.current = externalSimMs
    }
  }, [externalSimMs])

  useEffect(() => {
    const unsub = useSimStore.subscribe((state) => {
      pausedRef.current = state.paused
      speedRef.current  = state.speedMultiplier
    })
    // Set initial values
    const s = useSimStore.getState()
    pausedRef.current = s.paused
    speedRef.current  = s.speedMultiplier
    simMs.current     = s.simTime.getTime()
    return unsub
  }, [])

  useEffect(() => {
    lastReal.current = performance.now()

    function tick(now: number): void {
      const realDelta = now - lastReal.current
      lastReal.current = now

      // Cap delta to avoid spiral after tab switch
      const cappedDelta = Math.min(realDelta, 100)

      if (!pausedRef.current) {
        simMs.current += cappedDelta * speedRef.current
      }

      // Push to store at 20fps
      if (now - lastSync.current >= STORE_SYNC_MS) {
        setSimTime(new Date(simMs.current))
        lastSync.current = now
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [setSimTime])
}