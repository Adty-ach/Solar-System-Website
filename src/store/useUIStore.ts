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
  | 'settings'
  | 'about'

interface UIState {
  dashboardOpen: boolean
  activePanel:   ActivePanel
}

interface UIActions {
  openDashboard:  () => void
  closeDashboard: () => void
  toggleDashboard: () => void
  setActivePanel: (panel: ActivePanel) => void
  closePanel:     () => void
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  dashboardOpen: false,
  activePanel:   null,

  openDashboard:   () => set({ dashboardOpen: true }),
  closeDashboard:  () => set({ dashboardOpen: false, activePanel: null }),
  toggleDashboard: () => set((s) => ({ dashboardOpen: !s.dashboardOpen })),
  setActivePanel:  (panel) => set({ activePanel: panel }),
  closePanel:      () => set({ activePanel: null }),
}))