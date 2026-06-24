import { useEffect, useRef } from 'react'
import { useSimStore }        from '../store/useSimStore'
import { useLocationStore }   from '../store/useLocationStore'
import { useAstronomyStore }  from '../store/useAstronomyStore'
import { calcAstronomy }      from '../engines/astronomy'

// Recalculate at most every 2 seconds of sim time
const RECALC_SIM_MS = 2000

export function useAstronomy(): void {
  const simTime   = useSimStore((s) => s.simTime)
  const lat       = useLocationStore((s) => s.latitude)
  const lon       = useLocationStore ((s) => s.longitude)
  const setResult = useAstronomyStore((s) => s.setResult)

  const lastCalc  = useRef<number>(0)

  useEffect(() => {
    const now = simTime.getTime()
    if (Math.abs(now - lastCalc.current) < RECALC_SIM_MS) return

    lastCalc.current = now
    const result = calcAstronomy(simTime, lat, lon)
    setResult(result)
  }, [simTime, lat, lon, setResult])
}