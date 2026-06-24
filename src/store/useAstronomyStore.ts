import { create } from 'zustand'
import type { AstronomyResult } from '../engines/astronomy'

interface AstronomyState {
  result: AstronomyResult | null
  setResult: (r: AstronomyResult) => void
}

export const useAstronomyStore = create<AstronomyState>((set) => ({
  result:    null,
  setResult: (r) => set({ result: r }),
}))