import { create } from 'zustand'

export const SPEED_OPTIONS = [1, 10, 100, 1000, 10000, 100000] as const
export type SpeedMultiplier = (typeof SPEED_OPTIONS)[number]

const EPOCH_MS = Date.now()

interface SimState {
  epochMs:         number
  simTime:         Date
  paused:          boolean
  speedMultiplier: SpeedMultiplier
}

interface SimActions {
  setSimTime:         (time: Date) => void
  setPaused:          (v: boolean) => void
  togglePause:        () => void
  setSpeedMultiplier: (s: SpeedMultiplier) => void
  resetToEpoch:       () => void
  jumpBy:             (ms: number) => void
}

export const useSimStore = create<SimState & SimActions>((set) => ({
  epochMs:         EPOCH_MS,
  simTime:         new Date(EPOCH_MS),
  paused:          false,
  speedMultiplier: 1,

  setSimTime:         (time) => set({ simTime: time }),
  setPaused:          (v)    => set({ paused: v }),
  togglePause:        ()     => set((s) => ({ paused: !s.paused })),
  setSpeedMultiplier: (s)    => set({ speedMultiplier: s }),

  resetToEpoch: () => set((s) => ({
    simTime:         new Date(s.epochMs),
    paused:          false,
    speedMultiplier: 1,
  })),

  jumpBy: (ms) => set((s) => ({
    simTime: new Date(s.simTime.getTime() + ms),
  })),
}))