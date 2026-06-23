import { create } from 'zustand'

interface LocationState {
  latitude:  number
  longitude: number
  timezone:  string        // IANA format e.g. "Asia/Riyadh"
  utcOffset: number        // hours, derived for convenience
}

interface LocationActions {
  setLocation: (lat: number, lon: number) => void
  setTimezone: (tz: string, utcOffset: number) => void
}

export const useLocationStore = create<LocationState & LocationActions>((set) => ({
  latitude:  21.3891,         // Mecca default
  longitude: 39.8579,
  timezone:  'Asia/Riyadh',
  utcOffset: 3,

  setLocation: (lat, lon) => set({ latitude: lat, longitude: lon }),
  setTimezone: (tz, offset) => set({ timezone: tz, utcOffset: offset }),
}))