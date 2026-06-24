import { useEffect, useRef } from 'react'
import { useSimStore }        from '../store/useSimStore'
import { useLocationStore }   from '../store/useLocationStore'
import { usePrayerStore }     from '../store/usePrayerStore'
import { calcPrayerSchedule } from '../engines/prayer'

// Recalculate when date changes (not every second)
const RECALC_INTERVAL_MS = 60_000   // 1 sim-minute

export function usePrayer(): void {
  const simTime   = useSimStore((s) => s.simTime)
  const lat       = useLocationStore((s) => s.latitude)
  const lon       = useLocationStore((s) => s.longitude)
  const utcOffset = useLocationStore((s) => s.utcOffset)
  const method    = usePrayerStore((s) => s.method)
  const setSchedule = usePrayerStore((s) => s.setSchedule)

  const lastCalc = useRef<number>(0)
  const lastDate = useRef<string>('')

  useEffect(() => {
    const now     = simTime.getTime()
    const dateKey = simTime.toISOString().slice(0, 10)  // YYYY-MM-DD

    // Recalculate if date changed OR interval passed
    const dateChanged     = dateKey !== lastDate.current
    const intervalPassed  = Math.abs(now - lastCalc.current) >= RECALC_INTERVAL_MS

    if (!dateChanged && !intervalPassed) return

    lastCalc.current = now
    lastDate.current = dateKey

    const schedule = calcPrayerSchedule(simTime, lat, lon, utcOffset, method)
    setSchedule(schedule)
  }, [simTime, lat, lon, utcOffset, method, setSchedule])
}