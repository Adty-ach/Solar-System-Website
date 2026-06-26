import { create } from 'zustand'

export type ActivePanel =
  | null
  | 'home'
  | 'solar-system'
  | 'earth'
  | 'prayer'
  | 'astronomy'
  | 'calendar'
  | 'learn'
  | 'community'
  | 'settings'
  | 'about'

interface UIState {
  dashboardOpen:    boolean
  activePanel:      ActivePanel
  showOrbitLines:   boolean
  showPlanetLabels: boolean
}

interface UIActions {
  openDashboard:      () => void
  closeDashboard:     () => void
  toggleDashboard:    () => void
  setActivePanel:     (panel: ActivePanel) => void
  closePanel:         () => void
  toggleOrbitLines:   () => void
  togglePlanetLabels: () => void
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  dashboardOpen:    false,
  activePanel:      null,
  showOrbitLines:   true,
  showPlanetLabels: false,

  openDashboard:    () => set({ dashboardOpen: true }),
  closeDashboard:   () => set({ dashboardOpen: false, activePanel: null }),
  toggleDashboard:  () => set((s) => ({ dashboardOpen: !s.dashboardOpen })),
  setActivePanel:   (panel) => set({ activePanel: panel }),
  closePanel:       () => set({ activePanel: null }),

  toggleOrbitLines:   () => set((s) => ({ showOrbitLines:   !s.showOrbitLines   })),
  togglePlanetLabels: () => set((s) => ({ showPlanetLabels: !s.showPlanetLabels })),
}))