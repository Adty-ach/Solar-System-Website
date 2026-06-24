import { useEffect } from 'react'
import { useLocationStore } from '../store/useLocationStore'

export function useUserLocation(): void {
  const setLocation = useLocationStore((s) => s.setLocation)
  const setTimezone = useLocationStore ((s) => s.setTimezone)
  const setDetected = useLocationStore((s) => s.setDetected)
  const setCountry  = useLocationStore((s) => s.setCountry)

  useEffect(() => {
    // Get UTC offset from browser
    const offset = -new Date().getTimezoneOffset() / 60
    const tz     = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(tz, offset)

    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setLocation(lat, lon)
        setDetected(true)

        // Reverse geocode — country name
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          )
          const json = await res.json()
          setCountry(json.address?.country ?? '')
        } catch {
          // silently fail — country not critical
        }
      },
      () => {
        // Permission denied — keep defaults
        setDetected(false)
      },
      { timeout: 8000, maximumAge: 300000 }
    )
  }, [])
}