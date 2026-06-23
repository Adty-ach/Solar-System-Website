import { create } from 'zustand'

export const SPEED_OPTIONS = [1, 10, 100, 1000, 10000] as const
export type SpeedMultiplier = (typeof SPEED_OPTIONS)[number]

interface SimState {
  simTime: Date
  paused: boolean
  speedMultiplier: SpeedMultiplier
}

interface SimActions {
  setSimTime: (time: Date) => void
  setPaused: (paused: boolean) => void
  togglePause: () => void
  setSpeedMultiplier: (speed: SpeedMultiplier) => void
}

export const useSimStore = create<SimState & SimActions>((set) => ({
  simTime: new Date(),
  paused: false,
  speedMultiplier: 1,

  setSimTime:         (time)  => set({ simTime: time }),
  setPaused:          (p)     => set({ paused: p }),
  togglePause:        ()      => set((s) => ({ paused: !s.paused })),
  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
}))