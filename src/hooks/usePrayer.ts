import { useEffect, useRef } from 'react'
import { useSimStore }        from '../store/useSimStore'
import { useLocationStore }   from '../store/useLocationStore'
import { usePrayerStore }     from '../store/usePrayerStore'
import { calcPrayerSchedule } from '../engines/prayer'

const RECALC_INTERVAL_MS = 60_000

export function usePrayer(): void {
  const simTime     = useSimStore((s) => s.simTime)
  const lat         = useLocationStore((s) => s.latitude)
  const lon         = useLocationStore((s) => s.longitude)
  const utcOffset   = useLocationStore((s) => s.utcOffset)
  const method      = usePrayerStore((s) => s.method)
  const setSchedule = usePrayerStore((s) => s.setSchedule)

  const lastCalcMs  = useRef<number>(0)
  const lastDateKey = useRef<string>('')
  const lastMethod  = useRef<string>('')        // ← tambah ini

  useEffect(() => {
    const now       = simTime.getTime()
    const dateKey   = simTime.toISOString().slice(0, 10)

    const dateChanged    = dateKey  !== lastDateKey.current
    const methodChanged  = method   !== lastMethod.current   // ← tambah ini
    const intervalPassed = Math.abs(now - lastCalcMs.current) >= RECALC_INTERVAL_MS

    if (!dateChanged && !methodChanged && !intervalPassed) return

    lastCalcMs.current  = now
    lastDateKey.current = dateKey
    lastMethod.current  = method                             // ← tambah ini

    const schedule = calcPrayerSchedule(simTime, lat, lon, utcOffset, method)
    setSchedule(schedule)
  }, [simTime, lat, lon, utcOffset, method, setSchedule])   // method sudah ada di deps
}