import { create } from 'zustand'

interface LocationState {
  latitude:    number
  longitude:   number
  timezone:    string
  utcOffset:   number
  detected:    boolean
  countryName: string
}

interface LocationActions {
  setLocation:   (lat: number, lon: number) => void
  setTimezone:   (tz: string, utcOffset: number) => void
  setDetected:   (v: boolean) => void
  setCountry:    (name: string) => void
}

export const useLocationStore = create<LocationState & LocationActions>((set) => ({
  latitude:    -2.2161,        // Palangkaraya default
  longitude:   113.9307,
  timezone:    'Asia/Makassar',
  utcOffset:   8,
  detected:    false,
  countryName: 'Indonesia',

  setLocation:  (lat, lon) => set({ latitude: lat, longitude: lon }),
  setTimezone:  (tz, off)  => set({ timezone: tz, utcOffset: off }),
  setDetected:  (v)        => set({ detected: v }),
  setCountry:   (name)     => set({ countryName: name }),
}))