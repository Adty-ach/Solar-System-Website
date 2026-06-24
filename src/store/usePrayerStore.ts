import { create } from 'zustand'
import type { PrayerSchedule, PrayerMethod } from '../engines/prayer'

interface PrayerState {
  schedule:  PrayerSchedule | null
  method:    PrayerMethod
  setSchedule: (s: PrayerSchedule) => void
  setMethod:   (m: PrayerMethod)   => void
}

export const usePrayerStore = create<PrayerState>((set) => ({
  schedule:    null,
  method:      'MWL',
  setSchedule: (s) => set({ schedule: s }),
  setMethod:   (m) => set({ method: m   }),
}))